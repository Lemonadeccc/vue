//帮打包packages下的模块，最终打包出js文件

// node dev.js 要打包的名字 -f 打包的格式

import minimist from "minimist";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";
import esbuild from "esbuild";
// node 中的命令函数参数通过process 来获取 process.argv
const args = minimist(process.argv.slice(2));
//esm使用commonjs变量
const __filename = fileURLToPath(import.meta.url); // 获取文件的绝对路径 file: -> /usr
const __dirname = dirname(__filename);
const require = createRequire(import.meta.url);
const target = args._[0] || "reactivity"; // 打包哪个项目
const format = args.f || "iife"; //打包后的模块化规范

console.log(target, format);

// node中的esm模块没有 __dirname

//入口文件 根据命令行提供的路径进行解析
const entry = resolve(__dirname, `../packages/${target}/src/index.ts`);
const pkg = require(`../packages/${target}/package.json`);

//根据需要进行打包
esbuild
  .context({
    entryPoints: [entry], // 入口
    outfile: resolve(__dirname, `../packages/${target}/dist/${target}.js`),
    bundle: true, // reactivity -> shared
    platform: "browser", // 打包后给浏览器使用
    sourcemap: true, // 可以调试源代码
    format, // cjs esm iife  var x = (function(){ var xx return xxx})
    globalName: pkg.buildOptions?.name,
  })
  .then((ctx) => {
    console.log("start dev");

    return ctx.watch(); // 监控入口文件持续进行打包处理
  });
