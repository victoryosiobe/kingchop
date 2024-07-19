const { hNextValueFn } = require("../helper.js");

const gravityFn = function (text, num) {
  let isNowBackToString = false;
  if (typeof text === "string") return { value: text, stat: isNowBackToString }; //operations were not done on the text
  //  const len = text.length
  const totalLen = text.reduce((acc, val) => {
    return acc + val.length;
  }, 0);
  // const avrTotalLen = totalLen / len
  runner();

  function runner() {
    let i = 0;
    while (i < text.length) {
      //while used because of unstability of text length
      const currValue = text[i];
      const next = hNextValueFn(text, i);
      const nextValue = next.value;
      const nextIndex = next.index;
      if (nextIndex !== undefined) {
        if (i === 0) {
          //first value
          if (thresTest(currValue)) {
            text[0] = currValue + " " + nextValue;
            text.splice(nextIndex, 1);
            //no incrementing. Since next value has been removed and added to current one
            //we use them as new value, and the next to new value may pass the test, and so on.
            //if fail, we increment and move to next loop
            isNowBackToString = true;
          } else i++;
        } else {
          isNowBackToString = false;
          if (thresTest(nextValue)) {
            //test on nextValue
            text[i] = currValue + " " + nextValue; //make currValue and nextValue the current value
            text.splice(nextIndex, 1);
            //no incrementing. Since next value has been removed and added to current one
            //we use them as new value, and the next to new value may pass the test, and so on.
            //if fail, we increment and move to nect loop
          } else i++;
        }
      } else break;
      //for action with last text array value, the prev value to last one
      //will add the last to itself. thereby leaving no last readable value (undefined). We will use nextIndex to check
      //then exit loop. This will handle situations were all values add themselves. leading to 1 string.
      //we will also signal with isNowBackToString if that happens, to say, no operations were done on toSentence input string text
      //cos, it turned back to string again

      function thresTest(value) {
        const choice = typeof num !== "boolean" ? num : 30;
        const scale = Math.log(totalLen + 1); // Balanced scaling factor
        const ratio = (scale / value.length) * 100 > choice;
        return ratio;
      }
    }
  }
  return { value: text, stat: isNowBackToString ? false : true }; // false here means not a string, which means success.
};

module.exports = gravityFn;
