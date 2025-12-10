"use strict";
const { hPassPCore, hAttachEnclosers } = require("./utils/helper");
const {
  sen,
  ssen,
  word,
  para,
  correct,
  ccheck,
  except,
  grav,
  mcheck,
} = require("./core/index");

class Kingchop {
  constructor(options) {
    this.showDelimeters = true;
    this.lowcase = false;
    this.addExcepts = null;
    this.useExceptions = null;
    this.actOnEnclosers = false;
    this.correct = true;
    this.gravity = true;
    this.returnStatus = false;
    ///////////
    if (options) this.options = options;
    else this.constructorCheck(arguments);
    if (this.options) {
      const {
        addToExceptions,
        useExceptions,
        showDelimeters,
        lowercase,
        lowcase,
        actOnEnclosers,
        correct,
        gravity,
        returnStatus,
      } = this.options;
      if (addToExceptions) this.addExcepts = addToExceptions;
      if (useExceptions) this.useExceptions = useExceptions;
      if (showDelimeters === false) this.showDelimeters = showDelimeters;
      if (lowcase || lowercase) this.lowcase = lowcase; //supports alias
      if (actOnEnclosers) this.actOnEnclosers = actOnEnclosers;
      if (correct === false) this.correct = correct;
      if (gravity === false) this.gravity = gravity;
      if (returnStatus) this.returnStatus = returnStatus;
      this.constructorCheck(arguments);
    }
  }
  toSentence(text = "") {
    text = this.methodCheck(text, "toSentence", arguments);
    return sen.bind(this)(text);
  }
  toSubSentence(text = "") {
    text = this.methodCheck(text, "toSubSentence", arguments);
    return ssen.bind(this)(text);
  }
  toWord(text = "") {
    text = this.methodCheck(text, "toWord", arguments);
    return word.bind(this)(text);
  }
  toParagraph(text = "") {
    text = this.methodCheck(text, "toParagraph", arguments);
    return para.bind(this)(text);
  }
  correctText(text = "") {
    text = this.methodCheck(text, "correctText", arguments);
    return correct.bind(this)(text);
  }
  constructorCheck(args) {
    return ccheck.bind(this)(args);
  }
  exceptionsList(isCores) {
    return except.bind(this)(isCores);
  }
  gravityFn(text, num) {
    return grav.bind(this)(text, num);
  }
  methodCheck(text, whoami, args) {
    return mcheck.bind(this)(text, whoami, args);
  }
  errGen(code, reason, cause, correct) {
    throw new Error(
      `\nKINGCHOP ERROR!\nERROR CODE: ${code}.\nREASON: ${reason}.\nCAUSE: ${cause}.\nCORRECTION: ${correct}.\nMORE INFO: Check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchopREADME.md.`,
    );
  }
  returnMan(text, status) {
    //helps in returning text, changing status and text formats.
    if ([undefined, null].includes(status)) status = false;
    if (Array.isArray(text) && !(text.length > 1)) {
      text = text.toString();
      status = false;
      //find if text is one value in array, then change text to string and status to false
    }
    return this.returnStatus ? { value: text, status: status } : text;
  }
  returnStatusPass() {
    if (this.returnStatus) return true;
    else return false;
  }
  passParaCore(text) {
    return hPassPCore(text);
  }
  publicMethods(value, whoami) {
    //public extra methods help others, but we use them in kingchop processes.The returnStatus if true, conditions all public methods to return an object, {value, status}. This private method helps us check that and returns the actual value. Value from public method is needed for Kingchop processes not object.
    let result;
    if (whoami === "correctText" && this.correct)
      result = this.correctText(value);
    else result = value;
    if (this.correct && this.returnStatus === true)
      return result.value; //only value from public method is needed
    else return result;
  }
  enclosersStyle() {
    return /\(.+?\)|((^(\'.+?\'))|((?<=\s)\'.+?\'))|\".+?\"|\*.+?\*|\{.+?\}|\<.+?\>|\[.+?\]|((^(\‘.+?\’))|((?<=\s)\‘.+?\’))|\„.+?\„|\“.+?\”|\‹.+?\›|\«.+?\»/g; /*' ’ ′ single quotes are specialized so not to do bad on stuffs like, don't, o’ clock*/
    // /\s\([^\)]+\)|\s\'.+\'|\s\".+\"|\s\*.+\*|\s\{.+\}|\s\<.+\>|\s\[.+\]|\s\`.+\`|\s\″.+\″|\s\′.+\′|\s\‘.+\’|\s\„.+\„|\s\“.+\”|\s\‹.+\›|\s\«.+\»/gm //test01 Experiment
  }
  attachEnc(text, status) {
    if (status === false) return { text: text, status: status }; //text here if stat is false means text is still string snd unprocessed.
    text = hAttachEnclosers(text);
    if (text.length > 1) return { text: text, status: status };
    else return { text: text, status: false }; //means array text was pressed back to 1 array value. So status should be false.
  }
}
module.exports = Kingchop;
/*
    ✅✅ lowercase: default false 
    ✅✅ addToExceptions: default null: adds more exceptions to the exceptions array after filtering possible duplicates
    ✅✅ useExceptions: default null: use only provided exceptions
    ✅✅ actOnEnclosers: default false: to make match and possibly break in enclosers like (), ''...
    ✅✅ showDelimeters: default true: leaves the delimeters in belonging arrays instead of removing them
    ✅✅ correct: default true: tries to correct the text
    ✅✅ returnStatus: default false: returns an output in object form. {value: 'Whatever was processed', status: true or false (if anything was done or not)
    ✅✅ gravity: default true: uses an algorithm to detect what should be a sentence or not.
    options = {addExceptions: ['co', 'inc', 'ltd', 'org'],  useExceptions: ['org', 'inc', 'ltd'], showDelimeters: false, lowercase: true}
*/

/*
Next Fixes:
toSentence: is not tokenizing properly. Eg: text = '1. Play. 2. Don't write 3. Jump around.'
toWord: find way, so toWord will not leave something like "don't'you" unbroken.

But you see, trying to fix them is pointless, and often create other issues and conflicts. It's best to leave them as is unfortunately.
*/
