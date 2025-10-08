const {
  hEscaper,
  hRefine,
  hAdvancedEnclosersExtract,
} = require("../utils/helper");
const toSentence = function (text = "") {
  let status = true;
  if (this.correct) text = this.publicMethods(text, "correctText"); //correct text from here
  const processSentenceTokens = (text) => {
    const masterState = [];
    const regDelimetersExt =
      /(\.{2,}\s+|\!{2,}\s+|\?{2,}\s+)|(\.\s+|\!\s+|\?\s+)/g; // match delimiters when space comes after
    const regIgnoreEnclosers = this.enclosersStyle(); // /\s\([^\)]+\)|\s\'.+\'|\s\".+\"|\s\*.+\*|\s\{.+\}|\s\<.+\>|\s\[.+\]|\s\`.+\`|\s\″.+\″|\s\′.+\′|\s\‘.+\’|\s\„.+\„|\s\“.+\”|\s\‹.+\›|\s\«.+\»/gm //test01 Experiment
    const regDelimetersExtInQuotes =
      /((\.{2,}\s*|\!{2,}\s*|\?{2,}\s*)|(\.\s*|\!\s*|\?\s*))(”|")$/g;
    const ellipsReg = /((?<=[^\s])\.{3,})(?!$)|(\.{3,}(?=[^\s]))(?!$)/g;
    const numbListFormReg = /^\s*\d+\s*\.\s+/g; //matches digits followed by period on every line beginning
    const exceptionsList = this.exceptionsList("with_cores");
    const mainIdenti = "&∆×§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§×∆&";
    const splitIdenti = "-&∆×§§§§-§§§§§§§§§+§§§§§§§§§§-§§§§§§§×∆&-";
    let enclosersMatch,
      mainIdentiTextState,
      splitIdentiTextState,
      mainIdentiEscapeValue,
      splitIdentiEscapeValue;

    const section1 = (() => {
      //escape layer
      const step1 = (() => {
        mainIdentiTextState = hEscaper(text, mainIdenti, "begin"); //Escapes mainIdenti if found in text.
        if (mainIdentiTextState.status === false) mainIdentiTextState = false;
        else {
          text = mainIdentiTextState.text;
          mainIdentiEscapeValue = mainIdentiTextState.escaper;
        }
      })();
      const step2 = (() => {
        splitIdentiTextState = hEscaper(text, splitIdenti, "begin"); //Escapes mainIdenti if found in text.
        if (splitIdentiTextState.status === false) splitIdentiTextState = false;
        else {
          text = splitIdentiTextState.text;
          splitIdentiEscapeValue = splitIdentiTextState.escaper;
        }
      })();
    })(); //escape layer

    const section2 = (() => {
      //encryption layer
      const step1 = (() => {
        if (numbListFormReg.test(text)) {
          //test if match on numbListForm: It checks if sentence starts with numbers, followed by a fullstop
          let startIndex = 0;
          text = text.replace(numbListFormReg, (match) => {
            const index = text.indexOf(match, startIndex);
            startIndex = index + match.length;
            masterState.push([match, index]);
            return mainIdenti;
          });
        }
      })();
      const step2 = (() => {
        if (exceptionsList.test(text)) {
          //test if match on numbListForm: It checks if sentence starts with numbers, followed by a fullstop
          let startIndex = 0;
          text = text.replace(exceptionsList, (match) => {
            const index = text.indexOf(match, startIndex);
            startIndex = index + match.length;
            masterState.push([match, index]);
            return mainIdenti;
          });
        }
      })();
      const step3 = (() => {
        if (regIgnoreEnclosers.test(text) && this.actOnEnclosers === false) {
          let startIndex = 0;
          const extractedEnclosers = hAdvancedEnclosersExtract(text);
          if (extractedEnclosers) {
            extractedEnclosers.map((v) => {
              storeState(v, startIndex);
            });
            return; //if ran, fail to run the other, below.  if fail, other runs.
          }
          text = text.replace(regIgnoreEnclosers, (match) => {
            if (match.endsWith('"') || match.endsWith("”")) {
              regDelimetersExtInQuotes.lastIndex = 0; //reset regex state for correct testing
              if (regDelimetersExtInQuotes.test(match))
                mainIdenti += splitIdenti; //we would split on this identifier in section3
            }
            storeState(match, startIndex);
          });

          function storeState(match, startIndex) {
            const index = text.indexOf(match, startIndex);
            startIndex = index + match.length;
            masterState.push([match, index]);
            return mainIdenti;
          }
        }
      })();
      const step4 = (() => {
        if (ellipsReg.test(text)) {
          let startIndex = 0;
          text = text.replace(ellipsReg, (match) => {
            const index = text.indexOf(match, startIndex);
            startIndex = index + match.length;
            masterState.push([match, index]);
            return mainIdenti;
          });
        }
      })();
    })(); //encryption layer

    const section3 = (() => {
      //split layer
      const step1 = (() => {
        const m1 = regDelimetersExt.test(text);
        if (this.showDelimeters === true) {
          if (m1)
            text = text.replace(
              regDelimetersExt,
              (match) => hRefine(match) + splitIdenti,
            );
          text = text.split(splitIdenti); //split on the identifier
        } else {
          if (m1) text = text.replace(regDelimetersExt, splitIdenti);
          text = text.split(splitIdenti); //split on the identifier
        }
        text = hRefine(text); // clean up
        status = m1 || false;
      })();
    })(); //split layer

    const section4 = (() => {
      //decyrption layer
      if (masterState.length !== 0) {
        masterState.sort((a, b) => a[1] - b[1]); //arrange based on index number (ascending order)
        for (let i = 0; i < text.length; i++) {
          const encryptMatch = text[i].match(new RegExp(mainIdenti, "g"));
          if (!encryptMatch) continue;
          for (let j = 0; j < encryptMatch.length; j++)
            text[i] = text[i].replace(mainIdenti, masterState.shift()[0]);
        }
      }
    })(); //decryption layer

    const section5 = (() => {
      //unescaped layer
      const step1 = (() =>
        mainIdentiTextState
          ? (text = hEscaper(text, mainIdentiEscapeValue, "end").text)
          : void 0)();
      const step2 = (() =>
        splitIdentiTextState
          ? (text = hEscaper(text, splitIdentiEscapeValue, "end").text)
          : void 0)();
    })(); //unescape layer

    return text;
  };
  (() => {
    const para = this.passParaCore(text);
    text = para.value;
    const paraStat = para.status;
    if (paraStat) {
      const pileUpArrays = text.map((v) => processSentenceTokens(v));
      text = pileUpArrays.flat();
    } else text = processSentenceTokens(text);
    text = hRefine(text);
  })();
  /* ⛓️ console.log(text, hAttachEnclosers(text), 'hallo').  */
  if (this.gravity && this.showDelimeters !== false) {
    const res = this.gravityFn(text, this.gravity);
    text = res.value;
    status = res.stat;
  }

  return this.returnMan(text, status);
};

module.exports = toSentence;
