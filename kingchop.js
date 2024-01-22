const { advancedEnclosersExtract, areEnclosersBalanced, reFine, paraCore, attachEnclosers, nextValueFn, escaper } = require('./helper.js')
class Kingchop {
  constructor(options) {
    this.showDelimeters = true
    this.lowcase = false
    this.addExcepts = null
    this.useExceptions = null
    this.actOnEnclosers = false
    this.correct = true
    this.gravity = true
    this.returnStatus = false
    if (options) this.options = options
    if (this.options) {
      const { addToExceptions, useExceptions, showDelimeters, lowcase, actOnEnclosers, correct, gravity, returnStatus } = this.options
      if (addToExceptions) this.addExcepts = addToExceptions
      if (useExceptions) this.useExceptions = useExceptions
      if (showDelimeters === false) this.showDelimeters = showDelimeters
      if (lowcase) this.lowcase = lowcase
      if (actOnEnclosers) this.actOnEnclosers = actOnEnclosers
      if (correct === false) this.correct = correct
      if (gravity === false) this.gravity = gravity
      if (returnStatus) this.returnStatus = returnStatus
      this.#checkParams(arguments)
    }
  }
  toSentence(text = '') {
    let status = true
    text = this.#helpProcessInit(text, 'toSentence', arguments)
    if (this.correct) text = this.#publicMethods(text, 'correctText') //correct text from here
    const processSentenceTokens = (text) => {
        const masterState = []
        const regDelimetersExt = /(\.{2,}\s+|\!{2,}\s+|\?{2,}\s+)|(\.\s+|\!\s+|\?\s+)/g // match delimiters when space comes after
        const regIgnoreEnclosers = this.#enclosersStyle() // /\s\([^\)]+\)|\s\'.+\'|\s\".+\"|\s\*.+\*|\s\{.+\}|\s\<.+\>|\s\[.+\]|\s\`.+\`|\s\″.+\″|\s\′.+\′|\s\‘.+\’|\s\„.+\„|\s\“.+\”|\s\‹.+\›|\s\«.+\»/gm //test01 Experiment
        const regDelimetersExtInQuotes = /((\.{2,}\s*|\!{2,}\s*|\?{2,}\s*)|(\.\s*|\!\s*|\?\s*))(”|")$/g
        const ellipsReg = /((?<=[^\s])\.{3,})(?!$)|(\.{3,}(?=[^\s]))(?!$)/g
        const numbListFormReg = /^\s*\d+\s*\.\s+/g //matches digits followed by period on every line beginning
        const exceptionsList = this.#exceptionsList('with_cores')
        const mainIdenti = '&∆×§§§§§§§§§§§§§§§§§§§§§§§§§§§§§§×∆&'
        const splitIdenti = '-&∆×§§§§-§§§§§§§§§+§§§§§§§§§§-§§§§§§§×∆&-'
        let enclosersMatch, mainIdentiTextState, splitIdentiTextState, mainIdentiEscapeValue, splitIdentiEscapeValue

        const section1 = (() => { //escape layer
          const step1 = (() => {
            mainIdentiTextState = escaper(text, mainIdenti, 'begin') //Escapes mainIdenti if found in text.
            if (mainIdentiTextState.status === false) mainIdentiTextState = false
            else {
              text = mainIdentiTextState.text
              mainIdentiEscapeValue = mainIdentiTextState.escaper
            }
          })()
          const step2 = (() => {
            splitIdentiTextState = escaper(text, splitIdenti, 'begin') //Escapes mainIdenti if found in text.
            if (splitIdentiTextState.status === false) splitIdentiTextState = false
            else {
              text = splitIdentiTextState.text
              splitIdentiEscapeValue = splitIdentiTextState.escaper
            }
          })()
        })() //escape layer

        const section2 = (() => { //encryption layer
          const step1 = (() => {
            if (numbListFormReg.test(text)) { //test if match on numbListForm: It checks if sentence starts with numbers, followed by a fullstop
              let startIndex = 0
              text = text.replace(numbListFormReg, (match) => {
                const index = text.indexOf(match, startIndex)
                startIndex = index + match.length
                masterState.push([match, index])
                return mainIdenti
              })
            }
          })()
          const step2 = (() => {
            if (exceptionsList.test(text)) { //test if match on numbListForm: It checks if sentence starts with numbers, followed by a fullstop
              let startIndex = 0
              text = text.replace(exceptionsList, (match) => {
                const index = text.indexOf(match, startIndex)
                startIndex = index + match.length
                masterState.push([match, index])
                return mainIdenti
              })
            }
          })()
          const step3 = (() => {
            if (regIgnoreEnclosers.test(text) && (this.actOnEnclosers === false)) {
              let startIndex = 0
              text = text.replace(regIgnoreEnclosers, (match) => {
                let outIgo = mainIdenti
                if (match.endsWith('"') || match.endsWith('”')) {
                  regDelimetersExtInQuotes.lastIndex = 0 //reset regex state for correct testing
                  if (regDelimetersExtInQuotes.test(match)) outIgo += splitIdenti //we would split on this identifier in section3 
                }
                const index = text.indexOf(match, startIndex)
                startIndex = index + match.length
                masterState.push([match, index])
                return outIgo
              })
            }
          })()
          const step4 = (() => {
            if (ellipsReg.test(text)) {
              let startIndex = 0
              text = text.replace(ellipsReg, (match) => {
                const index = text.indexOf(match, startIndex)
                startIndex = index + match.length
                masterState.push([match, index])
                return mainIdenti
              })
            }
          })()
        })() //encryption layer

        const section3 = (() => { //split layer
          const step1 = (() => {
            const m1 = regDelimetersExt.test(text)
            if (this.showDelimeters === true) {
              if (m1) text = text.replace(regDelimetersExt, (match) => reFine(match) + splitIdenti)
              text = text.split(splitIdenti) //split on the identifier
            } else {
              if (m1) text = text.replace(regDelimetersExt, splitIdenti)
              text = text.split(splitIdenti) //split on the identifier
            }
            text = reFine(text) // clean up
            status = m1 || false
          })()
        })() //split layer

        const section4 = (() => { //decyrption layer
          if (masterState.length !== 0) {
            masterState.sort((a, b) => a[1] - b[1]) //arrange based on index number (ascending order)
            for (let i = 0; i < text.length; i++) {
              const encryptMatch = text[i].match(new RegExp(mainIdenti, 'g'))
              if (!encryptMatch) continue
              for (let j = 0; j < encryptMatch.length; j++) text[i] = text[i].replace(mainIdenti, masterState.shift()[0])
            }
          }
        })() //decryption layer

        const section5 = (() => { //unescaped layer
          const step1 = (() => mainIdentiTextState ? text = escaper(text, mainIdentiEscapeValue, 'end').text : void(0))()
          const step2 = (() => splitIdentiTextState ? text = escaper(text, splitIdentiEscapeValue, 'end').text : void(0))()
        })() //unescape layer

        return text
      }
      (() => {
        const para = this.#passParaCore(text)
        text = para.value
        const paraStat = para.status
        if (paraStat) {
          const pileUpArrays = text.map(v => processSentenceTokens(v))
          text = pileUpArrays.flat()
        }
        else text = processSentenceTokens(text)
        text = reFine(text)
      })()
    /* ⛓️ console.log(text, attachEnclosers(text), 'hallo').  */
    if (this.gravity && (this.showDelimeters !== false)) {
      const res = this.#gravityFn(text, this.gravity)
      text = res.value
      status = res.stat
    }

    return this.#returnMan(text, status)
  }
  toSubSentence(text = '') {
    let status = false
    const stepsRes = {}
    text = this.#helpProcessInit(text, 'toSubSentence', arguments)
    this.gravity = false //turn off if on. We don't need it
    const sen = this.toSentence(text)
    if (this.#returnStatusPass()) {
      text = sen.value
      if (sen.status === true) status = true //if sentence array was produced, this is also part of this method. Not just the sub-sentence-processor. Hence, it influences decisions
    } else text = sen
    const processSubSentenceTokens = (text) => {
        //# ADD TRAILING DELIMITERS FINDER TOO
        let textState, escapeValue
        const nativeDeli = /(\:{2,}|\;{2,}|\,{2,}|\s(\-{2,})|\s(\—{2,})|\s(·{2,}))|(\:|\;|\,|\s\-|\s\—|\s·)/g
        const enclosersDeli = this.#enclosersStyle()
        const subIdenti = '§§§§§§§§§§§↑↑↑↑↑←@→↑↑↑↑↑§§§§§§§§§§§'
        textState = escaper(text, subIdenti, 'begin') //Escapes subIdenti if found in text.
        if (textState.status === false) textState = false
        else {
          text = textState.text
          escapeValue = textState.escaper
        }
        const step1 = (input) => {
          let textChoice = input || text
          const m1 = nativeDeli.test(textChoice)
          if (m1) {
            if (this.showDelimeters) textChoice = textChoice.replace(nativeDeli, (match) => match + subIdenti)
            else textChoice = textChoice.replace(nativeDeli, (match) => subIdenti)
          }
          stepsRes.m1 = m1
          return textChoice
        }

        const step2 = () => {
          const m2 = enclosersDeli.test(text)
          if (m2) {
            const enclosersMatch = text.match(enclosersDeli)
            if (this.actOnEnclosers === false) text = text.replace(enclosersDeli, (match) => subIdenti + match + subIdenti)
            else {
              const enclosersMatchTwin = enclosersMatch.map(v => step1(v))
              enclosersMatch.map((v, i) => text = text.replace(v, enclosersMatchTwin[i]))
            }
            stepsRes.m2 = m2
          }
        }

        const step3 = () => { //this removes unnecessary subIdenti
          const pass = stepsRes.m2 //m2 creates the mess, so...
          if (pass) {
            const modRegHelp = new RegExp(`${subIdenti}(?=${nativeDeli.toString().slice(1, -2)})`, 'g')
            if (modRegHelp) text = text.replace(modRegHelp, '')
          }
        }

        const step4 = () => {
          const m4 = stepsRes.m1 || stepsRes.m2
          const inStep1 = (() => {
            if (m4) {
              text = text.split(subIdenti)
              stepsRes.m4 = m4
            }
          })()
          const inStep2 = (() => textState ? text = escaper(text, escapeValue, 'end').text : void(0))()
        }

        (() => {
          text = step1(text)
          step2()
          step3()
          step4()
        })()
        return text
        //we break on :|;|,|""|''|``|()|“”|„„|«»|‘’|‚‚|‹›|′′|″″|{}|[]|||
        //UPHEADEND
      }
      (() => {
        const para = this.#passParaCore(text)
        text = para.value
        const paraStat = para.status
        if (paraStat) {
          const pileUpArrays = text.map(v => processSubSentenceTokens(v))
          text = pileUpArrays.flat()
        }
        else text = processSubSentenceTokens(text)
        text = reFine(text)
      })()

    status = status || stepsRes.m4
    /* ⛓️   if (this.actOnEnclosers) { //change to === false
          console.log(text, 'entry into attachEnc')
          const textPress = this.#attachEnc(text, status)
          text = textPress.text
          status = textPress.status
        }*/
    return this.#returnMan(text, status)
  }
  toWord(text = '') { //mark
    let status = false
    text = this.#helpProcessInit(text, 'toWord', arguments)
    const stepsRes = {}
    const processWordTokens = (text) => {
        let textState, escapeValue
        const regSpaces = /\s/g
        const regNonWords = /[^\sA-Za-z0-9]/g
        const regOrderQuotes = /(?<=[A-Za-z])['’](?=[A-Za-z])/g //single quotes, like, ', ′, ‘, ’ to succeed on words like don't, o’clock. Kingchop won't consider single quotes after the word is completed, like in relatives’, patents', ol’
        let quoterIdenti = '<KINGCHOP-QUOTE-IDENTI>'
        let m1
        if (this.showDelimeters === false) text = text.replace(/[^\sA-Za-z0-9]/g, '') //remove all non words, except digits

        const step1 = () => {
          m1 = text.match(regOrderQuotes)
          if (m1) {
            textState = escaper(text, quoterIdenti, 'begin')
            if (textState.status === false) textState = false
            else {
              text = textState.text
              escapeValue = textState.escaper
            }
            text = text.replace(regOrderQuotes, quoterIdenti)
          }
          stepsRes.m1 = !!m1
        }

        const step2 = (peekInText) => {
          const m1 = regNonWords.test(text || peekInText)
          const spaceOut = (str, regex) => {
            return str = str.replace(regex, (match) => ' ' + match + ' ')
          }

          if (m1) {
            if (!peekInText) {
              text = spaceOut(text, regNonWords)
              stepsRes.m1 = m1
            }
            else return peekInText = spaceOut(peekInText, regNonWords)
          }
          else {
            if (peekInText) return peekInText
          }
        }
        const step3 = () => {
          if (m1) {
            //step2 causes spaces in the quoterIdenti and its own escape value, hence we modify it
            const inStep1 = (() => m1.map(v => text = text.replace(step2(quoterIdenti), v)))()
            const inStep2 = (() => textState ? text = escaper(text, step2(escapeValue), 'end').text : void(0))()
          }
          const inStep3 = (() => {
            const m3 = regSpaces.test(text) //done correctly. Since quoterIdenti would have spaces, it's best we put this here
            if (m3) text = text.split(regSpaces)
            stepsRes.m3 = m3
          })()
        }

        (() => {
          step1()
          step2()
          step3()
        })()
        return text
      }
      (() => {
        const para = this.#passParaCore(text)
        text = para.value
        const paraStat = para.status
        if (paraStat) {
          const pileUpArrays = text.map(v => processWordTokens(v))
          text = pileUpArrays.flat()
        }
        else text = processWordTokens(text)
        text = reFine(text)
      })()
    status = stepsRes.m3
    return this.#returnMan(text, status)
  }
  toParagraph(text = '') {
    let status = false
    text = this.#helpProcessInit(text, 'toParagraph', arguments)
    const para = this.#passParaCore(text)
    text = para.value
    const paraStat = para.status
    if (paraStat) {
      text = text.map(value => this.#publicMethods(value, 'correctText')) //correct text from here
      text = reFine(text)
      status = true
    }
    return this.#returnMan(text, status)
  }
  correctText(text = '') {
    let status = false
    //users can use this method but other methods of kingchop that use this method will never send in an invalid string.
    /* Experiment
    const regNoSpaceBeforeEnclosers = /(\w|\W)\(|\)(\w|\W)|(\w|\W)\"|\"(\w|\W)|(\w|\W)\*|\*(\w|\W)|(\w|\W)\{|\}(\w|\W)|(\w|\W)\<|\>(\w|\W)|(\w|\W)\[|\](\w|\W)|(\w|\W)\`|\`(\w|\W)|(\w|\W)\″|\″(\w|\W)|(\w|\W)\„|\„(\w|\W)|(\w|\W)\“|\”(\w|\W)|(\w|\W)\‹|\›(\w|\W)|(\w|\W)\«|»(\w|\W)/gm //' ’ ′ single quotes not included so not to do bad on stuffs like, don't, o’ clock
    console.log(text.match(regNoSpaceBeforeEnclosers))
    */
    text = this.#helpProcessInit(text, 'correctText', arguments)
    text = reFine(text)

    const stepsRes = {}

    function step1() {
      //handles space before delimeters, provided a word is before the spaces, and a space is after the delimeter
      const regSpaceBeforeDelimeters = /(?<=\w)\s+(\.|\!|\?)(?=\s{2,})/gm
      const m1 = regSpaceBeforeDelimeters.test(text)
      if (m1) text = text.replace(regSpaceBeforeDelimeters, (match) => reFine(match))
      stepsRes.m1 = m1
      //1st step
    }

    function step2() {
      //handles spaces behind a delimeter that a word follows.
      const regSpaceBeforeDelimetersWithWord = /(?<=\w)\s{2,}(?=(\.|\!|\?)\s*\w)/gm
      const m2 = regSpaceBeforeDelimetersWithWord.test(text)
      if (m2) text = text.replace(regSpaceBeforeDelimetersWithWord, (match) => ' ')
      stepsRes.m2 = m2
      //2nd step
    }

    function step3() {
      //handles delimeters close to each other
      const regSpaceBetweenDelimeters = /(\.\s+(?=\.+))|(\!\s+(?=\!+))|(\?\s+(?=\?+))/gm
      const m3 = regSpaceBetweenDelimeters.test(text)
      if (m3) text = text.replace(regSpaceBetweenDelimeters, (match) => reFine(match))
      stepsRes.m3 = m3
      //3rd step
    }

    function step4() {
      //handles alot of spaces, before a word, provided, a delimeter is before the spaces started
      const regSpaceBeforeWords = /(?<=(\.|\!|\?))\s{2,}(\w|\W)/gm
      const m4 = regSpaceBeforeWords.test(text)
      if (m4) text.match(regSpaceBeforeWords).map(value => text = text.replace(value, ' ' + reFine(value)))
      stepsRes.m4 = m4
      //4th step
    }

    function step5() {
      //handle trailing delimiters, even when the are not same, and are spaced out
      const regTrailingDelimeters = /(\s*((\.(\s|\.|\!|\?)+)|(\!(\s|\.|\!|\?)+)|(\?(\s|\.|\!|\?)+)))$/g
      const m5 = regTrailingDelimeters.test(text)
      if (m5) text = text.replace(regTrailingDelimeters, (match) => match.replace(/\s+/g, ''))
      stepsRes.m5 = m5
      //5th step
    }

    (function executeSteps() {
      step1()
      step2()
      step3()
      step4()
      step5()
    })()

    status = stepsRes.m1 || stepsRes.m2 || stepsRes.m3 || stepsRes.m4 || stepsRes.m5
    return this.#returnMan(text, status)
  }
  #checkParams(args) {
    if (args.length > 1) throw new Error(`\nKINGCHOP ERROR!\nERROR CODE: E03.\nREASON: The arguments of the kingchop initializer is invalid.\nCAUSE: The arguments of the Kingchop initializer was more than 1.\nCORRECTION: The Kingchop initializer only accepts a value, an object of options, not multiple arguments.\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`)
    if (this.options) {
      const { addToExceptions, useExceptions, showDelimeters, lowcase, actOnEnclosers, correct, returnStatus } = this.options
      const addTo1 = ` options of the Kingchop Instance.\nCORRECTION: Required value is null or a string or an array.\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`
      const addTo2 = ` .options of the Kingchop Instance.\nCORRECTION: Required value is true or false.\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`
      const beginWith = `\nKINGCHOP ERROR!\nERROR CODE: E01.\nREASON: Invalid Parameter Value.\nCAUSE: You inputed: `
      if (addToExceptions && !(Array.isArray(addToExceptions) || addToExceptions === null || addToExceptions === (typeof addToExceptions === 'string'))) throw new Error(`${beginWith}"${addToExceptions}" in the addToExceptions${addTo1}`)
      if (useExceptions && !(Array.isArray(useExceptions) || useExceptions === null || useExceptions === (typeof useExceptions === 'string'))) throw new Error(`${beginWith}"${useExceptions}" in the useExceptions${addTo1}`)
      if (showDelimeters && !(showDelimeters === true || showDelimeters === false)) throw new Error(`${beginWith}"${showDelimeters}" in the showDelimeters${addTo2}`)
      if (lowcase && !(lowcase === true || lowcase === false)) throw new Error(`${beginWith}"${lowcase}" in the lowcase${addTo2}`)
      if (actOnEnclosers && !(actOnEnclosers === true || actOnEnclosers === false)) throw new Error(`${beginWith}"${actOnEnclosers}" in the actOnEnclosers${addTo2}`)
      if (correct && !(correct === true || correct === false)) throw new Error(`${beginWith}"${correct}" in the correct${addTo2}`)
      if (returnStatus && !(returnStatus === true || returnStatus === false)) throw new Error(`${beginWith}"${returnStatus}" in the returnStatus${addTo2}`)
    }
  }
  #exceptionsList(isCores) {
    let EXCEPTIONS = new Set(['Dr', 'etc', 'Jr', 'M', 'Mgr', 'p', 'Mr', 'Mrs', 'Ms', 'Mme', 'Mlle', 'Prof', 'Sr', 'St', 'pp', 'Pst', 'Dj', 'Po']);
    if (this.addExcepts) {
      if (Array.isArray(this.addExcepts)) this.addExcepts.map(e => EXCEPTIONS.add(e))
      else EXCEPTIONS.add(this.addExcepts)
    } else if (this.useExceptions) EXCEPTIONS = new Set(this.useExceptions)
    let EXCEPTIONSARR = []
    EXCEPTIONS.forEach(e => EXCEPTIONSARR.push(e))
    if (isCores) {
      const exceptsCoreBefore = '(\\.\\s*|!\\s*|\\?\\s*)?'
      const exceptsCoreAfter = '(\\s*\\.|\\s*\\!|\\s*\\?)'
      const exceptsBuilder = (() => {
        let exceptsBuild = EXCEPTIONSARR.reduce((acc, value) => acc + value + '|', '').slice(0, -1)
        EXCEPTIONSARR = new RegExp(`(?<!([^\\s]))(${exceptsCoreBefore}(${exceptsBuild})${exceptsCoreAfter})`, 'gi') // in the string, 'kingchop.', p is part of exceptions, so we lookbehind for any word behind, so breaking and replacing can be done properly. This means all exceptions most look out for a word behind them. If . or space or nothing is behind, this matches successfully.
      })()
    }
    return EXCEPTIONSARR
  }
  #gravityFn(text, num) {
    let isNowBackToString = false
    if (((typeof num !== 'number') && (typeof num !== 'boolean')) && this.gravity) throw new Error(`\nKINGCHOP ERROR!\nERROR CODE: E01.\nREASON: Invalid Parameter Value.\nCAUSE: You inputed: ${num} as the gravity option of the Kingchop Instance.\nCORRECTION: Required value is true, false, or the number for the degree of percentage to work with.\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`)
    if (num > 100 || num < 0 || num === 100 || num === 0) throw new Error(`\nKINGCHOP ERROR!\nERROR CODE: E01.\nREASON: Invalid Parameter Value.\nCAUSE: You inputed: ${num} as the gravity option of the Kingchop Instance.\nCORRECTION: Required value is true, false, or the number for the degree of percentage to work with. It must not be 0 or lesser, or 100 or greater in value. It must be between, 1...99.\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`)
    if (typeof text === 'string') return { value: text, stat: isNowBackToString } //operations were not done on the text
    //  const len = text.length
    const totalLen = text.reduce((acc, val) => {
      return acc + val.length
    }, 0)
    // const avrTotalLen = totalLen / len
    runner()

    function runner() {
      let i = 0
      while (i < text.length) { //while used because of unstability of text length
        const currValue = text[i]
        const next = nextValueFn(text, i)
        const nextValue = next.value
        const nextIndex = next.index
        if (nextIndex !== undefined) {
          if (i === 0) {
            //first value
            if (thresTest(currValue)) {
              text[0] = currValue + ' ' + nextValue
              text.splice(nextIndex, 1)
              //no incrementing. Since next value has been removed and added to current one
              //we use them as new value, and the next to new value may pass the test, and so on.
              //if fail, we increment and move to next loop
              isNowBackToString = true
            } else i++
          }
          else {
            isNowBackToString = false
            if (thresTest(nextValue)) { //test on nextValue
              text[i] = currValue + ' ' + nextValue //make currValue and nextValue the current value
              text.splice(nextIndex, 1)
              //no incrementing. Since next value has been removed and added to current one
              //we use them as new value, and the next to new value may pass the test, and so on.
              //if fail, we increment and move to nect loop
            } else i++
          }
        } else break
        //for action with last text array value, the prev value to last one
        //will add the last to itself. thereby leaving no last readable value (undefined). We will use nextIndex to check
        //then exit loop. This will handle situations were all values add themselves. leading to 1 string.
        //we will also signal with isNowBackToString if that happens, to say, no operations were done on toSentence input string text
        //cos, it turned back to string again

        function thresTest(value) {
          const choice = typeof num !== 'boolean' ? num : 30
          const scale = Math.log(totalLen + 1); // Balanced scaling factor
          const ratio = ((scale / value.length) * 100) > choice
          return ratio
        }
      }
    }
    return { value: text, stat: isNowBackToString ? false : true } // false here means not a string, which means success.
  }
  #helpProcessInit(text, whoami, args) { //helps in checking param, correcting text, and lowercasing it
    if (!(typeof text === 'string')) throw new Error(`\nKINGCHOP ERROR!\nERROR CODE: E02.\nREASON: The parameter of the method ${whoami}() is invalid.\nCAUSE: You inputed: "${text}" as the parameter of the ${whoami}() method.\nCORRECTION: The ${whoami}() method only accepts a value, a string.\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`)
    if (/^\s*$/.test(text)) throw new Error(`\nKINGCHOP ERROR!\nERROR CODE: E02.\nREASON: The parameter of the method ${whoami}() is invalid.\nCAUSE: The parameter of the ${whoami}() method was an empty string.\nCORRECTION: The ${whoami}() method only accepts a value, a string.\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`)
    if (args.length > 1) throw new Error(`\nKINGCHOP ERROR!\nERROR CODE: E02.\nREASON: The arguments of the method ${whoami}() is invalid.\nCAUSE: The arguments of the ${whoami}() method was more than 1.\nCORRECTION: The ${whoami}() method only accepts a value, a string, not multiple arguments.\nMORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.`)
    if (this.lowcase) text = text.toLowerCase()
    return text
  }
  #returnMan(text, status) { //helps in returning text, changing status and text formats.
    if ([undefined, null].includes(status)) status = false
    if (Array.isArray(text) && !(text.length > 1)) {
      text = text.toString()
      status = false
      //find if text is one value in array, then change text to string and status to false
    }
    return this.returnStatus ? { value: text, status: status } : text
  }
  #returnStatusPass() {
    if (this.returnStatus) return true
    else return false
  }
  #passParaCore(text) {
    text = paraCore(text)
    if (Array.isArray(text)) return { value: text, status: true }
    else return { value: text, status: false }
  }
  #publicMethods(value, whoami) {
    //public extra methods help others, but we use them in kingchop processes.The returnStatus if true, conditions all public methods to return an object, {value, status}. This private method helps us check that and returns the actual value. Value from public method is needed for Kingchop processes not object.
    let result
    if (whoami === 'correctText' && this.correct) result = this.correctText(value)
    else result = value
    if (this.correct && this.returnStatus === true) return result.value //only value from public method is needed
    else return result
  }
  #enclosersStyle() {
    return /\(.+?\)|((^(\'.+?\'))|((?<=\s)\'.+?\'))|\".+?\"|\*.+?\*|\{.+?\}|\<.+?\>|\[.+?\]|((^(\‘.+?\’))|((?<=\s)\‘.+?\’))|\„.+?\„|\“.+?\”|\‹.+?\›|\«.+?\»/g /*' ’ ′ single quotes are specialized so not to do bad on stuffs like, don't, o’ clock*/
    // /\s\([^\)]+\)|\s\'.+\'|\s\".+\"|\s\*.+\*|\s\{.+\}|\s\<.+\>|\s\[.+\]|\s\`.+\`|\s\″.+\″|\s\′.+\′|\s\‘.+\’|\s\„.+\„|\s\“.+\”|\s\‹.+\›|\s\«.+\»/gm //test01 Experiment
  }
  #attachEnc(text, status) {
    if (status === false) return { text: text, status: status } //text here if stat is false means text is still string snd unprocessed.
    text = attachEnclosers(text)
    if (text.length > 1) return { text: text, status: status }
    else return { text: text, status: false } //means array text was pressed back to 1 array value. So status should be false.
  }
}
module.exports = Kingchop
/*
    ✅✅ lowcase: default false 
    ✅✅ addToExceptions: default null: adds more exceptions to the exceptions array after filtering possible duplicates
    ✅✅ useExceptions: default null: use only provided exceptions
    ✅✅ actOnEnclosers: default false: to make match and possibly break in enclosers like (), ''...
    ✅✅ showDelimeters: default true: leaves the delimeters in belonging arrays instead of removing them
    ✅✅ correct: default true: tries to correct the text
    ✅✅ returnStatus: default false: returns an output in object form. {value: 'Whatever was processed', status: true or false (if anything was done or not)
    ✅✅ gravity: default true: uses an algorithm to detect what should be a sentence or not.
    options = {addExceptions: ['co', 'inc', 'ltd', 'org'],  useExceptions: ['org', 'inc', 'ltd'], showDelimeters: false, lowcase: true}
*/

/*
Next Fixes:
toSentence: is not tokenizing properly. Eg: text = '1. Play. 2. Don't write 3. Jump around.'
toWord: find way, so toWord will not leave something like "don't'you" unbroken.
*/
