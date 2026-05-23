type SampleName = "九章" | "连山" | "鼎观";

type Tool = {
  label: string;
  insert: string;
  title?: string;
};

type ToolGroup = {
  title: string;
  tools: Tool[];
};

type TabName = "常用" | "九章" | "九章外" | "连山" | "结构";

const samples: Record<SampleName, string> = {
  九章: `入 九章

乾 a 10
乾 b 5

大有 [益 a b 7]
大有 [方田 "矩形" 3 4]
大有 [勾股 3 4]

入 九章外
大有 [正弦 [节 [圆周率] 2]]
大有 [最大 3 9 2]`,
  连山: `入 连山

乾 xs [列 1 2 3]
大有 [长 xs]
大有 [首 xs]
大有 [接 xs 4]

乾 user [典 "名" "张三" "岁" 18]
大有 [取 user "名"]
大有 [键 user]`,
  鼎观: `入 九章
入 连山

鼎 求和 a b 顶
  归 [益 a b]
丁

乾 年龄 18
大有 [应 求和 3 5]

观 [大过 年龄 18] 顶
  大有 "已成年"
观观 [同人 年龄 18]
  大有 "刚成年"
余
  大有 "未成年"
坤
  大有 "观毕"
丁`,
};

const ribbon: Record<TabName, ToolGroup[]> = {
  常用: [
    {
      title: "入局",
      tools: [
        { label: "入九章", insert: "入 九章" },
        { label: "入九章外", insert: "入 九章外" },
        { label: "入连山", insert: "入 连山" },
      ],
    },
    {
      title: "声明与输出",
      tools: [
        { label: "乾", insert: "乾 名 值" },
        { label: "坤", insert: "坤 名 值" },
        { label: "革", insert: "革 名 值" },
        { label: "大有", insert: "大有 []" },
      ],
    },
    {
      title: "函数",
      tools: [
        { label: "鼎", insert: "鼎 函数名 参数 顶\n  归 []\n丁" },
        { label: "应", insert: "[应 函数名 参数]" },
        { label: "归", insert: "归 []" },
      ],
    },
  ],
  九章: [
    {
      title: "算术",
      tools: ["益", "损", "丰", "节", "剥", "升"].map((name) => ({
        label: name,
        insert: `[${name} a b]`,
      })),
    },
    {
      title: "比较",
      tools: ["同人", "睽", "大过", "小过", "大畜", "小畜"].map((name) => ({
        label: name,
        insert: `[${name} a b]`,
      })),
    },
    {
      title: "九章",
      tools: [
        { label: "方田", insert: '[方田 "矩形" 3 4]' },
        { label: "粟米", insert: "[粟米 10 2 5]" },
        { label: "衰分", insert: "[衰分 120 [萃 1 2 3]]" },
        { label: "少广", insert: "[少广 81]" },
        { label: "商功", insert: '[商功 "长方体" 2 3 4]' },
        { label: "均输", insert: "[均输 10 20 30]" },
        { label: "盈不足", insert: "[盈不足 8 2 4 6]" },
        { label: "方程", insert: "[方程 2 1 5 1 -1 1]" },
        { label: "勾股", insert: "[勾股 3 4]" },
      ],
    },
  ],
  九章外: [
    {
      title: "常数",
      tools: ["圆周率", "自然常", "根二", "半根二"].map((name) => ({
        label: name,
        insert: `[${name}]`,
      })),
    },
    {
      title: "数值",
      tools: ["绝", "上取", "下取", "四舍", "截整", "最大", "最小", "随机"].map((name) => ({
        label: name,
        insert: name === "随机" ? "[随机]" : `[${name} x]`,
      })),
    },
    {
      title: "三角对数",
      tools: ["正弦", "余弦", "正切", "对数", "常对数", "二对数", "平方根", "立方根"].map(
        (name) => ({ label: name, insert: `[${name} x]` }),
      ),
    },
  ],
  连山: [
    {
      title: "结构",
      tools: [
        { label: "列", insert: "[列 1 2 3]" },
        { label: "集", insert: "[集 1 2 3]" },
        { label: "典", insert: '[典 "名" "张三" "岁" 18]' },
        { label: "栈", insert: "[栈 1 2 3]" },
        { label: "队", insert: '[队 "甲" "乙"]' },
      ],
    },
    {
      title: "访问",
      tools: ["长", "首", "尾", "取", "置", "接", "并", "含", "键", "值"].map((name) => ({
        label: name,
        insert: `[${name} xs]`,
      })),
    },
    {
      title: "集合",
      tools: ["入集", "出集", "并集", "交集", "差集"].map((name) => ({
        label: name,
        insert: `[${name} s t]`,
      })),
    },
  ],
  结构: [
    {
      title: "观法",
      tools: [
        { label: "观", insert: "观 [条件] 顶\n  大有 \"成立\"\n丁" },
        { label: "观观", insert: "观观 [条件]" },
        { label: "余", insert: "余" },
        { label: "坤", insert: "坤" },
      ],
    },
    {
      title: "块",
      tools: [
        { label: "顶", insert: "顶" },
        { label: "丁", insert: "丁" },
        { label: "萃", insert: "[萃 1 2 3]" },
      ],
    },
  ],
};

let rows = samples.鼎观.split("\n");
let activeRow = 0;
let activeTab: TabName = "常用";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("缺少 #app");

function htmlEscape(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function marker(line: string) {
  const trimmed = line.trim();
  if (!trimmed) return "";
  const head = trimmed.split(/\s+/)[0];
  if (["入", "鼎", "丁", "观", "观观", "余", "坤"].includes(head)) return head;
  if (["乾", "坤", "革", "归"].includes(head)) return head;
  if (trimmed.startsWith(";")) return "注";
  return "句";
}

function render() {
  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div class="brand">卦LISP 编辑器</div>
        <div class="status">表格式编辑 · 点击工具栏插入关键词 · 编译到 TypeScript</div>
      </header>
      <section class="ribbon">
        <div class="tabs">
          ${(Object.keys(ribbon) as TabName[])
            .map((tab) => `<button class="tab ${tab === activeTab ? "active" : ""}" data-tab="${tab}">${tab}</button>`)
            .join("")}
        </div>
        <div class="tools">
          ${ribbon[activeTab]
            .map(
              (group) => `
                <div class="group">
                  <div class="buttons">
                    ${group.tools
                      .map(
                        (tool) =>
                          `<button class="tool-btn" title="${htmlEscape(tool.title ?? tool.insert)}" data-insert="${htmlEscape(
                            tool.insert,
                          )}">${tool.label}</button>`,
                      )
                      .join("")}
                  </div>
                  <div class="group-title">${group.title}</div>
                </div>
              `,
            )
            .join("")}
        </div>
      </section>
      <main class="workspace">
        <section class="editor-pane">
          <div class="pane-head">
            <div class="pane-title">卦式表格</div>
            <div class="pane-actions">
              <select class="sample-select" id="sample">
                ${(Object.keys(samples) as SampleName[])
                  .map((name) => `<option value="${name}">${name}示例</option>`)
                  .join("")}
              </select>
              <button class="cmd-btn" id="loadSample">载入</button>
              <button class="cmd-btn" id="addRow">添行</button>
              <button class="cmd-btn" id="compile">编译</button>
              <button class="cmd-btn" id="run">运行</button>
            </div>
          </div>
          <div class="grid-wrap">
            <table class="code-grid">
              <thead>
                <tr>
                  <th class="col-line">行</th>
                  <th class="col-mark">象</th>
                  <th>语句</th>
                  <th class="col-op">行事</th>
                </tr>
              </thead>
              <tbody>
                ${rows
                  .map(
                    (line, index) => `
                      <tr>
                        <td class="line-no">${index + 1}</td>
                        <td class="mark-cell">${marker(line)}</td>
                        <td><div class="stmt" contenteditable="true" spellcheck="false" data-row="${index}">${htmlEscape(line)}</div></td>
                        <td><div class="row-tools"><button class="row-btn" data-add-after="${index}">+</button><button class="row-btn" data-del="${index}">-</button></div></td>
                      </tr>
                    `,
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        </section>
        <section class="result-pane">
          <div class="pane-head">
            <div class="pane-title">编译与运行</div>
            <div class="status" id="message">待编译</div>
          </div>
          <div class="panels">
            <div class="panel">
              <div class="panel-title">TypeScript</div>
              <pre id="tsOut"></pre>
            </div>
            <div class="panel">
              <div class="panel-title">输出</div>
              <pre id="runOut"></pre>
            </div>
          </div>
        </section>
      </main>
    </div>
  `;
  bind();
}

function bind() {
  document.querySelectorAll<HTMLButtonElement>(".tab").forEach((button) => {
    button.addEventListener("click", () => {
      activeTab = button.dataset.tab as TabName;
      render();
    });
  });

  document.querySelectorAll<HTMLDivElement>(".stmt").forEach((cell) => {
    cell.addEventListener("focus", () => {
      activeRow = Number(cell.dataset.row);
    });
    cell.addEventListener("input", () => {
      rows[Number(cell.dataset.row)] = cell.textContent ?? "";
      updateMarkers();
    });
  });

  document.querySelectorAll<HTMLButtonElement>(".tool-btn").forEach((button) => {
    button.addEventListener("click", () => insertText(button.dataset.insert ?? ""));
  });

  document.querySelectorAll<HTMLButtonElement>("[data-add-after]").forEach((button) => {
    button.addEventListener("click", () => {
      rows.splice(Number(button.dataset.addAfter) + 1, 0, "");
      render();
    });
  });

  document.querySelectorAll<HTMLButtonElement>("[data-del]").forEach((button) => {
    button.addEventListener("click", () => {
      if (rows.length === 1) rows = [""];
      else rows.splice(Number(button.dataset.del), 1);
      activeRow = Math.min(activeRow, rows.length - 1);
      render();
    });
  });

  document.querySelector<HTMLButtonElement>("#addRow")?.addEventListener("click", () => {
    rows.push("");
    activeRow = rows.length - 1;
    render();
  });

  document.querySelector<HTMLButtonElement>("#loadSample")?.addEventListener("click", () => {
    const selected = document.querySelector<HTMLSelectElement>("#sample")?.value as SampleName;
    rows = samples[selected].split("\n");
    activeRow = 0;
    render();
  });

  document.querySelector<HTMLButtonElement>("#compile")?.addEventListener("click", compileSource);
  document.querySelector<HTMLButtonElement>("#run")?.addEventListener("click", runSource);
}

function updateMarkers() {
  document.querySelectorAll<HTMLTableRowElement>(".code-grid tbody tr").forEach((row, index) => {
    const mark = row.querySelector<HTMLTableCellElement>(".mark-cell");
    if (mark) mark.textContent = marker(rows[index] ?? "");
  });
}

function focusActiveRow() {
  const cell = document.querySelector<HTMLDivElement>(`.stmt[data-row="${activeRow}"]`);
  cell?.focus();
}

function insertText(text: string) {
  const parts = text.split("\n");
  const current = rows[activeRow] ?? "";
  rows[activeRow] = current ? `${current} ${parts[0]}` : parts[0];
  if (parts.length > 1) rows.splice(activeRow + 1, 0, ...parts.slice(1));
  render();
  focusActiveRow();
}

function source() {
  return rows.join("\n");
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return response.json() as Promise<T>;
}

function setMessage(text: string, ok = true) {
  const message = document.querySelector<HTMLDivElement>("#message");
  if (!message) return;
  message.textContent = text;
  message.className = ok ? "status ok" : "status err";
}

async function compileSource() {
  const result = await postJson<{ ok: boolean; ts?: string; error?: string }>("/api/compile", { source: source() });
  const tsOut = document.querySelector<HTMLPreElement>("#tsOut");
  if (!tsOut) return;
  if (result.ok) {
    tsOut.textContent = result.ts ?? "";
    setMessage("编译成功");
  } else {
    tsOut.textContent = result.error ?? "编译失败";
    setMessage("编译失败", false);
  }
}

async function runSource() {
  const result = await postJson<{ ok: boolean; ts?: string; output?: string; error?: string }>("/api/run", {
    source: source(),
  });
  const tsOut = document.querySelector<HTMLPreElement>("#tsOut");
  const runOut = document.querySelector<HTMLPreElement>("#runOut");
  if (!tsOut || !runOut) return;
  if (result.ok) {
    tsOut.textContent = result.ts ?? "";
    runOut.textContent = result.output ?? "";
    setMessage("运行完成");
  } else {
    runOut.textContent = result.error ?? "运行失败";
    setMessage("运行失败", false);
  }
}

render();
