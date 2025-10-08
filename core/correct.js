const { hRefine } = require("../utils/helper");

const correctText = function (text = "") {
  let status = false;
  //users can use this method but other methods of kingchop that use this method will never send in an invalid string.
  /* Experiment
    const regNoSpaceBeforeEnclosers = /(\w|\W)\(|\)(\w|\W)|(\w|\W)\"|\"(\w|\W)|(\w|\W)\*|\*(\w|\W)|(\w|\W)\{|\}(\w|\W)|(\w|\W)\<|\>(\w|\W)|(\w|\W)\[|\](\w|\W)|(\w|\W)\`|\`(\w|\W)|(\w|\W)\″|\″(\w|\W)|(\w|\W)\„|\„(\w|\W)|(\w|\W)\“|\”(\w|\W)|(\w|\W)\‹|\›(\w|\W)|(\w|\W)\«|»(\w|\W)/gm //' ’ ′ single quotes not included so not to do bad on stuffs like, don't, o’ clock
    console.log(text.match(regNoSpaceBeforeEnclosers))
    */
  text = hRefine(text);

  const stepsRes = {};

  function step1() {
    //handles space before delimeters, provided a word is before the spaces, and a space is after the delimeter
    const regSpaceBeforeDelimeters = /(?<=\w)\s+(\.|\!|\?)(?=\s{2,})/gm;
    const m1 = regSpaceBeforeDelimeters.test(text);
    if (m1)
      text = text.replace(regSpaceBeforeDelimeters, (match) => hRefine(match));
    stepsRes.m1 = m1;
    //1st step
  }

  function step2() {
    //handles spaces behind a delimeter that a word follows.
    const regSpaceBeforeDelimetersWithWord =
      /(?<=\w)\s{2,}(?=(\.|\!|\?)\s*\w)/gm;
    const m2 = regSpaceBeforeDelimetersWithWord.test(text);
    if (m2)
      text = text.replace(regSpaceBeforeDelimetersWithWord, (match) => " ");
    stepsRes.m2 = m2;
    //2nd step
  }

  function step3() {
    //handles delimeters close to each other
    const regSpaceBetweenDelimeters =
      /(\.\s+(?=\.+))|(\!\s+(?=\!+))|(\?\s+(?=\?+))/gm;
    const m3 = regSpaceBetweenDelimeters.test(text);
    if (m3)
      text = text.replace(regSpaceBetweenDelimeters, (match) => hRefine(match));
    stepsRes.m3 = m3;
    //3rd step
  }

  function step4() {
    //handles alot of spaces, before a word, provided, a delimeter is before the spaces started
    const regSpaceBeforeWords = /(?<=(\.|\!|\?))\s{2,}(\w|\W)/gm;
    const m4 = regSpaceBeforeWords.test(text);
    if (m4)
      text
        .match(regSpaceBeforeWords)
        .map((value) => (text = text.replace(value, " " + hRefine(value))));
    stepsRes.m4 = m4;
    //4th step
  }

  function step5() {
    //handle trailing delimiters, even when the are not same, and are spaced out
    const regTrailingDelimeters =
      /(\s*((\.(\s|\.|\!|\?)+)|(\!(\s|\.|\!|\?)+)|(\?(\s|\.|\!|\?)+)))$/g;
    const m5 = regTrailingDelimeters.test(text);
    if (m5)
      text = text.replace(regTrailingDelimeters, (match) =>
        match.replace(/\s+/g, ""),
      );
    stepsRes.m5 = m5;
    //5th step
  }

  (function executeSteps() {
    step1();
    step2();
    step3();
    step4();
    step5();
  })();

  status =
    stepsRes.m1 || stepsRes.m2 || stepsRes.m3 || stepsRes.m4 || stepsRes.m5;
  return this.returnMan(text, status);
};

module.exports = correctText;
