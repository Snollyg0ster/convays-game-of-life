const esbuild = require("esbuild");
const fs = require("fs/promises");

const copyStatic = async () => {
  return await fs.cp("./static", "./dist", { recursive: true, force: true });
};

const build = () =>
  esbuild.build({
    entryPoints: ["./src/index.ts"],
    bundle: true,
    outfile: "./dist/index.js",
  });

(async () => {
  try {
    const watcher = fs.watch("./src");

    for await (const event of watcher) {
      console.log(event);
      build();
    }
  } catch (e) {
    console.error(e);
  }
})();

build();
copyStatic();