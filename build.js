const esbuild = require("esbuild");
const fs = require("fs/promises");
const path = require("path");
const config = require("./config");

const copyStatic = async () => {
  return await fs.cp("./static", config.outDir, {
    recursive: true,
    force: true,
  });
};

const build = () =>
  esbuild.build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    outfile: path.join(config.outDir, "index.js"),
  });

(async () => {
  try {
    const watcher = fs.watch("./src");

    for await (const event of watcher) {
      try {
        console.log(event);
        await build();
      } catch (e) {
        console.error(e);
      }
    }
  } catch (e) {
    console.error(e);
  }
})();

build();
copyStatic();
