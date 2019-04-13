const marked = require("marked");
const fs = require("fs");
const { format } = require("prettier");

const htmlTemplate = ({
  title = "Document",
  css = "style.css",
  header,
  footer,
  mainContent
}) => {
  return format(
    `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <link rel="stylesheet" href="${css}">
  <title>${title}</title>
</head>
<body>

<main>
<header>${marked(header)}</header>
  ${marked(mainContent)}
  </main>
  <footer>${marked(footer)}</footer>
</body>
</html>`,
    { parser: "html" }
  );
};

const build = () => {
  fs.readFile("README.md", "utf8", (err, content) => {
    if (err) {
      console.log(err);
    } else {
      const [header, rest] = content.split("<!-- End header -->");
      const [blockContent, footer] = rest.split("<!-- Start footer -->");
      let mainContent = blockContent.replace(
        /<!--start /gi,
        '<section class="'
      );
      mainContent = mainContent.replace(/ -->/gi, '">');
      mainContent = mainContent.replace(/<!--end-->/gi, "</section>");
      const fullContent = htmlTemplate({
        title: "CV",
        css: "style.css",
        header,
        footer,
        mainContent
      });
      fs.writeFile("index.html", fullContent, err => {
        if (err) {
          console.log(err);
        }
      });
    }
  });
};

fs.watch("README.md", build);
