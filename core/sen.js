const {
  hEscaper,
  hRefine,
  hAdvancedEnclosersExtract,
} = require("../utils/helper");
const toSentence = function (text = "") {
  let status = false;
  const statusLog = [];
  if (this.correct) text = this.publicMethods(text, "correctText"); //correct text from here
  const processSentenceTokens = (text) => {
    const stepsRes = {};
    const masterState = [];
    const regDelimetersExt = /(\.+|\!+|\?+)\s+/g; // match delimiters when space comes after
    const regIgnoreEnclosers = this.enclosersStyle(); // /\s\([^\)]+\)|\s\'.+\'|\s\".+\"|\s\*.+\*|\s\{.+\}|\s\<.+\>|\s\[.+\]|\s\`.+\`|\s\″.+\″|\s\′.+\′|\s\‘.+\’|\s\„.+\„|\s\“.+\”|\s\‹.+\›|\s\«.+\»/gm //test01 Experiment
    const regDelimetersExtInQuotes = /(\.+|\!+|\?+)\s*(”|")$/g; // Matches trailing sentence-ending punctuation (. ! ?) inside a closing double quote (" or ”) at the end of the string
    const ellipsReg = /(?<!\s)\.{3,}(?!\s|$)/g; // Matches 3+ periods (ellipsis) embedded in text, requiring no space before and no space/end-of-string after
    const numbListFormReg = /^\s*\d+\s*\.\s+/g; //matches digits followed by period on every line beginning. passParaCore already makes sure that only 1 sentence is processed at a time. Then it aggregates it. Else, I would have added a multiline Regex flag.
    const exceptionsList = this.exceptionsList("with_cores");
    const mainIdenti = "&∆×§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§×∆&";
    const splitIdenti = "-&∆×§§§§-§§§§§§§§§+§§§§§§§§§§-§§§§§§§×∆&-";
    let enclosersMatch,
      mainIdentiTextState,
      splitIdentiTextState,
      mainIdentiEscapeValue,
      splitIdentiEscapeValue;

    function storeState(match, startIndex) {
      const index = text.indexOf(match, startIndex);
      startIndex = index + match.length;
      masterState.push([match, index]);
      return startIndex;
    }

    const section1 = (() => {
      //escape layer; for mainIdenti that may be found in text
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
            startIndex = storeState(match, startIndex);
            return mainIdenti;
          });
        }
      })();
      const step2 = (() => {
        if (exceptionsList.test(text)) {
          //test if match on numbListForm: It checks if sentence starts with numbers, followed by a fullstop
          let startIndex = 0;
          text = text.replace(exceptionsList, (match) => {
            startIndex = storeState(match, startIndex);
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
              startIndex = storeState(v, startIndex);
              text = text.replace(v, mainIdenti); //Replacing the extractedEnclosers with mainIdenti here
            });
            //if ran, proceed to run the other, below.  if fail, other runs regardless.
            //all enclosers found here have now been masked
            //sooo, setting startIndex back to zero
            startIndex = 0;
          }

          //default encloser search
          text = text.replace(regIgnoreEnclosers, (match) => {
            let identiCopy = mainIdenti;
            if (match.endsWith('"') || match.endsWith("”")) {
              regDelimetersExtInQuotes.lastIndex = 0; //reset regex state for correct testing
              if (regDelimetersExtInQuotes.test(match)) {
                identiCopy = mainIdenti + splitIdenti; //we would split on this identifier in section3. Early split identifications.
              }
            }
            startIndex = storeState(match, startIndex);
            return identiCopy;
          });
        }
      })();
      const step4 = (() => {
        if (ellipsReg.test(text)) {
          let startIndex = 0;
          text = text.replace(ellipsReg, (match) => {
            startIndex = storeState(match, startIndex);
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
          text = text.split(splitIdenti); //split on the identifier. Put here because there may be a splitIdenti from eslewhere not only for regDelimetersExt. If no split an array of full text is returned
        } else {
          if (m1) text = text.replace(regDelimetersExt, splitIdenti);
          text = text.split(splitIdenti); //split on the identifier. Put here because there may be a splitIdenti from eslewhere not only for regDelimetersExt. If no split an array of full text is returned
        }
        text = hRefine(text); // clean up
        stepsRes.m1 = m1;
      })();
    })(); //split layer

    const section4 = (() => {
      //decyrption layer
      if (masterState.length !== 0) {
        masterState.sort((a, b) => a[1] - b[1]); //arrange based on index number (ascending order)
        for (let i = 0; i < text.length; i++) {
          //after split layer text is now array regardless of a split or not
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

    return { value: text, status: stepsRes.m1 };
  };
  (() => {
    const para = this.passParaCore(text);
    text = para.value;
    const paraStat = para.status;
    statusLog.push(paraStat);
    if (paraStat) {
      const pileUpArrays = text.map((v) => {
        const res = processSentenceTokens(v);
        statusLog.push(res.status);
        return res.value;
      });
      text = pileUpArrays.flat();
    } else {
      const res = processSentenceTokens(text);
      statusLog.push(res.status);
      text = res.value;
    }
    text = hRefine(text);
  })();

  /* ⛓️ console.log(text, hAttachEnclosers(text), 'hallo').  */
  if (this.gravity && this.showDelimeters !== false) {
    const res = this.gravityFn(text, this.gravity);
    text = res.value;
    statusLog.push(res.stat);
  }

  status = statusLog.some((v) => v === true);
  return this.returnMan(text, status);
};

module.exports = toSentence;
