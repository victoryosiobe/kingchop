const constructorCheck = function (args) {
  if (args.length > 1) {
    const ec = "E03";
    this.errGen(
      ec,
      `The top-level arguments of the Kingchop initializer is invalid`,
      `The arguments of the Kingchop initializer was more than 1`,
      `The Kingchop initializer only accepts a value, an object of options, not multiple arguments`,
    );
  }
  if (this.options) {
    const {
      addToExceptions,
      useExceptions,
      showDelimeters,
      lowcase,
      actOnEnclosers,
      correct,
      gravity,
      returnStatus,
    } = this.options;

    const ec = "E01";
    const r = `Invalid Parameter Value`;
    const ca = `You inputed:`;
    const ca2 = `option of the Kingchop instance`;
    const c = `Required value is null or a string with values or an array with values`;
    const c2 = `Required value is true or false`;
    if (
      addToExceptions !== undefined &&
      !(
        Array.isArray(addToExceptions) ||
        addToExceptions === null ||
        addToExceptions === (typeof addToExceptions === "string")
      )
    ) {
      const idT = "in the addToExceptions";
      this.errGen(
        ec,
        r,
        `${ca} "${addToExceptions}" (${typeof addToExceptions}), ${idT} ${ca2}`,
        c,
      );
    }
    if (
      useExceptions !== undefined &&
      !(
        Array.isArray(useExceptions) ||
        useExceptions === null ||
        useExceptions === (typeof useExceptions === "string")
      )
    ) {
      const idT = "in the useExceptions";
      this.errGen(
        ec,
        r,
        `${ca} "${useExceptions}" (${typeof useExceptions}), ${idT} ${ca2}`,
        c,
      );
    }
    if (
      showDelimeters !== undefined &&
      !(showDelimeters === true || showDelimeters === false)
    ) {
      const idT = "in the showDelimeters";
      this.errGen(
        ec,
        r,
        `${ca} "${showDelimeters}" (${typeof showDelimeters}), ${idT} ${ca2}`,
        c2,
      );
    }
    if (lowcase !== undefined && !(lowcase === true || lowcase === false)) {
      const idT = "in the lowcase";
      this.errGen(
        ec,
        r,
        `${ca} "${lowcase}" (${typeof lowcase}), ${idT} ${ca2}`,
        c2,
      );
    }
    if (
      actOnEnclosers !== undefined &&
      !(actOnEnclosers === true || actOnEnclosers === false)
    ) {
      const idT = "in the actOnEnclosers";
      this.errGen(
        ec,
        r,
        `${ca} "${actOnEnclosers}" (${typeof actOnEnclosers}), ${idT} ${ca2}`,
        c2,
      );
    }
    if (correct !== undefined && !(correct === true || correct === false)) {
      const idT = "in the correct";
      this.errGen(
        ec,
        r,
        `${ca} "${correct}" (${typeof correct}), ${idT} ${ca2}`,
        c2,
      );
    }

    if (
      gravity !== undefined &&
      typeof gravity !== "number" &&
      typeof gravity !== "boolean"
    ) {
      const idT = "in the gravity";
      this.errGen(
        ec,
        r,
        `${ca} "${gravity}" (${typeof gravity}), ${idT} ${ca2}`,
        c2,
      );
    }
    if (
      returnStatus !== undefined &&
      !(returnStatus === true || returnStatus === false)
    ) {
      const idT = "in the returnStatus";
      this.errGen(
        ec,
        r,
        `${ca} "${returnStatus}" (${typeof returnStatus}), ${idT} ${ca2}`,
        c2,
      );
    }
    //CUSTOM

    if (gravity > 100 || gravity < 0 || gravity === 100 || gravity === 0) {
      const idT = "in the gravity";
      this.errGen(
        ec,
        r,
        `You inputed: ${gravity} (${typeof gravity}), ${idT} ${ca2}`,
        `${c2} OR the number of percentage to work with. It must not be 0 or lesser, or 100 or greater in value. It must be between, 1...99`,
      );
    }
  }
};

module.exports = constructorCheck;
