const webp = require("webp-converter");
const fs = require("fs");

if (!fs.existsSync("input")) {
  fs.mkdirSync("input");

  console.log("Files not found!");
  return;
}

if (fs.existsSync("output")) {
  fs.rmdirSync("output");
}

fs.mkdirSync("output");
readDir("input");

function readDir(path) {
  fs.readdirSync(path).forEach((file) => {
    let currentFs = require("fs");
    let newPath = path + "/" + file;
    let outputPath = newPath.split("/");
    outputPath[0] = "output";
    outputPath = outputPath.join("/");

    if (currentFs.lstatSync(newPath).isDirectory()) {
      currentFs.mkdir(outputPath, null, (error) => {
        readDir(newPath);
      });
    } else if (getExtension(newPath) === ".webp") {
      webp.dwebp(newPath, outputPath.replace(".webp", ".png"), "-o", (status) => {
        if (status.split("\n")[0] === "101") {
          // if simple renamed picture to webp
          fs.createReadStream(newPath).pipe(fs.createWriteStream(outputPath.replace(".webp", ".jpg")));
        } else {
          console.log(newPath + " - done");
        }
      });
    }
  });
}

function getExtension(filename) {
  let pos = filename.lastIndexOf(".");
  return (pos > 0) ? filename.substr(pos) : "";
}