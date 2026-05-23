#!/usr/bin/env node

import { main } from "../compiler/gua.mjs";

await main(process.argv.slice(2));
