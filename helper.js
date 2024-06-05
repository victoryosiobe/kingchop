function hAdvancedEnclosersExtract(str) {
  const openErs = "[\\(\\[\\{“«‹<]"; //the opening character of the enclosers, you can add more
  const closeErs = "[\\)\\]\\}”»›>]"; //the closing ones
  /* const regShorFormQuotes = /(?<=\w)’(?=\w)/g //for stuffs like don’t, they’re, o’clock, gov’t...
   const passSFQ = regShorFormQuotes.test(str)
   let strWithSFQ
   if (passSFQ) {
     strWithSFQ = str
     str = str.replace(regShorFormQuotes, ' ') //replace with space, so as to not disrupt main processes, but will add later.
   }*/
  if (!hAreEnclosersBalanced(str)) return null;
  const enclosersBuild = new RegExp(`${openErs}.+?${closeErs}`, "g");
  let ordMatch = str.match(enclosersBuild);
  if (ordMatch) {
    let proValue = proceed(ordMatch);
    // if (passSFQ) proValue = fixshortFormQuotes(strWithSFQ, str, proValue)
    return proValue;
  } else return null;

  function proceed(ordMatch) {
    let i = 0;
    let recordStability = 0;
    const fatherRunner = ordMatch.length;
    const ordArrIndex = ordMatch.map((v) => str.indexOf(v));
    const result = [];
    while (i < fatherRunner) {
      let value = ordMatch[i];
      if (value === undefined) break; //it will increment out of bound, so we stop loop here.
      let openEn = value.match(new RegExp(`^${openErs}`, "g"))[0];
      let closeEn = value.match(new RegExp(`${closeErs}$`, "g"))[0];
      value = value.slice(0, value.length - 1); //remove the closing character.
      const initIndex = str.indexOf(value);
      const endIndex = endIndexFind();
      const res = str.slice(initIndex, endIndex + 1);
      result.push(res); //update the result array

      function endIndexFind() {
        for (let i = initIndex; i < str.length; i++) {
          const currValue = str[i];
          if (currValue === openEn) recordStability++;
          else if (currValue === closeEn) recordStability--;
          if (recordStability === 0) return i;
        }
      }
      for (const v of ordArrIndex) {
        if (v > endIndex) {
          i = ordArrIndex.indexOf(v) - 1; //update i but reduce by 1, so that we can increment it later.
          break;
        }
      }
      i++;
    }
    return result;
  }
}

function fixshortFormQuotes(textOrig, modText, arr) {
  const holder = [];
  arr.map((value) => {
    const modI = modText.indexOf(value);
    const modI_Last = modI + value.length;
    holder.push(textOrig.slice(modI, modI_Last));
  });
  return holder;
  /*The modified text and the original text have the same length,
    just that the short form single quotes are replaced with space.
    We put the original text into an array, but based on indexes
    provided by the array values to get accurate positions of
    the values in the original string.*/
}

function hAreEnclosersBalanced(str) {
  /*facing pairs are enclosers put in right other next to each other. eg. [] or ()*/
  let len;
  const reduceRegExp = /\[\]|\(\)|<>|{}|""|“”|''|‘’|„„|\*\*|«»|‹›|′′|″″/g; // to remove facing pairs
  const regShorFormQuotes = /(?<=\w)'(?=\w)|(?<=\w)’(?=\w)/g; //for stuffs like don't, they're, o’clock, gov’t...
  if (regShorFormQuotes.test(str)) str = str.replace(regShorFormQuotes, ""); //removes them so as to not disrupt main processes
  str = str.replace(/[^\[\]\(\)<>{}'"“”‘’„\*«»‹›`′″]/g, ""); //remove all non parentheses
  if (str.length === 0) return true; // no braces balanced
  if (str.length % 2) return false; // odd length then not balanced.
  do {
    // Remove facing pairs until there are no more to remove.
    len = str.length;
    str = str.replace(reduceRegExp, ""); // remove all facing pairs
  } while (len !== str.length);
  if (str.length === 0) return true; // Balanced and good. :)
  return false; // UnBalanced and bad. :(
}

function hRefine(text) {
  if (Array.isArray(text))
    return text.map((e) => (e = e.trim())).filter((e) => e !== "");
  else if (typeof text === "string") return text.trim();
}

function hParaCore(text) {
  const regPara = /\n/gm;
  if (regPara.test(text)) {
    text = text.split(regPara);
    text = hRefine(text);
  }
  return text;
}

function hPassPCore(text) {
  text = hParaCore(text);
  if (Array.isArray(text)) return { value: text, status: true };
  else return { value: text, status: false };
}

function hAttachEnclosers(text) {
  let i = 0;
  const openErs = "[\\(\\[\\{“‘«‹<]"; //the opening character of the enclosers, you can add more
  const closeErs = "[\\)\\]\\}”’»›>]"; //the closing ones
  if (Array.isArray(text)) {
    while (i < text.length) {
      const currValue = text[i];
      const next = hNextValueFn(text, i);
      const nextValue = next.value;
      const nextIndex = next.index;
      let openEnFind = currValue.match(openErs);
      if (openEnFind) {
        openEnFind = openEnFind.pop(); //pick the last
        //console.log(openEnFind, 'fuck you')
        if (currValue.lastIndexOf(openEnFind)) {
          text[i] = currValue + nextValue;
          if (nextIndex) text.splice(nextIndex, 1);
          //console.log(text, 'jiop')
          //e back to same position in next loop
        }
      } //console.log('no openers found')
      else i++;
    }
    //Spaces are missing after joining together next array-value. fix it
  }
}

function hNextValueFn(t, i) {
  return t[i + 1]
    ? { value: t[i + 1], index: i + 1 }
    : { value: "", index: void 0 };
}

function hEscaper(text, lookOut, mode, prevIndexes) {
  if (mode === "begin") {
    let escaperValue;
    if (Array.isArray(text)) {
      //input may be array
      const jText = text.join(" ");
      if (jText.indexOf(lookOut) === -1) return { text: text, status: false };
      escaperValue = checkErs(jText);
      const valueEscaped = lookOut[0] + escaperValue + lookOut.slice(1);
      text = text.map((v) => v.replaceAll(lookOut, (_) => valueEscaped));
    } else {
      if (text.indexOf(lookOut) === -1) return { text: text, status: false }; //indexof is better, lookOut may have different definition if turned to regex
      escaperValue = checkErs(text);
      //console.log(lookOut, lookOut[0], "here+")
      const valueEscaped = lookOut[0] + escaperValue + lookOut.slice(1);
      text = text.replaceAll(lookOut, (_) => valueEscaped);
    }
    return { text: text, status: true, escaper: escaperValue };
  } else if (mode === "end") {
    if (Array.isArray(text)) text = text.map((v) => v.replaceAll(lookOut, ""));
    else text = text.replaceAll(lookOut, "");
    return { text: text };
  }

  function checkErs(text) {
    const randMaxValue = 20;
    let escaperValue = randoMan(randMaxValue);
    if (text.indexOf(escaperValue) === -1) return escaperValue; //pattern enables to search even if its a sub-part of words
    checkErs(text); //go recursive.
  }
}

function matchedIndexes(text, regex) {
  let matches = [];
  let match;
  while ((match = regex.exec(text)) !== null) matches.push(match.index);
  if (!matches[0]) matches = null;
  return matches;
}

function removeSecondCharOnIndex(str, lookOut, index) {
  let str2 = str.slice(index);
  str2 = str2.replace(lookOut);
  //console.log(str.slice(0, index) + str2)
  return str.slice(0, index) + str2;
}

function randoMan(max) {
  let holder = "";
  const list = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < max; i++) {
    holder += list[Math.floor(Math.random() * list.length)];
  }
  return holder;
}

function modDepBalanced(str, enc) {
  new RegExp(enc, "g");
  str = str.replace(/[^\[\]\(\)<>{}'"“”‘’„\*«»‹›`′″]/g, ""); //remove all non parentheses
  if (str.length === 0) return true; // no braces balanced
  if (str.length % 2) return false; // odd length then not balanced.
  do {
    // Remove facing pairs until there are no more to remove.
    len = str.length;
    str = str.replace(reduceRegExp, ""); // remove all facing pairs
  } while (len !== str.length);
  if (str.length === 0) return true; // Balanced and good. :)
  return false; // UnBalanced and bad. :(
}

module.exports = {
  hAdvancedEnclosersExtract,
  hAreEnclosersBalanced,
  hRefine,
  hParaCore,
  hPassPCore,
  hAttachEnclosers,
  hNextValueFn,
  hEscaper,
};
