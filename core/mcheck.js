const methodCheck = function (text, whoami, args) {
  //helps in checking param, correcting text, and lowercasing it
  const ec = "E02";
  const ecEx = "E03";
  const r = `The parameter of the method ${whoami}() is invalid`;
  const c = `The ${whoami}() method only accepts a value, a string`;
  if (!(typeof text === "string"))
    this.errGen(
      ec,
      r,
      `You inputed: "${text}" as the parameter of the ${whoami}() method`,
      c,
    );
  if (/^\s*$/.test(text))
    this.errGen(
      ec,
      r,
      `The parameter of the ${whoami}() method was an empty string`,
      c,
    );
  if (args.length > 1)
    this.errGen(
      ecEx,
      r,
      `The arguments to the ${whoami}() method was more than 1`,
      c + " not multiple arguments",
    );
  if (this.lowcase) text = text.toLowerCase();
  return text;
};

module.exports = methodCheck;
