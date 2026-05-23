#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, extname, join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const math = (fn, min = 1) => ({ kind: "math", fn, min });
const raw = (code) => ({ kind: "raw", code, min: 0 });

const registry = {
  九章: {
    益: { kind: "infix", op: "+", min: 2 },
    损: { kind: "infix", op: "-", min: 2 },
    丰: { kind: "infix", op: "*", min: 2 },
    节: { kind: "infix", op: "/", min: 2 },
    剥: { kind: "infix", op: "%", min: 2 },
    升: { kind: "infix", op: "**", min: 2 },
    同人: { kind: "infix", op: "===", min: 2 },
    睽: { kind: "infix", op: "!==", min: 2 },
    大过: { kind: "infix", op: ">", min: 2 },
    小过: { kind: "infix", op: "<", min: 2 },
    大畜: { kind: "infix", op: ">=", min: 2 },
    小畜: { kind: "infix", op: "<=", min: 2 },
    比: { kind: "infix", op: "&&", min: 2 },
    否: { kind: "prefix", op: "!", min: 1 },
    方田: { kind: "call", fn: "__九章方田", min: 2 },
    粟米: { kind: "call", fn: "__九章粟米", min: 3 },
    衰分: { kind: "call", fn: "__九章衰分", min: 2 },
    少广: { kind: "call", fn: "__九章少广", min: 1 },
    商功: { kind: "call", fn: "__九章商功", min: 3 },
    均输: { kind: "call", fn: "__九章均输", min: 1 },
    盈不足: { kind: "call", fn: "__九章盈不足", min: 4 },
    方程: { kind: "call", fn: "__九章方程", min: 6 },
    勾股: { kind: "call", fn: "__九章勾股", min: 2 },
  },
  九章外: {
    圆周率: raw("Math.PI"),
    自然常: raw("Math.E"),
    根二: raw("Math.SQRT2"),
    半根二: raw("Math.SQRT1_2"),
    绝: math("abs"),
    反余弦: math("acos"),
    反双曲余弦: math("acosh"),
    反正弦: math("asin"),
    反双曲正弦: math("asinh"),
    反正切: math("atan"),
    方位角: math("atan2", 2),
    反双曲正切: math("atanh"),
    立方根: math("cbrt"),
    上取: math("ceil"),
    前零: math("clz32"),
    余弦: math("cos"),
    双曲余弦: math("cosh"),
    指数: math("exp"),
    指数减一: math("expm1"),
    半精: math("f16round"),
    下取: math("floor"),
    单精: math("fround"),
    平方和根: math("hypot", 2),
    整乘: math("imul", 2),
    对数: math("log"),
    常对数: math("log10"),
    对数加一: math("log1p"),
    二对数: math("log2"),
    最大: math("max"),
    最小: math("min"),
    幂: math("pow", 2),
    随机: math("random", 0),
    四舍: math("round"),
    符: math("sign"),
    正弦: math("sin"),
    双曲正弦: math("sinh"),
    平方根: math("sqrt"),
    精和: math("sumPrecise"),
    正切: math("tan"),
    双曲正切: math("tanh"),
    截整: math("trunc"),
  },
  连山: {
    列: { kind: "call", fn: "__连山列", min: 0 },
    集: { kind: "call", fn: "__连山集", min: 0 },
    典: { kind: "call", fn: "__连山典", min: 0 },
    栈: { kind: "call", fn: "__连山列", min: 0 },
    队: { kind: "call", fn: "__连山列", min: 0 },
    长: { kind: "call", fn: "__连山长", min: 1 },
    首: { kind: "call", fn: "__连山首", min: 1 },
    尾: { kind: "call", fn: "__连山尾", min: 1 },
    取: { kind: "call", fn: "__连山取", min: 2 },
    置: { kind: "call", fn: "__连山置", min: 3 },
    接: { kind: "call", fn: "__连山接", min: 2 },
    并: { kind: "call", fn: "__连山并", min: 2 },
    映: { kind: "call", fn: "__连山映", min: 2 },
    滤: { kind: "call", fn: "__连山滤", min: 2 },
    折: { kind: "call", fn: "__连山折", min: 3 },
    含: { kind: "call", fn: "__连山含", min: 2 },
    键: { kind: "call", fn: "__连山键", min: 1 },
    值: { kind: "call", fn: "__连山值", min: 1 },
    入集: { kind: "call", fn: "__连山入集", min: 2 },
    出集: { kind: "call", fn: "__连山出集", min: 2 },
    并集: { kind: "call", fn: "__连山并集", min: 2 },
    交集: { kind: "call", fn: "__连山交集", min: 2 },
    差集: { kind: "call", fn: "__连山差集", min: 2 },
    压: { kind: "call", fn: "__连山压", min: 2 },
    弹: { kind: "call", fn: "__连山弹", min: 1 },
    入队: { kind: "call", fn: "__连山入队", min: 2 },
    出队: { kind: "call", fn: "__连山出队", min: 1 },
  },
};

const declarations = new Set(["乾", "坤"]);
const modulePreambles = {
  九章: `function __九章方田(形, ...数) {
  if (形 === "方" || 形 === "正方" || 形 === "方形") return 数[0] * 数[0];
  if (形 === "矩" || 形 === "矩形") return 数[0] * 数[1];
  if (形 === "圆" || 形 === "圆田") return Math.PI * 数[0] * 数[0];
  if (形 === "三角" || 形 === "圭田") return (数[0] * 数[1]) / 2;
  throw new Error("方田 未知形制: " + 形);
}

function __九章粟米(原量, 原率, 今率) {
  return (原量 * 今率) / 原率;
}

function __九章衰分(总数, 权重) {
  const 合 = 权重.reduce((和, 数) => 和 + 数, 0);
  return 权重.map((数) => (总数 * 数) / 合);
}

function __九章少广(数, 次 = 2) {
  return 数 ** (1 / 次);
}

function __九章商功(形, ...数) {
  if (形 === "方仓" || 形 === "长方体") return 数[0] * 数[1] * 数[2];
  if (形 === "圆柱") return Math.PI * 数[0] * 数[0] * 数[1];
  if (形 === "堑堵" || 形 === "三棱柱") return (数[0] * 数[1] * 数[2]) / 2;
  throw new Error("商功 未知形制: " + 形);
}

function __九章均输(...数) {
  return 数.reduce((和, 值) => 和 + 值, 0) / 数.length;
}

function __九章盈不足(盈率, 盈数, 不足率, 不足数) {
  return (盈率 * 不足数 + 不足率 * 盈数) / (盈数 + 不足数);
}

function __九章方程(a, b, e, c, d, f) {
  const 行列式 = a * d - b * c;
  if (行列式 === 0) throw new Error("方程 无唯一解");
  return [(e * d - b * f) / 行列式, (a * f - e * c) / 行列式];
}

function __九章勾股(a, b) {
  return Math.hypot(a, b);
}`,
  连山: `function __连山列(...项) {
  return 项;
}

function __连山集(...项) {
  return new Set(项);
}

function __连山典(...项) {
  if (项.length % 2 !== 0) throw new Error("典 需要成对的键和值");
  const 物 = {};
  for (let i = 0; i < 项.length; i += 2) 物[项[i]] = 项[i + 1];
  return 物;
}

function __连山长(物) {
  if (物 == null) return 0;
  if (typeof 物 === "string" || Array.isArray(物)) return 物.length;
  if (物 instanceof Set || 物 instanceof Map) return 物.size;
  return Object.keys(物).length;
}

function __连山首(物) {
  if (物 instanceof Set) return [...物][0];
  return 物[0];
}

function __连山尾(物) {
  if (物 instanceof Set) return [...物].slice(1);
  return 物.slice(1);
}

function __连山取(物, 位) {
  if (物 instanceof Map) return 物.get(位);
  return 物[位];
}

function __连山置(物, 位, 值) {
  if (Array.isArray(物)) {
    const 新 = [...物];
    新[位] = 值;
    return 新;
  }
  if (物 instanceof Map) {
    const 新 = new Map(物);
    新.set(位, 值);
    return 新;
  }
  return { ...物, [位]: 值 };
}

function __连山接(物, ...项) {
  if (物 instanceof Set) return new Set([...物, ...项]);
  return [...物, ...项];
}

function __连山并(...诸物) {
  if (诸物.every(Array.isArray)) return 诸物.flat();
  if (诸物.every((物) => 物 instanceof Set)) return new Set(诸物.flatMap((物) => [...物]));
  if (诸物.every((物) => 物 && typeof 物 === "object" && !Array.isArray(物))) return Object.assign({}, ...诸物);
  return 诸物.flatMap((物) => Array.isArray(物) ? 物 : [物]);
}

function __连山映(列, 函) {
  return 列.map(函);
}

function __连山滤(列, 函) {
  return 列.filter(函);
}

function __连山折(列, 初, 函) {
  return 列.reduce(函, 初);
}

function __连山含(物, 值) {
  if (物 instanceof Set || 物 instanceof Map) return 物.has(值);
  if (Array.isArray(物) || typeof 物 === "string") return 物.includes(值);
  return Object.prototype.hasOwnProperty.call(物, 值);
}

function __连山键(物) {
  if (物 instanceof Map) return [...物.keys()];
  return Object.keys(物);
}

function __连山值(物) {
  if (物 instanceof Map || 物 instanceof Set) return [...物.values()];
  return Object.values(物);
}

function __连山入集(集, 值) {
  return new Set([...集, 值]);
}

function __连山出集(集, 值) {
  const 新 = new Set(集);
  新.delete(值);
  return 新;
}

function __连山并集(a, b) {
  return new Set([...a, ...b]);
}

function __连山交集(a, b) {
  return new Set([...a].filter((值) => b.has(值)));
}

function __连山差集(a, b) {
  return new Set([...a].filter((值) => !b.has(值)));
}

function __连山压(栈, 值) {
  return [...栈, 值];
}

function __连山弹(栈) {
  return 栈[栈.length - 1];
}

function __连山入队(队, 值) {
  return [...队, 值];
}

function __连山出队(队) {
  return 队[0];
}`,
};

function usage() {
  console.error(`用法:
  gua build <input.gua> [-o output.ts]
  gua <input.gua> <output.ts>

示例:
  gua build examples/jiuzhang.gua -o dist/jiuzhang.ts`);
}

function stripComment(line) {
  let quote = null;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (quote) {
      if (ch === quote && line[i - 1] !== "\\") quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      continue;
    }
    if (ch === ";" || ch === "#") return line.slice(0, i);
  }
  return line;
}

function tokenize(input) {
  const tokens = [];
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (/\s/.test(ch)) {
      i += 1;
      continue;
    }

    if (ch === "[" || ch === "]") {
      tokens.push({ type: ch, value: ch });
      i += 1;
      continue;
    }

    if (ch === '"' || ch === "'") {
      const quote = ch;
      let value = ch;
      i += 1;
      while (i < input.length) {
        value += input[i];
        if (input[i] === quote && input[i - 1] !== "\\") {
          i += 1;
          break;
        }
        i += 1;
      }
      tokens.push({ type: "atom", value });
      continue;
    }

    let value = "";
    while (i < input.length && !/\s|\[|\]/.test(input[i])) {
      value += input[i];
      i += 1;
    }
    tokens.push({ type: "atom", value });
  }

  return tokens;
}

function parseTokens(tokens) {
  let i = 0;

  function parseAtomOrList() {
    const token = tokens[i];
    if (!token) throw new Error("表达式意外结束");

    if (token.type === "[") {
      i += 1;
      const list = [];
      while (tokens[i]?.type !== "]") {
        if (!tokens[i]) throw new Error("缺少 ]");
        list.push(parseAtomOrList());
      }
      i += 1;
      return list;
    }

    if (token.type === "]") throw new Error("多余的 ]");
    i += 1;
    return token.value;
  }

  const expr = [];
  while (i < tokens.length) expr.push(parseAtomOrList());
  return expr;
}

function isNumberLiteral(value) {
  return /^-?(?:\d+|\d*\.\d+)$/.test(value);
}

function isStringLiteral(value) {
  return (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  );
}

function compileAtom(value) {
  if (isNumberLiteral(value) || isStringLiteral(value)) return value;
  if (value === "乾") return "true";
  if (value === "坤") return "false";
  if (value === "坎") return "null";
  if (value === "未济") return "undefined";
  return value;
}

function resolveMeaning(op, state) {
  const contexts = state.contexts.length > 0 ? [...state.contexts].reverse() : [];
  for (const context of contexts) {
    const meaning = registry[context]?.[op];
    if (meaning) return { context, meaning };
  }
  return null;
}

function compileCall(parts, state) {
  const [op, ...args] = parts;
  if (!op) throw new Error("空表达式");
  if (parts.length === 1) return compileExpr(op, state);

  if (op === "大有") {
    if (args.length < 1) throw new Error("大有 至少需要一个参数");
    return `console.log(${args.map((arg) => compileExpr(arg, state)).join(", ")})`;
  }

  if (op === "萃") {
    return `[${args.map((arg) => compileExpr(arg, state)).join(", ")}]`;
  }

  if (op === "应") {
    if (args.length < 1 || Array.isArray(args[0])) throw new Error("应 需要函数名");
    const [fn, ...callArgs] = args;
    return `${fn}(${callArgs.map((arg) => compileExpr(arg, state)).join(", ")})`;
  }

  const resolved = resolveMeaning(op, state);
  const meaning = resolved?.meaning;
  if (!meaning) throw new Error(`在 ${state.context || "无局"} 中不能取象: ${op}`);

  if (args.length < meaning.min) {
    throw new Error(`${op} 至少需要 ${meaning.min} 个参数`);
  }

  if (meaning.kind === "infix") {
    return args
      .map((arg) => compileExpr(arg, state))
      .join(` ${meaning.op} `)
      .replace(/^(.+)$/, "($1)");
  }

  if (meaning.kind === "prefix") {
    if (args.length !== 1) throw new Error(`${op} 只接受一个参数`);
    return `(${meaning.op}${compileExpr(args[0], state)})`;
  }

  if (meaning.kind === "call") {
    return `${meaning.fn}(${args.map((arg) => compileExpr(arg, state)).join(", ")})`;
  }

  if (meaning.kind === "math") {
    return `Math.${meaning.fn}(${args.map((arg) => compileExpr(arg, state)).join(", ")})`;
  }

  if (meaning.kind === "raw") {
    if (args.length > 0) throw new Error(`${op} 不接受参数`);
    return meaning.code;
  }

  throw new Error(`未知取象类型: ${meaning.kind}`);
}

function compileExpr(expr, state) {
  if (Array.isArray(expr)) return compileCall(expr, state);
  return compileAtom(expr);
}

function stripTop(parts) {
  return parts.at(-1) === "顶" ? parts.slice(0, -1) : parts;
}

function compileSimpleLine(parts, state) {
  const [head, ...rest] = parts;

  if (!head) return null;

  if (["丁", "观观", "余", "坤"].includes(head)) {
    throw new Error(`${head} 不能出现在这里`);
  }

  if (head === "入" || head === "姤") {
    if (rest.length !== 1 || Array.isArray(rest[0])) {
      throw new Error(`${head} 只接受一个模块名`);
    }
    const moduleName = rest[0];
    if (!registry[moduleName]) throw new Error(`未知模块: ${moduleName}`);
    state.context = moduleName;
    if (!state.contexts.includes(moduleName)) state.contexts.push(moduleName);
    state.modules.add(moduleName);
    return `// 入 ${moduleName}: 入${moduleName}之局`;
  }

  if (head === "出") {
    if (rest.length < 1) throw new Error("出 至少需要一个名称");
    const names = rest.map((name) => {
      if (Array.isArray(name)) throw new Error("出 只接受名称");
      return name;
    });
    return `export { ${names.join(", ")} };`;
  }

  if (head === "归") {
    if (rest.length < 1) throw new Error("归 需要一个返回值");
    const value =
      rest.length === 1 ? compileExpr(rest[0], state) : compileCall(rest, state);
    return `return ${value};`;
  }

  if (declarations.has(head)) {
    if (rest.length < 2 || Array.isArray(rest[0])) {
      throw new Error(`${head} 需要 名 值`);
    }
    const keyword = head === "乾" ? "const" : "let";
    const [name, ...valueParts] = rest;
    const value =
      valueParts.length === 1
        ? compileExpr(valueParts[0], state)
        : compileCall(valueParts, state);
    return `${keyword} ${name} = ${value};`;
  }

  if (head === "革") {
    if (rest.length < 2 || Array.isArray(rest[0])) {
      throw new Error("革 需要 名 值");
    }
    const [name, ...valueParts] = rest;
    const value =
      valueParts.length === 1
        ? compileExpr(valueParts[0], state)
        : compileCall(valueParts, state);
    return `${name} = ${value};`;
  }

  const compiled = compileCall(parts, state);
  return head === "大有" ? `${compiled};` : `console.log(${compiled});`;
}

function compileFunction(parts, lines, state, index) {
  const clean = stripTop(parts);
  const [, name, ...params] = clean;
  if (!name || Array.isArray(name)) throw new Error("鼎 需要函数名");
  if (parts.at(-1) !== "顶") throw new Error("鼎 需要以 顶 开器");
  if (params.some(Array.isArray)) throw new Error("鼎 的参数必须是名称");

  const body = compileStatements(lines, state, index + 1, new Set(["丁"]));
  if (body.terminator !== "丁") throw new Error("鼎 缺少 丁");
  return {
    code: [`function ${name}(${params.join(", ")}) {`, ...body.code.map((line) => `  ${line}`), "}"],
    next: body.next + 1,
  };
}

function conditionCode(parts, state, keyword) {
  const clean = stripTop(parts);
  const [, ...conditionParts] = clean;
  if (conditionParts.length < 1) throw new Error(`${keyword} 需要条件`);
  return conditionParts.length === 1
    ? compileExpr(conditionParts[0], state)
    : compileCall(conditionParts, state);
}

function compileCondition(parts, lines, state, index) {
  if (parts.at(-1) !== "顶") throw new Error("观 需要以 顶 开局");

  const branches = [];
  let finalBody = [];
  let cursor = index;
  const firstCondition = conditionCode(parts, state, "观");
  let body = compileStatements(lines, state, cursor + 1, new Set(["观观", "余", "坤", "丁"]));
  branches.push({ type: "if", condition: firstCondition, code: body.code });
  cursor = body.next;

  while (cursor < lines.length && lines[cursor].parts[0] === "观观") {
    const branchParts = lines[cursor].parts;
    const condition = conditionCode(branchParts, state, "观观");
    body = compileStatements(lines, state, cursor + 1, new Set(["观观", "余", "坤", "丁"]));
    branches.push({ type: "else-if", condition, code: body.code });
    cursor = body.next;
  }

  if (cursor < lines.length && lines[cursor].parts[0] === "余") {
    if (stripTop(lines[cursor].parts).length !== 1) throw new Error("余 不接受参数");
    body = compileStatements(lines, state, cursor + 1, new Set(["坤", "丁"]));
    branches.push({ type: "else", code: body.code });
    cursor = body.next;
  }

  if (cursor < lines.length && lines[cursor].parts[0] === "坤") {
    if (stripTop(lines[cursor].parts).length !== 1) throw new Error("坤 不接受参数");
    body = compileStatements(lines, state, cursor + 1, new Set(["丁"]));
    finalBody = body.code;
    cursor = body.next;
  }

  if (cursor >= lines.length || lines[cursor].parts[0] !== "丁") throw new Error("观 缺少 丁");

  const code = [];
  branches.forEach((branch, branchIndex) => {
    const prefix =
      branch.type === "if"
        ? `if (${branch.condition}) {`
        : branch.type === "else-if"
          ? `} else if (${branch.condition}) {`
          : "} else {";
    code.push(prefix);
    code.push(...branch.code.map((line) => `  ${line}`));
    if (branchIndex === branches.length - 1) code.push("}");
  });
  code.push(...finalBody);
  return { code, next: cursor + 1 };
}

function compileStatements(lines, state, start, terminators) {
  const code = [];
  let index = start;

  while (index < lines.length) {
    const { parts, lineNumber } = lines[index];
    const head = parts[0];
    if (terminators.has(head)) return { code, next: index, terminator: head };

    try {
      if (head === "鼎") {
        const compiled = compileFunction(parts, lines, state, index);
        code.push(...compiled.code);
        index = compiled.next;
        continue;
      }

      if (head === "观") {
        const compiled = compileCondition(parts, lines, state, index);
        code.push(...compiled.code);
        index = compiled.next;
        continue;
      }

      const compiled = compileSimpleLine(parts, state);
      if (compiled) code.push(compiled);
      index += 1;
    } catch (error) {
      throw new Error(`第 ${lineNumber} 行: ${error.message}`);
    }
  }

  return { code, next: index, terminator: null };
}

function sourceLines(source) {
  const lines = [];
  source.split(/\r?\n/).forEach((rawLine, index) => {
    const line = stripComment(rawLine).trim();
    if (!line) return;
    lines.push({
      lineNumber: index + 1,
      parts: parseTokens(tokenize(line)),
    });
  });
  return lines;
}

export function compile(source) {
  const state = { context: null, contexts: [], modules: new Set() };
  const out = [
    "// Generated by gua compiler MVP.",
    "// Source language: 卦LISP / 卦式表达",
    "",
  ];

  const compiled = compileStatements(sourceLines(source), state, 0, new Set());
  out.push(...compiled.code);

  const preamble = Array.from(state.modules)
    .map((moduleName) => modulePreambles[moduleName])
    .filter(Boolean)
    .join("\n\n");

  if (preamble) {
    out.splice(3, 0, preamble, "");
  }

  out.push("");
  return out.join("\n");
}

function defaultOutputPath(inputPath) {
  const ext = extname(inputPath);
  const name = basename(inputPath, ext || ".gua");
  return join("dist", `${name}.ts`);
}

function parseBuildArgs(args) {
  const [inputArg, ...rest] = args;
  if (!inputArg) return null;

  let outputArg = null;
  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i];
    if (arg === "-o" || arg === "--out") {
      if (!rest[i + 1]) throw new Error(`${arg} 需要输出路径`);
      outputArg = rest[i + 1];
      i += 1;
      continue;
    }
    throw new Error(`未知参数: ${arg}`);
  }

  return {
    input: inputArg,
    output: outputArg || defaultOutputPath(inputArg),
  };
}

function parseCliArgs(argv) {
  if (argv[0] === "build") return parseBuildArgs(argv.slice(1));

  if (argv.length === 2) {
    return {
      input: argv[0],
      output: argv[1],
    };
  }

  return null;
}

export async function compileFile(inputArg, outputArg) {
  const inputPath = resolve(inputArg);
  const outputPath = resolve(outputArg);
  const source = await readFile(inputPath, "utf8");
  const target = compile(source);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, target, "utf8");
  return { inputPath, outputPath };
}

export async function main(argv = process.argv.slice(2)) {
  const parsed = parseCliArgs(argv);
  if (!parsed) {
    usage();
    process.exitCode = 1;
    return;
  }

  const { inputPath, outputPath } = await compileFile(parsed.input, parsed.output);
  console.log(`已编译: ${inputPath} -> ${outputPath}`);
}

const isDirectRun =
  process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href;

if (isDirectRun) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
