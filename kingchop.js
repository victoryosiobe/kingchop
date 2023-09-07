try {
  const clc = require('cli-color')

  class Kingchop {
    constructor(options) {
      // this.text = text
      this.showDelimeters = true
      this.lowcase = false
      this.addExcepts = null
      this.useExceptions = null
      this.actOnEnclosers = false
      this.correct = true
      this.returnStatus = false
      if (options) this.options = options
      if (this.options) {
        const { addToExceptions, useExceptions, showDelimeters, lowcase, actOnEnclosers, correct, returnStatus } = this.options
        if (addToExceptions) this.addExcepts = addToExceptions
        if (useExceptions) this.useExceptions = useExceptions
        if (showDelimeters === false) this.showDelimeters = showDelimeters
        if (lowcase) this.lowcase = lowcase
        if (actOnEnclosers) this.actOnEnclosers = actOnEnclosers
        if (correct === false) this.correct = correct
        if (returnStatus) this.returnStatus = returnStatus
        /*
             if (this.addExcepts) {
                if (!Array.isArray(this.addExcepts)) {
                  throw `${clc.red("Kingchop Module Error, ERR1:\nThe parameter, addToExceptions is not an array.\nIf you use only 1 (one) value, you should put it in array form.\nExample: If your value is 'etc', ['etc'], or Array.from('etc').")}`
                }
                this.addExcepts = this.addExcepts.flat(Infinity)
              }
              if (this.useExceptions) {
                   if (!Array.isArray(this.useExceptions)) {
                     throw `${clc.red("Kingchop Module Error, ERR2:\nThe parameter, useExceptions is not an array.\nIf you use only 1 (one) value, you should put it in array form.\nExample: If your value is 'etc', ['etc'], or Array.from('etc').")}`
                   }
                this.useExceptions = this.useExceptions.flat(Infinity)
              }*/
      }

      /*
    ✅✅ lowcase: default false 
    ✅✅ addToExceptions: default null: adds more exceptions to the exceptions array after filtering possible duplicates
    ✅✅ useExceptions: default null: use only provided exceptions
    ✅✅ actOnEnclosers: default false: to make match and possibly break in enclosers like (), ''...
    ✅✅ showDelimeters: default true: leaves the delimeters in belonging arrays instead of removing them
    ✅✅ correct: default true: tries to correct the text
    ✅✅ returnStatus: default false: returns an output in object form. {value: 'Whatever was processed', status: true or false (if anything was done or not)
    options = {addExceptions: ['co', 'inc', 'ltd', 'org'],  useExceptions: ['org', 'inc', 'ltd'], showDelimeters: false, lowcase: true}
*
  }
    /*treat stuff like:
    'This is me.. Hello there. Running away.'
    'Then... He came back'
    */



    }
    correctText(text) {
      /* Experiment
      const regNoSpaceBeforeEnclosers = /(\w|\W)\(|\)(\w|\W)|(\w|\W)\"|\"(\w|\W)|(\w|\W)\*|\*(\w|\W)|(\w|\W)\{|\}(\w|\W)|(\w|\W)\<|\>(\w|\W)|(\w|\W)\[|\](\w|\W)|(\w|\W)\`|\`(\w|\W)|(\w|\W)\″|\″(\w|\W)|(\w|\W)\„|\„(\w|\W)|(\w|\W)\“|\”(\w|\W)|(\w|\W)\‹|\›(\w|\W)|(\w|\W)\«|»(\w|\W)/gm //' ’ ′ single quotes not included so not to do bad on stuffs like, don't, o’ clock
      console.log(text.match(regNoSpaceBeforeEnclosers))
      */
      const regSpaceBeforeDelimeters = /(?<=\w)\s{3,}(\.|\!|\?)/gm //Experimental. This would require 3 spaces before kicking in. Example in the string 'He has the   .org domain.'. it would change to 'He has the.org domain.' Which is wrong.
      const regSpaceBetweenDelimeters = /(\.\s+(?=\.+)|\!\s+(?=\!+)|\?\s+(?=\?+))/gm
      text = text.trim()
      const m1 = text.match(regSpaceBeforeDelimeters)
      console.log(m1)
      if (m1) m1.map(value => text = text.replace(value, value.trim()))
      const m2 = text.match(regSpaceBetweenDelimeters)
      if (m2) m2.map(value => text = text.replace(value, value.trim()))
      return text
    }
    #exceptionsList() {
      let EXCEPTIONS = new Set(['Dr', 'etc', 'Jr', 'M', 'Mgr', 'p', 'Mr', 'Mrs', 'Ms', 'Mme', 'Mlle', 'Prof', 'Sr', 'St', 'pp', 'Pst', 'Dj', 'Po']);
      if (this.addExcepts) {
        if (Array.isArray(this.addExcepts)) {
          this.addExcepts.map(e => EXCEPTIONS.add(e))
        }
        else {
          EXCEPTIONS.add(this.addExcepts)
        }
      }
      else if (this.useExceptions) {
        EXCEPTIONS = new Set(this.useExceptions)
      }
      else {

      }
      const EXCEPTIONSARR = []
      EXCEPTIONS.forEach(e => {
        EXCEPTIONSARR.push(e)
      })
      return EXCEPTIONSARR
    }
    toSentence(text) {
      try {
        let status = true
        if (this.correct) text = this.correctText(text) //test01 correct text if correct opt is set to true
        if (this.lowcase) text = text.toLowerCase() //test01
        const regDelimeters = /\.{2,}|\!{2,}|\?{2,}/gm //strict delimiters match
        const regDelimetersExt = /(\.\s+|\!\s+|\?\s+)/gm // match delimiters if space comes after
        const regIgnoreEnclosers = /\s\([^\)]+\)|\s\'.+\'|\s\".+\"|\s\*.+\*|\s\{.+\}|\s\<.+\>|\s\[.+\]|\s\`.+\`|\s\″.+\″|\s\′.+\′|\s\‘.+\’|\s\„.+\„|\s\“.+\”|\s\‹.+\›|\s\«.+\»/gm
        const ellipsReg = new RegExp(/\.{3,}\w*|\w*\.{3,}/, 'gm')
        const ellipsIdenti = '§§§××××××§§§'
        const exceptsIdenti = '§§§§×××××××§§§§'
        const delIdenti = '§§§§§××××××××§§§§§'
        const enclosersIdenti = '§§§§§§×××××××××§§§§§§'
        const arrayBreakAt = '§§§§§§§××××××××××§§§§§§§'
        // const deliMatch = text.match(regDelimeters) //match strict
        const exceptionsArr = this.#exceptionsList()
        const exceptsCoreBefore = '(\\.\\s*|!\\s*|\\?\\s*)?'
        const exceptsCoreAfter = '(\\s*\\.|\\s*\\!|\\s*\\?)'
        let exceptsMatch = false

        /*Setion: 1. Here, Everything that's is not needed to be matched is replaced with a string, their identification*/
        const exceptsTower = (function() {
          if (exceptionsArr) {
            let exceptsBuild = exceptionsArr.reduce((acc, value) => {
              return acc + value + '|'
            }, '')
            exceptsBuild = exceptsBuild.slice(0, -1) //to remove last pipe
            const regExceptsBuild = new RegExp(`(?<!(\\w|\W))(${exceptsCoreBefore}(${exceptsBuild})${exceptsCoreAfter})`, 'mgi') // in the string, 'kingchop.', p is part of exceptions, so we lookbehind for any word behind, so breaking and replacing can be done properly. This means sll exceptions most look out for a word behind them. If . or space or nothing is behind, this matches successfully.
            exceptsMatch = text.match(regExceptsBuild)
          }
        })()

        if (exceptsMatch) {
          exceptsMatch.map(value => {
            text = text.replace(value, exceptsIdenti)
          })
        }

        if (regIgnoreEnclosers.test(text) && (this.actOnEnclosers === false)) {
          var enclosersMatch = text.match(regIgnoreEnclosers) //match anything that encloses text
          enclosersMatch.map(value => {
            text = text.replace(value, enclosersIdenti)
          })
        }
        if (ellipsReg.test(text)) {
          var ellipsMatch = text.match(ellipsReg) //match any ellips
          ellipsMatch.map(value => {
            text = text.replace(value, ellipsIdenti)
          })
        }

        /*Section: 1. End*/

        /*Section: 2. Here, we check what the delimeters option is set to, and use their corresponding matchers. We split into arrays too in this section.*/
        /*  if ((this.showDelimeters === false) && deliMatch) { //check if setting is turned on for showing delimeters in sentences in array format, and if that strict match was a success 
            text = text.split(regDelimeters) //split on the delimetrs
            text = spaceOffAndTrim(text) //clear spaces and and trim
          }*/
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
            text = spaceOffAndTrim(text) // clean up
          }
          else {
            status = false
            //no match
          }
        }
        else if (this.showDelimeters === false) {
          if (regDelimetersExt.test(text)) {
            text = text.split(regDelimetersExt) //split on the delimiters
            if (text.join(arrayBreakAt).match(regDelimeters)) { //check for continous delimiters, so as to remove them
              text = text.join(arrayBreakAt)
              const continousDeli = text.match(regDelimeters)
              console.log(text, continousDeli)
              continousDeli.map(value => text = text.replace(value, arrayBreakAt))
              text = text.split(arrayBreakAt)
            }
            text = spaceOffAndTrim(text) //clear spaces and and trim
          }
          else {
            status = false
          }
        }

        /*Section: 2. End*/

        /*Section: 3. We put back everything that was not needed to be matched, according to their identification. Section 2 may fail, leaving status false (no match), so a string will have to be passed in. The functions handling this, can handle both strings and arrays.*/
        if (exceptsMatch) text = fixExceptions(text) //put back exceptions 
        if (enclosersMatch) text = fixEnclosers(text) //put back enclosers
        if (ellipsMatch) text = fixEllips(text) //put back ellips content
        text = Array.isArray(text) ? spaceOffAndTrim(text) : text //if string, this.correct will trim it. further trim. things like enclosers may appear at last array, after triming and spacing has been done. So we do it again.

        function fixExceptions(text) {
          if (Array.isArray(text)) {
            text = text.join(arrayBreakAt)
            exceptsMatch.map(value => text = text.replace(exceptsIdenti, value))
            text = text.split(arrayBreakAt)
          }
          else {
            exceptsMatch.map(value => {
              text = text.replace(exceptsIdenti, value)
            })
          }
          return text
        }

        function fixEnclosers(text) { //text could be string or array, depending on whats true above
          if (Array.isArray(text)) {
            text = text.join(arrayBreakAt)
            enclosersMatch.map(value => text = text.replace(enclosersIdenti, value))
            text = text.split(arrayBreakAt)
          }
          else {
            enclosersMatch.map(value => {
              text = text.replace(enclosersIdenti, value)
            })
          }
          return text
        }

        function fixEllips(text) { //text could be string or array, depending on whats true above
          if (Array.isArray(text)) {

            text = text.join(arrayBreakAt)
            ellipsMatch.map(value => text = text.replace(ellipsIdenti, value))
            text = text.split(arrayBreakAt)

          }
          else {
            ellipsMatch.map(value => {
              text = text.replace(ellipsIdenti, value)
            })
          }
          return text
        }
        /*Section: 3. End*/

        function spaceOffAndTrim(text) { return text.map(e => e = e.trim()).filter(e => e !== '') }

        return this.returnStatus ? { value: text, status: status } : text
      }
      catch (error) {
        console.error('KingChop Failed On Processing Input ', error, error.stack)
      }
    }
    #levelUp() {
      //coming soon
    }
  }

  module.exports = Kingchop
}
catch (error) {
  console.error(error, error.stack)
}