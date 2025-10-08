const { hRefine, hEscaper } = require("../utils/helper");
const toWord = function (text = "") {
  //mark
  let status = false;
  const stepsRes = {};
  const processWordTokens = (text) => {
    let textState, escapeValue;
    const regSpaces = /\s/g;
    const regNonWords = /[^\sA-Za-z0-9]/g;
    const regOrderQuotes = /(?<=[A-Za-z])['’](?=[A-Za-z])/g; //single quotes, like, ', ′, ‘, ’ to succeed on words like don't, o’clock. Kingchop won't consider single quotes after the word is completed, like in relatives’, patents', ol’
    let quoterIdenti = "<KINGCHOP-QUOTE-IDENTI>";
    let m1;
    if (this.showDelimeters === false)
      text = text.replace(/[^\sA-Za-z0-9]/g, ""); //remove all non words, except digits

    const step1 = () => {
      m1 = text.match(regOrderQuotes);
      if (m1) {
        textState = hEscaper(text, quoterIdenti, "begin");
        if (textState.status === false) textState = false;
        else {
          text = textState.text;
          escapeValue = textState.escaper;
        }
        text = text.replace(regOrderQuotes, quoterIdenti);
      }
      stepsRes.m1 = !!m1;
    };

    const step2 = (peekInText) => {
      const m1 = regNonWords.test(text || peekInText);
      const spaceOut = (str, regex) => {
        return (str = str.replace(regex, (match) => " " + match + " "));
      };

      if (m1) {
        if (!peekInText) {
          text = spaceOut(text, regNonWords);
          stepsRes.m1 = m1;
        } else return (peekInText = spaceOut(peekInText, regNonWords));
      } else {
        if (peekInText) return peekInText;
      }
    };
    const step3 = () => {
      if (m1) {
        //step2 causes spaces in the quoterIdenti and its own escape value, hence we modify it
        const inStep1 = (() =>
          m1.map((v) => (text = text.replace(step2(quoterIdenti), v))))();
        const inStep2 = (() =>
          textState
            ? (text = hEscaper(text, step2(escapeValue), "end").text)
            : void 0)();
      }
      const inStep3 = (() => {
        const m3 = regSpaces.test(text); //done correctly. Since quoterIdenti would have spaces, it's best we put this here
        if (m3) text = text.split(regSpaces);
        stepsRes.m3 = m3;
      })();
    };

    (() => {
      step1();
      step2();
      step3();
    })();
    return text;
  };
  (() => {
    const para = this.passParaCore(text);
    text = para.value;
    const paraStat = para.status;
    if (paraStat) {
      const pileUpArrays = text.map((v) => processWordTokens(v));
      text = pileUpArrays.flat();
    } else text = processWordTokens(text);
    text = hRefine(text);
  })();
  status = stepsRes.m3;
  return this.returnMan(text, status);
};

module.exports = toWord;
