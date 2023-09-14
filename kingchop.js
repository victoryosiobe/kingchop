try {
  class Kingchop {
    constructor(options) {
      this.showDelimeters = true
      this.lowcase = false
      this.addExcepts = null
      this.useExceptions = null
      this.actOnEnclosers = false
      this.correct = true
      this.showNonWords = true
      this.returnStatus = false
      if (options) this.options = options
      if (this.options) {
        const { addToExceptions, useExceptions, showDelimeters, lowcase, actOnEnclosers, correct, showNonWords, returnStatus } = this.options
        if (addToExceptions) this.addExcepts = addToExceptions
        if (useExceptions) this.useExceptions = useExceptions
        if (showDelimeters === false) this.showDelimeters = showDelimeters
        if (lowcase) this.lowcase = lowcase
        if (actOnEnclosers) this.actOnEnclosers = actOnEnclosers
        if (correct === false) this.correct = correct
        if (showNonWords === false) this.showNonWords = showNonWords
        if (returnStatus) this.returnStatus = returnStatus
        this.#checkParams()
      }
    }
    #checkParams() {
      if (this.options) {
        const { addToExceptions, useExceptions, showDelimeters, lowcase, actOnEnclosers, correct, showNonWords, returnStatus } = this.options
        const addTo1 = ` options of the Kingchop Instance.\nCORRECTION: Required value is null or a string or an array.\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`
        const addTo2 = ` .options of the Kingchop Instance.\nCORRECTION: Required value is true or false.\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`
        const beginWith = `\nKINGCHOP ERROR!\nERROR CODE: E01.\nREASON: Invalid Parameter Value.\nCAUSE: You inputed: `
        if (addToExceptions && !(Array.isArray(addToExceptions) || addToExceptions === null || addToExceptions === (typeof addToExceptions === 'string'))) throw new Error(`${beginWith}"${addToExceptions}" in the addToExceptions${addTo1}`)
        if (useExceptions && !(Array.isArray(useExceptions) || useExceptions === null || useExceptions === (typeof useExceptions === 'string'))) throw new Error(`${beginWith}"${useExceptions}" in the useExceptions${addTo1}`)
        if (showDelimeters && !(showDelimeters === true || showDelimeters === false)) throw new Error(`${beginWith}"${showDelimeters}" in the showDelimeters${addTo2}`)
        if (lowcase && !(lowcase === true || lowcase === false)) throw new Error(`${beginWith}"${lowcase}" in the lowcase${addTo2}`)
        if (actOnEnclosers && !(actOnEnclosers === true || actOnEnclosers === false)) throw new Error(`${beginWith}"${actOnEnclosers}" in the actOnEnclosers${addTo2}`)
        if (correct && !(correct === true || correct === false)) throw new Error(`${beginWith}"${correct}" in the correct${addTo2}`)
        if (showNonWords && !(showNonWords === true || showNonWords === false)) throw new Error(`${beginWith}"${showNonWords}" in the showNonWords${addTo2}`)
        if (returnStatus && !(returnStatus === true || returnStatus === false)) throw new Error(`${beginWith}"${returnStatus}" in the returnStatus${addTo2}`)
      }
    }
    correctText(text) {
      try {
        let status = true
        /*    //users can use this method but other methods of kingchop that use this method will never send in an invalid string.
        if (!(typeof text === 'string')) throw new Error(`\nKINGCHOP ERROR!\nERROR CODE: E02.\nREASON: The parameter of the method correctText() is invalid.\nCAUSE: You inputed: "${text}" as the parameter of the correctText() method.\nCORRECTION: The correct() method only accepts a value, a string.\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`)
        if (/^\s+$/gm.test(text)) throw new Error(`\nKINGCHOP ERROR!\nERROR CODE: E02.\nREASON: The parameter of the method correctText() is invalid.\nCAUSE: The parameter of the correctText() method was an empty string.\nCORRECTION: The correctText() method only accepts a value, a string.\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`)
        if (!(typeof devMode === 'boolean')) throw new Error(`\nKINGCHOP ERROR!\nERROR CODE: E04.\nREASON: The dev parameter of the method correctText() is invalid.\nCAUSE: You inputed: "${devMode}" as the dev parameter of the correctText() method.\nCORRECTION: The dev parameter is for the processes of Kingchop, you may want to avoid using it, though it accepts true or false alone.\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`)
*/
        /* Experiment
        const regNoSpaceBeforeEnclosers = /(\w|\W)\(|\)(\w|\W)|(\w|\W)\"|\"(\w|\W)|(\w|\W)\*|\*(\w|\W)|(\w|\W)\{|\}(\w|\W)|(\w|\W)\<|\>(\w|\W)|(\w|\W)\[|\](\w|\W)|(\w|\W)\`|\`(\w|\W)|(\w|\W)\″|\″(\w|\W)|(\w|\W)\„|\„(\w|\W)|(\w|\W)\“|\”(\w|\W)|(\w|\W)\‹|\›(\w|\W)|(\w|\W)\«|»(\w|\W)/gm //' ’ ′ single quotes not included so not to do bad on stuffs like, don't, o’ clock
        console.log(text.match(regNoSpaceBeforeEnclosers))
        */
        const regSpaceBeforeDelimeters = /(?<=\w)\s+(\.|\!|\?)(?=\s)/gm //match first
        const regSpaceBetweenDelimeters = /(\.\s+(?=\.+)|\!\s+(?=\!+)|\?\s+(?=\?+))/gm //next
        const regSpaceBeforeWords = /(?<=(\.|\!|\?))\s{2,}(\w|\W)/gm //next
        text = text.trim()
        //The following must be in steps, if m1 succeds, m2 should work on what m1 produced
        const m1 = regSpaceBeforeDelimeters.test(text)
        if (m1) text.match(regSpaceBeforeDelimeters).map(value => text = text.replace(value, value.trim()))
        const m2 = regSpaceBetweenDelimeters.test(text)
        if (m2) text.match(regSpaceBetweenDelimeters).map(value => text = text.replace(value, value.trim()))
        const m3 = regSpaceBeforeWords.test(text)
        if (m3) text.match(regSpaceBeforeWords).map(value => text = text.replace(value, ' ' + value.trim()))
        status = !!m1 || !!m2 || !!m3
        return this.#returnMan(text, status)
      } catch (error) {
        throw new Error(`\nKINGCHOP ERROR!\nERROR CODE: E03.\nCAUSE: "${error.name}".\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`)
      }
    }
    #exceptionsList() {
      let EXCEPTIONS = new Set(['Dr', 'etc', 'Jr', 'M', 'Mgr', 'p', 'Mr', 'Mrs', 'Ms', 'Mme', 'Mlle', 'Prof', 'Sr', 'St', 'pp', 'Pst', 'Dj', 'Po']);
      if (this.addExcepts) {
        if (Array.isArray(this.addExcepts)) this.addExcepts.map(e => EXCEPTIONS.add(e))
        else EXCEPTIONS.add(this.addExcepts)
      } else if (this.useExceptions) EXCEPTIONS = new Set(this.useExceptions)
      const EXCEPTIONSARR = []
      EXCEPTIONS.forEach(e => EXCEPTIONSARR.push(e))
      return EXCEPTIONSARR
    }
    toSentence(text) {
      try {
        let status = true
        text = this.#helpProcessInit(text, 'toSentence')
        const processSentenceTokens = (text) => {
          const regDelimeters = /\.{2,}|\!{2,}|\?{2,}/g //strict delimiters match
          const regDelimetersExt = /(\.\s+|\!\s+|\?\s+)/g // match delimiters if space comes after
          const regIgnoreEnclosers = /\([^\)]+\)|\s+\'.+\'|\".+\"|\*.+\*|\{.+\}|\<.+\>|\[.+\]|\`.+\`|\″.+\″|\s+\′.+\′|\s+\‘.+\’|\„.+\„|\“.+\”|\‹.+\›|\«.+\»/g //' ’ ′ single quotes not included so not to do bad on stuffs like, don't, o’ clock
          // const regIgnoreEnclosers = /\s\([^\)]+\)|\s\'.+\'|\s\".+\"|\s\*.+\*|\s\{.+\}|\s\<.+\>|\s\[.+\]|\s\`.+\`|\s\″.+\″|\s\′.+\′|\s\‘.+\’|\s\„.+\„|\s\“.+\”|\s\‹.+\›|\s\«.+\»/gm //test01 Experiment
          const ellipsReg = new RegExp(/\.{3,}\w*|\w*\.{3,}/, 'g')
          const numbListFormReg = /^\s*\d+\s*\./g //matches digit and period on every line beginning
          const ellipsIdenti = '§§§××××××§§§'
          const exceptsIdenti = '§§§§×××××××§§§§'
          const delIdenti = '§§§§§××××××××§§§§§'
          const enclosersIdenti = '§§§§§§×××××××××§§§§§§'
          const numbListFormIdenti = '§§§§§^^^^^§§§§§'
          const arrayBreakAt = '§§§§§§§××××××××××§§§§§§§'
          // const deliMatch = text.match(regDelimeters) //match strict
          const exceptionsArr = this.#exceptionsList()
          const exceptsCoreBefore = '(\\.\\s*|!\\s*|\\?\\s*)?'
          const exceptsCoreAfter = '(\\s*\\.|\\s*\\!|\\s*\\?)'
          let exceptsMatch = false

          /*Setion: 1. Here, Everything that's is not needed to be matched is replaced with a string, their identification*/
          if (numbListFormReg.test(text)) { //test if match on numbListForm: It checks if sentence starts with numbers, followed by a fullstop
            var numbListFormMatch = text.match(numbListFormReg)
            numbListFormMatch.map(value => text = text.replace(value, numbListFormIdenti))
          }

          const exceptsTower = (function() {
            if (exceptionsArr) {
              let exceptsBuild = exceptionsArr.reduce((acc, value) => acc + value + '|', '')
              exceptsBuild = exceptsBuild.slice(0, -1) //to remove last pipe
              const regExceptsBuild = new RegExp(`(?<!(\\w|\W))(${exceptsCoreBefore}(${exceptsBuild})${exceptsCoreAfter})`, 'gi') // in the string, 'kingchop.', p is part of exceptions, so we lookbehind for any word behind, so breaking and replacing can be done properly. This means sll exceptions most look out for a word behind them. If . or space or nothing is behind, this matches successfully.
              exceptsMatch = text.match(regExceptsBuild)
            }
          })()

          if (exceptsMatch) exceptsMatch.map(value => text = text.replace(value, exceptsIdenti))


          if (regIgnoreEnclosers.test(text) && (this.actOnEnclosers === false)) {
            var enclosersMatch = text.match(regIgnoreEnclosers) //match anything that encloses text
            enclosersMatch.map(value => text = text.replace(value, enclosersIdenti))
          }
          if (ellipsReg.test(text)) {
            var ellipsMatch = text.match(ellipsReg) //match any ellips
            ellipsMatch.map(value => text = text.replace(value, ellipsIdenti))
          }
          /*Section: 1. End*/

          /*Section: 2. Here, we check what the delimeters option is set to, and use their corresponding matchers. We split into arrays too in this section.*/
          if (this.showDelimeters === true) {
            if (regDelimetersExt.test(text)) {
              const deliExt = text.match(regDelimetersExt) //match the other
              deliExt.map(value => {
                //value will contain space, due to regex and word boundaries, so i'll trim it
                const valueTrimed = value.trim()
                const update_deli = valueTrimed + delIdenti //
                text = text.replace(value, update_deli) //update each original match by adding an identifier thats going to be splited in place of the delimiters. Only when showDelimeters is true
              })
              text = text.split(delIdenti) //split on the identifier
              text = this.#spaceOffAndTrim(text) // clean up
            } else status = false //no match
          }
          else if (this.showDelimeters === false) {
            if (regDelimetersExt.test(text)) {
              text = text.split(regDelimetersExt) //split on the delimiters
              if (text.join(arrayBreakAt).match(regDelimeters)) { //check for continous delimiters, so as to remove them
                text = text.join(arrayBreakAt)
                const continousDeli = text.match(regDelimeters)
                continousDeli.map(value => text = text.replace(value, arrayBreakAt))
                text = text.split(arrayBreakAt)
              }
              text = this.#spaceOffAndTrim(text) //clear spaces and and trim
            } else status = false
          }
          /*Section: 2. End*/

          /*Section: 3. We put back everything that was not needed to be matched, according to their identification. Section 2 may fail, leaving status false (no match), so a string will have to be passed in. The functions handling this, can handle both strings and arrays.*/
          if (numbListFormMatch) text = fixNumbListForm(text) //put back number list
          if (exceptsMatch) text = fixExceptions(text) //put back exceptions 
          if (enclosersMatch) text = fixEnclosers(text) //put back enclosers
          if (ellipsMatch) text = fixEllips(text) //put back ellips content
          text = Array.isArray(text) ? this.#spaceOffAndTrim(text) : text //if string, this.correct will trim it. further trim. things like enclosers may appear at last array, after triming and spacing has been done. So we do it again.

          function fixNumbListForm(text) { //text could be string or array, depending on whats true above
            if (Array.isArray(text)) {
              text = text.join(arrayBreakAt)
              numbListFormMatch.map(value => text = text.replace(numbListFormIdenti, value))
              text = text.split(arrayBreakAt)
            } else numbListFormMatch.map(value => text = text.replace(numbListFormIdenti, value))
            return text
          }

          function fixExceptions(text) {
            if (Array.isArray(text)) {
              text = text.join(arrayBreakAt)
              exceptsMatch.map(value => text = text.replace(exceptsIdenti, value))
              text = text.split(arrayBreakAt)
            } else exceptsMatch.map(value => text = text.replace(exceptsIdenti, value))
            return text
          }

          function fixEnclosers(text) { //text could be string or array, depending on whats true above
            if (Array.isArray(text)) {
              text = text.join(arrayBreakAt)
              enclosersMatch.map(value => text = text.replace(enclosersIdenti, value))
              text = text.split(arrayBreakAt)
            } else enclosersMatch.map(value => text = text.replace(enclosersIdenti, value))
            return text
          }

          function fixEllips(text) { //text could be string or array, depending on whats true above
            if (Array.isArray(text)) {
              text = text.join(arrayBreakAt)
              ellipsMatch.map(value => text = text.replace(ellipsIdenti, value))
              text = text.split(arrayBreakAt)
            } else ellipsMatch.map(value => text = text.replace(ellipsIdenti, value))
            return text
          }
          /*Section: 3. End*/
          return text
        }
        const regPara = /\n/gm
        if (regPara.test(text)) {
          text = text.split(regPara)
          text = this.#spaceOffAndTrim(text)
          let pileUpArrays = text.map(value => processSentenceTokens(value))
          text = pileUpArrays.flat()
        } else text = processSentenceTokens(text)
        return this.#returnMan(text, status)
      } catch (error) {
        throw new Error(error)
        //    throw new Error(`\nKINGCHOP ERROR!\nERROR CODE: E03.\nCAUSE: "${error.name}".\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`)
      }
    }
    toParagraph(text) {
      try {
        let status = true
        text = this.#helpProcessInit(text, 'toParagraph')
        const regPara = /\n/gm
        if (regPara.test(text)) {
          text = text.split(regPara)
          text = this.#spaceOffAndTrim(text)
          text = text.map(value => this.#accessPublicInUseMethods(value, 'correctText')) //correct text from here
        } else status = false
        return this.#returnMan(text, status)
      }
      catch (error) {
        throw new Error(`\nKINGCHOP ERROR!\nERROR CODE: E03.\nCAUSE: "${error.name}".\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`)
      }
    }
    toSubSentence(text) {
      throw new Error(`\nKINGCHOP ERROR\nERROR CODE: E04.\nREASON: Kingchop is causing the error on purpose. This very common.\nCAUSE: You tried to access a "coming soon" method.\nCORRECTION: Do not call this method until it is fully available.\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`)
      //coming soon
    }
    toWord(text) {
      let status = true
      text = this.#helpProcessInit(text, 'toWord')
      const processWordTokens = (text) => {
        const regSpaces = /\s/g
        const regNoSpaceBetweenWordsAndNonWord = /[^\s\w’‘'′]\w|\w[^\s\w’‘'′]/g // Matches no space between words and anything not word and single quotes, like, ', ′, ‘, ’ to succeed on words like don't, o’ clock
        const regNoSpaceBetweenNonWord = /[^\s\w][^\s\w]/g // matches non word and non word
        if (this.showNonWords === false) text = text.replace(/[^\s\w’‘'′]/g, '') //remove all non words
        const m1 = regNoSpaceBetweenWordsAndNonWord.test(text)
        const m2 = regNoSpaceBetweenNonWord.test(text)
        if (m1) text.match(regNoSpaceBetweenWordsAndNonWord).map(value => text = text.replace(value, value[0] + ' ' + value[1]))
        if (m2) text.match(regNoSpaceBetweenNonWord).map(value => text = text.replace(value, ' ' + value[0] + ' ' + value[1] + ' '))
        if (regSpaces.test(text)) {
          text = text.split(regSpaces)
          text = this.#spaceOffAndTrim(text)
        }
        status = !!m1 || !!m2
        return text
      }
      const regPara = /\n/gm
      if (regPara.test(text)) {
        text = text.split(regPara)
        text = this.#spaceOffAndTrim(text)
        let pileUpArrays = text.map(value => processWordTokens(value))
        text = pileUpArrays.flat()
      } else text = processWordTokens(text)

      return this.#returnMan(text, status)
    }
    #levelUp() {
      throw new Error(`\nKINGCHOP ERROR\nERROR CODE: E04.\nREASON: Kingchop is causing the error on purpose. This very common.\nCAUSE: You tried to access a "coming soon" method.\nCORRECTION: Do not call this method until it is fully available.\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`)
      //coming soon
    }
    #helpProcessInit(text, whoami) { //helps in checking param, correcting text, and lowercasing it
      if (!(typeof text === 'string')) throw new Error(`\nKINGCHOP ERROR!\nERROR CODE: E02.\nREASON: The parameter of the method ${whoami}() is invalid.\nCAUSE: You inputed: "${text}" as the parameter of the ${whoami}() method.\nCORRECTION: The ${whoami}() method only accepts a value, a string.\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`)
      if (/^\s*$/.test(text)) throw new Error(`\nKINGCHOP ERROR!\nERROR CODE: E02.\nREASON: The parameter of the method ${whoami}() is invalid.\nCAUSE: The parameter of the ${whoami}() method was an empty string.\nCORRECTION: The ${whoami}() method only accepts a value, a string.\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`)
      if (this.correct && (whoami !== 'toWord' && whoami !== 'toParagraph')) text = this.#accessPublicInUseMethods(text, 'correctText') //correct text if correct opt is set to true, and the next is for devMode
      if (this.lowcase) text = text.toLowerCase()
      return text
    }
    #returnMan(text, status) { //helps in returning text
      return this.returnStatus ? { value: text, status: status } : text
    }
    #accessPublicInUseMethods(value, whoami) {
      //public extra methods help others, but we use them in kingchop processes.The returnStatus if true, conditions all public methods to return an object, {value, status}. This private method helps us check that and returns the actual value. Value from public method is needed for Kingchop processes not object.
      let result
      if (whoami === 'correctText' && this.correct) result = this.correctText(value)
      else result = value
      if (this.returnStatus === true && this.correct) return result.value //only value from public method is needed
      else result = value
      return result
    }
    #spaceOffAndTrim(text) { return text.map(e => e = e.trim()).filter(e => e !== '') }
  }
  module.exports = Kingchop
}
catch (error) {
  throw new Error(`\nKINGCHOP ERROR!\nERROR CODE: E03.\nCAUSE: "${error.name}".\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`)
}
/*
    ✅✅ lowcase: default false 
    ✅✅ addToExceptions: default null: adds more exceptions to the exceptions array after filtering possible duplicates
    ✅✅ useExceptions: default null: use only provided exceptions
    ✅✅ actOnEnclosers: default false: to make match and possibly break in enclosers like (), ''...
    ✅✅ showDelimeters: default true: leaves the delimeters in belonging arrays instead of removing them
    ✅✅ correct: default true: tries to correct the text
    ✅✅ showNonWords: default true: this is only used by toWord method. it removes all non words if false, except, single quotes that give meaning to words like, don't, your's.
    ✅✅ returnStatus: default false: returns an output in object form. {value: 'Whatever was processed', status: true or false (if anything was done or not)
    options = {addExceptions: ['co', 'inc', 'ltd', 'org'],  useExceptions: ['org', 'inc', 'ltd'], showDelimeters: false, lowcase: true}
*/
/*
toSentence is not tokenizing properly. Eg: text = '1. Play. 2. Don't write 3. Jump around.'
add That toWord can handle words like, don't, o’ clock
*/