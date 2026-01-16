const { hRefine, hEscaper } = require("../utils/helper");

const toSubSentence = function (text = "") {
  let status = false;
  const statusLog = [];
  this.gravity = false; //turn off if on. We don't need it
  const sen = this.toSentence(text);
  if (this.returnStatusPass()) {
    text = sen.value;
    if (sen.status === true) status = true; //if sentence array was produced, this is also part of this method. Not just the sub-sentence-processor. Hence, it influences decisions
  } else text = sen;
  const processSubSentenceTokens = (text) => {
    const stepsRes = {};
    // ADD TRAILING DELIMITERS FINDER TOO
    let textState, escapeValue;
    const nativeDeli =
      /(\:{2,}|\;{2,}|\,{2,}|\s(\-{2,})|\s(\—{2,})|\s(·{2,}))|(\:|\;|\,|\s\-|\s\—|\s·)/g;
    const enclosersDeli = this.enclosersStyle();
    const subIdenti = "§§§§§§§§§§§↑↑↑↑↑←@→↑↑↑↑↑§§§§§§§§§§§";
    textState = hEscaper(text, subIdenti, "begin"); //Escapes subIdenti if found in text.
    if (textState.status === false) textState = false;
    else {
      text = textState.text;
      escapeValue = textState.escaper;
    }
    const step1 = (input) => {
      let textChoice = input || text;
      const m1 = nativeDeli.test(textChoice);
      if (m1) {
        if (this.showDelimeters)
          textChoice = textChoice.replace(
            nativeDeli,
            (match) => match + subIdenti,
          );
        else textChoice = textChoice.replace(nativeDeli, (match) => subIdenti);
      }
      stepsRes.m1 = m1;
      return textChoice;
    };

    const step2 = () => {
      const m2 = enclosersDeli.test(text);
      if (m2) {
        const enclosersMatch = text.match(enclosersDeli);
        if (this.actOnEnclosers === false)
          text = text.replace(
            enclosersDeli,
            (match) => subIdenti + match + subIdenti,
          );
        else {
          const enclosersMatchTwin = enclosersMatch.map((v) => step1(v));
          enclosersMatch.map(
            (v, i) => (text = text.replace(v, enclosersMatchTwin[i])),
          );
        }
        stepsRes.m2 = m2;
      }
    };

    const step3 = () => {
      //this removes unnecessary subIdenti
      const pass = stepsRes.m2; //m2 creates the mess, so...
      if (pass) {
        const modRegHelp = new RegExp(
          `${subIdenti}(?=${nativeDeli.toString().slice(1, -2)})`,
          "g",
        );
        if (modRegHelp) text = text.replace(modRegHelp, "");
      }
    };

    const step4 = () => {
      const m4 = stepsRes.m1 || stepsRes.m2;
      const inStep1 = (() => {
        if (m4) {
          text = text.split(subIdenti);
          stepsRes.m4 = m4;
        }
      })();
      const inStep2 = (() =>
        textState
          ? (text = hEscaper(text, escapeValue, "end").text)
          : void 0)();
    };

    (() => {
      text = step1(text);
      step2();
      step3();
      step4();
    })();
    return { value: text, status: stepsRes.m4 };
    //we break on :|;|,|""|''|``|()|“”|„„|«»|‘’|‚‚|‹›|′′|″″|{}|[]|||
    //UPHEADEND
  };
  (() => {
    const para = this.passParaCore(text);
    text = para.value;
    const paraStat = para.status;
    statusLog.push(paraStat);
    if (paraStat) {
      const pileUpArrays = text.map((v) => {
        const res = processSubSentenceTokens(v);
        statusLog.push(res.status);
        return res.value;
      });
      text = pileUpArrays.flat();
    } else {
      const res = processSubSentenceTokens(text);
      statusLog.push(res.status);
      text = res.value;
    }
    text = hRefine(text);
  })();

  status = statusLog.some((v) => v === true);
  /* ⛓️   if (this.actOnEnclosers) { //change to === false
          console.log(text, 'entry into attachEnc')
          const textPress = this.attachEnc(text, status)
          text = textPress.text
          status = textPress.status
        }*/
  return this.returnMan(text, status);
};

module.exports = toSubSentence;
