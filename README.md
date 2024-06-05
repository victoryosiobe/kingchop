[![Latest NPM Version](https://badgen.net/npm/v/kingchop)](https://www.npmjs.org/package/kingchop)
[![NPM Downloads](https://img.shields.io/npm/dt/kingchop.svg?style=flat)](#)
[![NPM Dependents](https://badgen.net/npm/dependents/kingchop)](#)

[![Watchers On GitHub](https://badgen.net/github/watchers/victoryosiobe/kingchop)](#)
[![Contributors On GitHub](https://badgen.net/github/contributors/victoryosiobe/kingchop)](#)
[![License](https://badgen.net/github/license/victoryosiobe/kingchop)](#)
[![Stars On GitHub](https://badgen.net/github/stars/victoryosiobe/kingchop)](#)
[![Issues On GitHub](https://badgen.net/github/issues/victoryosiobe/kingchop)](#)
[![Open Issues](https://badgen.net/github/open-issues/victoryosiobe/kingchop)](#)
[![Closed Issues](https://badgen.net//github/closed-issues/victoryosiobe/kingchop)](#)

[![Language](https://img.shields.io/badge/JavaScript-yellow?style=for-the-badge&logo=JavaScript&logoColor=white)](#)
[![Love Badge](http://ForTheBadge.com/images/badges/built-with-love.svg)](#)
[![Support Via Kofi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/victoryosiobe)

### Quick Links

- [Kingchop ⚔️](#kingchop)
- [Why Even Use Kingchop?](#why-should-i-use-kingchop)
- [How To Use?](#how-to-use)
- [Parameters](#parameters)
  - [Options](#options)
- [Methods](#methods)
- [Error codes](#error-codes)
- [Extras](#extras)
- [Coming Soon](#coming-soon)
- [Thanks](#thanks)
- [Support](#support)
- [Change Log](./CHANGELOG.md)

# **Kingchop**

Kingchop ⚔️ is a JavaScript English based library for tokenizing text (chopping text). It uses vast rules for tokenizing, and you can adjust them easily.

## Why Should I Use Kingchop?

Kingchop is built for **flexibility**, **stability**, **ease** and **simplicity** unlike other libraries.

I too was tired of searching for tokenizing libraries, especially for tokenizing sentences to array, so I have built this library.

With kingchop, urls, ellips like **...**, **..........**, and enclosers like **(), '', ``, ""** are handled properly, and words like **don't**, **couldn’t** are well handled.

Kingchop is also able to handle multiple lines of text (paragraphs), and delimeters like **!?.**. In this text `Anyone??? I just need assistance... .. Okay good!!! !  Hold on tight, let me go get the glue. What a sticky situation!`, if tokenizing to sentence arrays, by default, Kingchop returns,

```
[
    'Anyone??? I just need assistance..... Okay good!!!!',
    'Hold on tight, let me go get the glue.',
    'What a sticky situation!'
]
```

Slightly different? Because, KingChop tries to [correct](#correct) the text.

Kingchop lets users change other settings easily.

How? Through Parameters!

You decide if output is to be in lowcase, or if delimeters like '.!?' should be in the output, or if text inputed is to be corrected, and lots more...

Before you skip on. Kingchop is excellent in ERROR handling. You get versbose errors, with [error codes](#error-codes).

## How To Use?

Firstly, you have to install Kingchop, like this in a cli:

```node.js
npm install kingchop
```

If you use yarn, then:

```node.js
yarn add kingchop
```

If you're experiencing an error, called SYMLINK, especially if you're using Android:

```node.js
yarn add kingchop --no-bin-links
```

To fire up Kingchop after installing in specified directory, you should simply run:

```node.js
const Kingchop = require('kingchop');
const chopper = new Kingchop();
```

**OR**

```node.js
import Kingchop from 'kingchop'
const chopper = new Kingchop();
```

# Parameters

Kingchop is class based, which means you should require or import it as above, then initialize the class as an instance with `const chopper = new Kingchop()`.

**Example:**

```node.js
const string = `Tech! Tech! Tech! Don't you want to become a doctor son? Treat people.....you know? Because, I don't understand these jargons you're writing there. Just go to sleep.`;
const chopper = new Kingchop();
console.log(chopper.toSentence(string)); //results below
/*[
    'Tech! Tech! Tech!',
    "Don't you want to become a doctor son?",
    'Treat people.....you know?',
    "Because, I don't understand these jargons you're writing there.",
    'Just go to sleep.'
  ]*/
```

Doing just that, you use the default settings of Kingchop.

For options or settings change, you initialize with a parameter, called options, which is an object.

# Options

**The kingchop class takes in only a parameter, an object.**

```node.js
//after importing or requiring Kingchop

const chopper = new Kingchop({...});
```

The object can take in multiple options, or settings.

```node.js
//after importing or requiring Kingchop, and preparing your string

const chopper = new Kingchop({lowcase: true, addToExceptions: ['org', 'inc', 'co'] ...});
```

**Below are the default settings, with purposes, usage, accepted values and examples:**

### **lowcase**

**Default**: false.

**Purpose**: To change the input to lowercase text, resulting in outputting in lowcase format.

**Value**: It only accepts 2 types of value, true or false. With false, no lowcasing is done.

**Usage**:

```node.js
//after importing or requiring kingchop.

const string = `Do you know about KINGCHOP? And do you know what it can do?`
const chopper = new Kingchop({lowcase: true});
console.log(chopper.toSentence(string)); //[ 'do you know about kingchop?', 'and do you know what it can do?' ]

const chopper2 = new Kingchop({lowcase: false});
console.log(chopper2.toSentence(string)); //[ 'Do you know about KINGCHOP?', 'And do you know what it can do?' ]

```

---

### **addToExceptions**

**Default**: null.

**Purpose**: Exceptions are words, or abrevations that ends or begin with delimeters like '!?.'. This option adds more exceptions to the existing exceptions after filtering possible duplicates.

**Example**: in the string, 'Prof. Victory Osiobe', Prof there, is in the existing exceptions list, but what they do is that they offset the rules, by ignoring them and the delimeters surrounding them, helping to not break by the delimeters that starts or follow them.

**More**: here are the list of existing exceptions, `['Dr', 'etc', 'Jr', 'M', 'Mgr', 'Mr', 'Mrs', 'Ms', 'Mme', 'Mlle', 'Prof', 'Sr', 'St', 'p', 'pp', 'pst', 'dj', 'po']`. There's no need to add the delimeters with them, as Kingchop takes care of that. For more coverage, they are set to case insensitive.

**Value**: it only accepts a string or an array of exceptions, with null, it fails.

**Usage**:

```node.js
//after importing or requiring kingchop.
let string = `You should use inc. instead of co. on that website. The one that has .org domain. Then you inform Dr. Jarvis, Prof. Einstein, and Mr. Telsa about it.`;
const chopper = new Kingchop({addToExceptions: ['org', 'inc', 'co']});
console.log(chopper.toSentence(string)); //results below
/*[
  'You should use inc. instead of co. on that website.',
  'The one that has .org domain.',
  'Then you inform Dr. Jarvis, Prof. Einstein, and Mr. Telsa, about it.'
]*/
```

**Note**: this just adds more exceptions to existing exceptions, it doesn't turn off the use of existing exceptions.

---

### **useExceptions**

**Default**: null.

**Purpose**: use only provided exceptions (no addition to existing exceptions).

**Value**: it only accepts a string or an array of exceptions, with null, it fails.

**Usage**:

```node.js
//after importing or requiring kingchop.

let string = `You should use inc. instead of co. on that website. The one that has .org domain. Then you inform Dr. Jarvis, Prof. Einstein, and Mr Telsa, about it.`;
const chopper = new Kingchop({useExceptions: ['org', 'inc', 'co']});
console.log(chopper.toSentence(string)); // results below
/*[
  'You should use inc. instead of co. on that website.',
  'The one that has .org domain.',
  'Then you inform Dr. Jarvis, Prof.',
  'Einstein, and Mr. Telsa about it.'
]*/
```

**Note**: the combination you still see is as result of the default [gravity](#gravity) option.

This option just uses provided exceptions. **You can totally stop the use of existing exceptions, by using null for this option.**

---

### **actOnEnclosers**

**Default**: false.

**Purpose**: to make match and possibly break into arrays in enclosers like (), [], {}, <>.

**More**: Kingchop uses set of rules to put strings into array form, but with this method, you may want the matches to be included within enclosers like brackets.

**Value**: it only accepts 2 types of value, true or false. With false, no match, chops or seperations happen within enclosers in results. With true, this causes matches which succeed on other text to succeed within enclosers.

**Usage**:

```node.js
//after importing or requiring kingchop.

const string =`I feel it's harder to convert DC to AC, (through a standard inverter. Unlike AC to DC that requires diodes and capacitors) Oh well, I need to rest from these eletronics.`
const chopper = new Kingchop({actOnEnclosers: false});
console.log(chopper.toSentence(string)); //"I feel it's harder to convert DC to AC, (through an standard inverter. Unlike AC to DC that requires diodes and capacitors) Oh well, I need to rest from these eletronics."

const chopper2 = new Kingchop({actOnEnclosers: true});
console.log(chopper2.toSentence(string)); //results below
/*[
  "I feel it's harder to convert DC to AC, (through a standard inverter.",""
  'Unlike AC to DC that requires diodes and capacitors) Oh well, I need to rest from these eletronics.'
]*/

```

**Note**: it's difficult to detect enclosers like `"", ''`, which starts and ends with same character. `“”` is detected properly, but `‘’` which is multipurpose is an extra layer of difficulty, because it can be used as quotes, used to indicate shorten words, like: `don’t, ol’, rock ’n’ roll`. This creates a lot of imbalances.

As of the **Aurora, v1.1.0** update, the extraction function built at **v1.0.6**, for enclosers of diffrent opening and closing characters (safe-enclosers), like **(), [], {}**, has been utilized.

Due to this update, Kingchop can handle nests of safe-enclosers detected. However, this multipurpose quotes and same char enclosers, **‘’, '', ""**, remain a problem.

I made a decision to only detect safe-enclosers, and this function would revert to default method, if imbalances in the safe-enclosers are found.

The issue where enclosers of same characters (for start and end, like '', "", ``) can't be accurately detected, and may not be resolved. No function has been implemented yet.

---

### **showDelimeters**

**Default**: true.

**Purpose**: Normally, in other libraries, the array is formed by using delimeters, like '!?.', so those delimeters don't make it in the results. Well, this option if true, leaves the delimeters, instead of removing or using them.

**Value**: it only accepts 2 types of value, true or false. With true as default, it leaves the delimeters. With false, it uses the delimeters, hence, removing them.

**Usage**:

```node.js
//after importing or requiring Kingchop.
const string = `You're a great progra!mmer. You don't have to feel it!!`;
const chopper = new Kingchop({showDelimeters: false});
console.log(chopper.toSentence(string)); //[ "You're a great progra!mmer", "You don't have to feel it" ]

const chopper2 = new Kingchop({showDelimeters: true});
console.log(chopper2.toSentence(string)); //[ "You're a great progra!mmer.", "You don't have to feel it!!" ]
```

**Note**: this is possible using identifiers, so we act on them, not the text itself, since it is possible for identifiers to be inputed, an advanced escaper function has been built to escape and unescape these identifiers found in text, so nothing is confused.

---

### **correct**

**Default**: true.

**Purpose**: With this, strings like:

```
hello            ! How are you  ?       ?
```

OR

```
He has the.          domain.
```

Will be transformed to:

```
hello! How are you??
```

OR

```
He has the. domain.
```

It corrects spaces from delimeters.

**Value**: it only accepts 2 types of value, true or false. With true as default, Kingchop tries to correct the text. With false, text remains as inputed.

**More**: You may need to use this elsewhere, like, just to correct text without Kingchop other functions. If so, check [Extras](#extras) section.

**Example Of Usage**:

```node.js
//after importing or requiring Kingchop.

const string = `You're a great programmer          . You don't have to feel it     !            !`;
const chopper = new Kingchop({correct: false});
console.log(chopper.toSentence(string)); //["You're a great programmer          .", "You don't have to feel it     !            !"];

const chopper2 = new Kingchop({correct: true});
console.log(chopper2.toSentence(string)); //["You're a great programmer .", "You don't have to feel it!!"]
```

---

### **returnStatus**

**Default**: false.

**Purpose**: when text is passed in, with standard methods, you may want to know if any operations were done.

**More**: it returns the output of Kingchop in object form. It only returns 2 properties in object form: value, and status. `{value: 'is whatever was processed by Kingchop', status: true or false (if anything was done, 'true', if not, 'false')}`.

**Value**: it only accepts 2 types of value, true or false. With true, Kingchop returns an object with 2 properties, value and status. With false, only processed text is returned.

**Example Of Usage**:

```node.js
//after importing or requiring kingchop.

const string = `Kingchop is very fast. It can render results in an average of less than 3 milli seconds.`;
const chopper = new Kingchop({returnStatus: true});
const refinedText = chopper.toSentence(string);
console.log(refinedText); //results below
/*{
  value: [
    'Kingchop is very fast.',
    'It can render results in an average of less than 3 milli seconds.'
  ],
  status: true
}*/

console.log(refinedText.value); //results below
/*[
  'Kingchop is very fast.',
  'It can render results in an average of less than 3 milli seconds.'
]*/

console.log(refinedText.status); //true

const chopper2 = new Kingchop({returnStatus: false});
console.log(chopper2.toSentence(string));- //results below
/*[
  'Kingchop is very fast.',
  'It can render results in an average of less than 3 milli seconds.'
]*/
```

---

### **gravity**

**Default**: true, 30.

**Purpose**: this option tries to make a “close guess” on what's to be a sentence with the length of the input. It is meant for `toSentence()` method.

**More**: if true, this option will use the length of the total string passed in, to find a minimum scale length to use, to decide what length of sentence is actually a sentence. And after all chops into arrays, it checks each of them to find if any is less than or equal to the minimum scale length, if there are, it joins that array with previous array.

With true as it is by default, it tries to “guess” if an array is a sentence or not, using Math.log as a measure for slow scale change.

Math.log helps reduces the rate at which the scale increases, making it easier to get almost same scale on small text and large ones. In other words, instead of using percentage to measure, we do that but with Math.log that slows the rate at which the scale to text length changes.

For example, scale maybe 20 out of 100 on small text and it says, array values with 30 chars or less should not be a sentence, then that scale can reach 90 out of 100 when faced with large text, meaning, longer sentences would be treated as "not a sentence", which is false.

Math.log drops that scale change down. With the above example, the large text scale may reach 25 out of 100.

With false, this fails.

With numbers which indicates true, you can change the text gravity to taste. Default is 30, and the allowed values of number, ranges from > 0 to < 100. Outside that, you'll get an error.

The higher the number, the less sensitive to small sentences. The lower, the more sensitive to small sentences.

**Note**: if status is false, like with returnStatus, or if no match, or chops or separations into array is done, this will fail. `gravity` fails if showDelimeters is false. Also, treat the number value, like a volume value.

**Value**: it only accepts 3 types of value, true or false or numbers of range > 0 to < 100.

**Example of Usage**:

```node.js
//after importing or requiring Kingchop.

const string = `Okay. Okay. I understood what you said. It is just that I can't do it right now. I promise I will attend to it.`;
const chopper = new Kingchop({gravity: false});
console.log(chopper.toSentence(string)); // results below
/*['Okay.',
   'Okay.',
   'I understood what you said.',
   "It is just that I can't do it right now.",
   'I promise I will attend to it.'
  ]
*/
const chopper2 = new Kingchop({gravity: true});
console.log(chopper2.toSentence(string)); //results below
/*['Okay. Okay. I understood what you said.',
  "It is just that I can't do it right now.",
  'I promise I will attend to it.']
*/
const chopper3 = new Kingchop({gravity: 10});
console.log(chopper3.toSentence(string)); //results below
/*[
  "Okay. Okay. I understood what you said. It is just that I can't do it right now.",
  'I promise I will attend to it.'
  ]
*/
const chopper4 = new Kingchop({gravity: 99});
console.log(chopper4.toSentence(string)); //results below
/*['Okay.',
   'Okay.',
   'I understood what you said.',
   "It is just that I can't do it right now.",
   'I promise I will attend to it.'
]
*/
```

---

**Phew! That was a long one. But I've got a little more. Let's talk on the available methods.**

# Methods

**All methods listed, takes in 1 parameter, a string. Anything other than that, expect an error.**

**They're all designed to handle paragraphs, so don't worry.**

#### **`toSentence(string)`**

This method is one that chops strings into arrays, sentence arrays. It uses those parameters for initializing, to offsets rules guiding it. It's a standard method of **kingchop**.

**Example Of Usage**:

```node.js
//after importing or requiring Kingchop, and preparing your string.
const string = `Okay. Okay. I understood what you said.
                It is just that I can't do it right now. I promise I will attend to it.`
const chopper = new Kingchop();
console.log(chopper.toSentence(string));
/*[
    'Okay. Okay. I understood what you said.',
    "It is just that I can't do it right now.",
    'I promise I will attend to it.'
  ]*/
```

**Note**:

All the kingchop option applies to the `toSentence()` method

---

#### **`toParagraph(string)`**

This method is one that chops text into detected paragraphs arrays. It uses those parameters for initializing, to offsets rules guiding it. It's a standard method of **kingchop**.

**Example Of Usage**:

```node.js
//after importing or requiring Kingchop.
const string = `Do you know that the toWord() method was launched at version 1.0.4 of the Kingchop library?

                No I didn't.

                Go check it out! Saves me a lotta stress.

                Alright, but have all the coming soon been released?

                Na! Not so. Some of them have been released, and more have been added.

                Cool!`
const chopper = new Kingchop();
console.log(chopper.toParagraph(string));
/*[
  'Do you know that the toWord() method was launched at version 1.0.4 of the Kingchop library?',
  "No I didn't.",
  'Go check it out! Saves me a lotta stress.',
  'Alright, but have all the coming soon been released?',
  'Na! Not so. Some of them have been released, and more have been added.',
  'Cool!'
]*/
```

**Note**:

The following options do not apply to the `toParagraph()` method:

- addToExceptions
- useExceptions
- actOnEnclosers
- showDelimeters

---

#### **`toWord(string)`**

This method is one that chops text into words, all in arrays. It uses those parameters for initializing, to offsets rules guiding it. It's a standard method of **kingchop**.

`toWord()` is able to return words like don't, doesn't, and anything with single quotes, together. This is one of the most unconsidered thing in other libraries.

**Example Of Usage**:

```node.js
//after importing or requiring Kingchop.
const string = `Don't you love the cake?
                No, I honestly dislike cakes.
                But, dude, I stayed all night making this.
                Hehe, I won't pity, you could eat ’em all if you wish. Because right now, I feel like sticking some explosives in it.`
const chopper = new Kingchop();
console.log(chopper.toWord(string));
/*[
  "Don't",   'you',        'love',    'the',
  'cake',    '?',          'No',      ',',
  'I',       'honestly',   'dislike', 'cakes',
  '.',       'But',        ',',       'dude',
  ',',       'i',          'stayed',  'all',
  'night',   'making',     'this',    '.',
  'Hehe',    ',',          'I',       "won't",
  'pity',    ',',          'you',     'could',
  'eat',     '’',          'em',      'all',
  'if',      'you',        'wish',    '.',
  'Because', 'right',      'now',     ',',
  'i',       'feel',       'like',    'sticking',
  'some',    'explosives', 'in',      'it',
  '.'
]*/
```

**Note**:

The following options do not apply to the `toWord()` method:

- addToExceptions
- useExceptions
- actOnEnclosers
- showDelimeters
- correct
- gravity

The rest options work well for it. But the **showDelimeters** option which is by default true, causes all non-words to stay in results. If set to false, it removes all non-words only for the `toWord()` method, except single quotes that gives words like, don't, doesn’t... meaning.

Apart from numbers, between words single quotes, like (' or ’), other characters even in sequence, are chopped characters by characters.

---

#### **`toSubSentence(string)`**

This method chops text into sub sentences arrays. Sub sentences delimeters are ':,;', some others, and sentences delimeters too are used. Yes, enclosers are counted as sub sentences. It will use those parameters for initializing, to offsets rules guiding it. It's going to be a standard method of **kingchop**.

**Example Of Usage**:

```node.js
//after importing or requiring Kingchop.
const string = `I have ordered Dr. gamma to pull over right away, He's going to spread the virus (zombie virus), Hurry!`
const chopper = new Kingchop();
console.log(chopper.toSubSentence(string));
/*[
  'I have ordered Dr. gamma to pull over right away,',
  "He's going to spread the virus",
  '(zombie virus),',
  'Hurry!'
]*/
```

**Note**:

The following option do not apply to the `toSubSentence()` method:

- gravity

# Error Codes

Kingchop returns verbose errors when things didn't go well. You get error codes, reasons for error, correction to errors, and a link to this document for more information.

**Before continuing, please, read the documentation to know the right things to do.**

**Example**:

```node.js
const Kingchop = require('kingchop');
let string = `Kingchop demo!`;
const chopper = new Kingchop({returnStatus: 'wrong value'});
console.log(chopper.toSentence(string));
//When you run the code above. You would get this.

Error:
KINGCHOP ERROR!
ERROR CODE: E01.
REASON: Invalid Parameter Value.
CAUSE: You inputed: "wrong value" in the returnStatus options of the Kingchop Instance.
CORRECTION: Required value is true or false.
MORE INFO: For more information, check the documentation of Kingchop at: https://github.com/victoryosiobe/kingchop#README.md.
```

Now, lets hit some of the error codes.

**E01**: Indicates an option value of the kingchop initializer or instance is not appropriate.

**E02**: Indicates argument(s) of a method was invalid, and numbers of arguments required is exceeded.

**E03**: Indicates there are unrequired number of arguments for the Kingchop initializer or instance.

# Extras

#### **`correctText(string)` method**

The `correctText(string)` method, takes in a string as a parameter and tries to correct the string passed in, using set rules, but not modifying context or words directly.

It removes unnecessary spaces between words and delimeters, and delimeters and delimeters.

It is being advancing on every updates.

**For example**: It can turn this string `how would you do that                .par.     .    !     !`, to `how would you do that .par..!!`

**Example of Usage**:

```node.js
const Kingchop = require('kingchop');
const string = `how would you do that                .par.     .    !     !`;
const chopper = new Kingchop();
console.log(chopper.correctText(string)); // 'how would you do that .par..!!'
```

**More Info**: If you make the `returnStatus` option true, correctText will return output in the `returnStatus` format. The method is meant for the processes of Kingchop, but you can use it if you need to.

# Coming Soon

1. **Sub Word Tokenization.**
2. **Word Ranking.**
3. **Sentence Ranking.**

# Thanks

**Thank y'all for your support and majorly, other open-sources out there.**

# Support

**You could support this project via [![Kofi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/victoryosiobe)**
