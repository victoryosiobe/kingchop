const exceptionsList = function (isCores) {
  let EXCEPTIONS = new Set([
    "Dr",
    "etc",
    "Jr",
    "M",
    "Mgr",
    "p",
    "Mr",
    "Mrs",
    "Ms",
    "Mme",
    "Mlle",
    "Prof",
    "Sr",
    "St",
    "pp",
    "Pst",
    "Dj",
    "Po",
  ]);
  if (this.addExcepts) {
    if (Array.isArray(this.addExcepts))
      this.addExcepts.map((e) => EXCEPTIONS.add(e));
    else EXCEPTIONS.add(this.addExcepts);
  } else if (this.useExceptions) EXCEPTIONS = new Set(this.useExceptions);
  let EXCEPTIONSARR = [];
  EXCEPTIONS.forEach((e) => EXCEPTIONSARR.push(e));
  if (isCores) {
    const exceptsCoreBefore = "(\\.\\s*|!\\s*|\\?\\s*)?";
    const exceptsCoreAfter = "(\\s*\\.|\\s*\\!|\\s*\\?)";
    const exceptsBuilder = (() => {
      let exceptsBuild = EXCEPTIONSARR.reduce(
        (acc, value) => acc + value + "|",
        "",
      ).slice(0, -1);
      EXCEPTIONSARR = new RegExp(
        `(?<!([^\\s]))(${exceptsCoreBefore}(${exceptsBuild})${exceptsCoreAfter})`,
        "gi",
      ); //in the string, 'kingchop.', p is part of exceptions, so we lookbehind for any word behind, so breaking and replacing can be done properly. This means all exceptions most look out for a word behind them. If . or space or nothing is behind, this matches successfully.
    })();
  }
  return EXCEPTIONSARR;
};

module.exports = exceptionsList;
