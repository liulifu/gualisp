import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, extname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { compile } from "../compiler/gua.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = join(root, "public");
const tmpDir = join(root, ".tmp");
const port = Number(process.env.PORT ?? 4173);

const types: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}

async function readJson(request: Request) {
  try {
    return (await request.json()) as { source?: string };
  } catch {
    return {};
  }
}

async function staticFile(pathname: string) {
  const cleanPath = pathname === "/" ? "/index.html" : pathname;
  const fullPath = join(publicDir, cleanPath);
  const file = Bun.file(fullPath);
  if (!(await file.exists())) return null;
  return new Response(file, {
    headers: {
      "Content-Type": types[extname(fullPath)] ?? "application/octet-stream",
      "Cache-Control": "no-store",
    },
  });
}

async function runTypeScript(ts: string) {
  await mkdir(tmpDir, { recursive: true });
  const file = join(tmpDir, `run-${Date.now()}-${Math.random().toString(16).slice(2)}.ts`);
  await writeFile(file, ts, "utf8");
  const proc = Bun.spawn([process.execPath, file], {
    stdout: "pipe",
    stderr: "pipe",
  });
  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);
  await rm(file, { force: true });
  return { stdout, stderr, exitCode };
}

Bun.serve({
  port,
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/compile" && request.method === "POST") {
      const body = await readJson(request);
      try {
        return json({ ok: true, ts: compile(body.source ?? "") });
      } catch (error) {
        return json({ ok: false, error: error instanceof Error ? error.message : String(error) }, 400);
      }
    }

    if (url.pathname === "/api/run" && request.method === "POST") {
      const body = await readJson(request);
      try {
        const ts = compile(body.source ?? "");
        const result = await runTypeScript(ts);
        if (result.exitCode === 0) return json({ ok: true, ts, output: result.stdout });
        return json({ ok: false, ts, error: result.stderr || result.stdout || "运行失败" }, 400);
      } catch (error) {
        return json({ ok: false, error: error instanceof Error ? error.message : String(error) }, 400);
      }
    }

    const file = await staticFile(url.pathname);
    if (file) return file;
    return new Response("Not Found", { status: 404 });
  },
});

console.log(`卦LISP 编辑器: http://localhost:${port}`);
