const { hRefine } = require("../utils/helper");
const toParagraph = function (text = "") {
  let status = false;
  const para = this.passParaCore(text);
  text = para.value;
  const paraStat = para.status;
  if (paraStat) {
    text = text.map((value) => this.publicMethods(value, "correctText")); //correct text from here
    text = hRefine(text);
    status = true;
  }
  return this.returnMan(text, status);
};

module.exports = toParagraph;
