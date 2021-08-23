import fs from "fs/promises";

export const resHandler = (req, res, next) => {
  // fs.readFile("my-page.html", "utf8", (err, data) => {
  //   res.send(data);
  // });

  // This won't work. ES Module don't have these global vars
  // res.sendFile(path.join(__dirname,"my-page.html"));

  // const __filename = fileURLToPath(import.meta.url);
  // const __dirname = dirname(__filename);
  //
  // res.sendFile(path.join(__dirname, "my-page.html"));

  // Using Promise instead of callback
  fs.readFile("my-page.html", "utf-8")
    .then((data) => {
      res.send(data);
    })
    .catch((err) => console.log(err));
};

// module.exports = resHandler;
// export default resHandler; // for only 1 export
