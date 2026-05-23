# 卦LISP

卦LISP 是一个探索中国传统玄学、术数与计算机语言融合的实验性语言项目。

当前 MVP 支持将 `.gua` 源码编译成 TypeScript，并通过 Bun 运行。

## 编译示例

```bash
.\gua.cmd build examples/jiuzhang.gua -o dist/jiuzhang.ts
.\gua.cmd build examples/lianshan.gua -o dist/lianshan.ts
```

## 运行示例

```bash
bun dist/jiuzhang.ts
bun dist/lianshan.ts
```

## 当前模块

- `九章`：古典数术核心
- `九章外`：现代计算补充
- `连山`：数据结构

## License

This project is source-available under the PolyForm Strict License 1.0.0.

- Personal, research, experiment, study, and other noncommercial use is permitted.
- Commercial use is not permitted.
- Distribution, sublicensing, and modified derivative distribution are not permitted under this license.

See [LICENSE](LICENSE) for details.

## Web 编辑器

```bash
.\web.cmd
```

或：

```bash
bun run web
```

启动后访问：

```txt
http://localhost:4173
```

编辑器提供表格式源码编辑、关键词工具栏、编译预览和运行输出。

当前编辑器能力：

- 默认空白页
- 可载入九章、连山、鼎观示例
- 语句关键字高亮
- 顶部 Ribbon 关键词插入
- 右上角帮助页，提供卦LISP 与 TypeScript 语法对照

详细设定见 [about.md](about.md)。
