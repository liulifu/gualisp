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

详细设定见 [about.md](about.md)。
