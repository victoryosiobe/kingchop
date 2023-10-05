### Quick Links

- [Kingchop ⚔️](#kingchop)
- [Why Kingchop?](#why-kingchop)
- [How To Use?](#how-to-use)
- [Parameters](#parameters)
  - [Options](#options)
- [Methods](#methods)
- [Error codes](#error-codes)
- [Extras](#extras)
- [Coming Soon](#coming-soon)
- [Thanks](#thanks)
- [Support](#support)


# **Kingchop**

Kingchop ⚔️ is a node.js English based library used for tokenizing text (chopping text). It uses rules for tokenizing, and you can adjust these rules as you please.

## Why Kingchop?

Kingchop is built for **flexibility**, **stability**, **ease** and **simplicity** unlike other libraries.

I too was tired of searching for tokenizing libraries, especially for tokenizing sentences to array, so I built this library.

With kingchop, urls, ellips like **...**, **..........**, and enclosers like **(), '', ``, ""** are handled properly.

Kingchop is also able to handle multiple lines of text, and delimeters like '!?.'. In this text `'Anyone??? I just need assistance... .. Okay good!!! !'`, if tokenizing to sentence arrays, by default, Kingchop returns `[ 'Anyone???', 'I just need assistance.....', 'Okay good!!!!' ]`. Slightly different? Because, KingChop tries to [correct](#correct) the text.

Kingchop lets users change other settings easily.

How? Through Parameters!

You decide if output is to be in lowcase, or if delimeters like '.!?' should be in the output, or if text inputed is to be corrected, and lots more...

Before you skip on. Kingchop is excellent in ERROR handling. You get versbose errors, with [error codes](#error-codes).

## How To Use?

Firstly, you have to install Kingchop, like this in a cli:

``` node.js
npm install kingchop
```

If you use yarn, then:

``` node.js
yarn add kingchop
```

If you're experiencing an error, called SYMLINK, especially if you're using Android:

``` node.js
yarn add kingchop --no-bin-links
```

To fire up Kingchop after installing in specified directory, you should simply run:

``` node.js
const Kingchop = require('kingchop');
const chopper = new Kingchop();
```

**OR**

``` node.js
import Kingchop from './the-folder-of-kingchop'
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
    'Tech!',
    'Tech!',
    'Tech!',
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

``` node.js
//after importing or requiring Kingchop

const chopper = new Kingchop({...});
```

The object can take in multiple options, or settings.

``` node.js
//after importing or requiring Kingchop, and preparing your string

const chopper = new Kingchop({lowcase: true, addToExceptions: ['org', 'inc', 'co'] ...});
```

Here are the default settings, with purposes, usage, values and examples:

#####  **lowcase** 

**Default**: false.

**Purpose**: To change the input to lowercase text, resulting in outputting in lowcase format.

**Value**: It only accepts 2 values, true or false. With false, no lowcasing is done.

**Usage**: 

``` node.js
//after importing or requiring kingchop.

const string = `Do you know about KINGCHOP? And do you know what it can do?`
const chopper = new Kingchop({lowcase: true});
console.log(chopper.toSentence(string)); //[ 'do you know about kingchop?', 'and do you know what it can do?' ]

const chopper2 = new Kingchop({lowcase: false});
console.log(chopper2.toSentence(string)); //[ 'Do you know about KINGCHOP?', 'And do you know what it can do?' ]

```

---
##### **addToExceptions** 

**Default**: null. 

**Purpose**: Exceptions are words, or abrevations that ends or begin with delimiters like '!?.'. This option adds more exceptions to the existing exceptions after filtering possible duplicates.
 
**Example**: in the string, 'Prof. Victory Osiobe', Prof there, is in the existing exceptions list, but what they do is that they offset the rules, by ignoring them and the delimiters surrounding them, helping to not break by the delimiters that starts or follow them.

**More**: here are the list of existing exceptions, `['Dr', 'etc', 'Jr', 'M', 'Mgr', 'Mr', 'Mrs', 'Ms', 'Mme', 'Mlle', 'Prof', 'Sr', 'St', 'p', 'pp', 'pst', 'dj', 'po']`. There's no need to add the delimeters with them, as Kingchop takes care of that. For more coverage, they are set to case insensitive.

**Value**: it only accepts a string or an array of exceptions, with null, it fails.

**Usage**: 

``` node.js
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

---
##### **useExceptions** 

**Default**: null.

**Purpose**: use only provided exceptions (no addition to existing exceptions).

**Value**: it only accepts a string or an array of exceptions, with null, it fails.

**Usage**: 

``` node.js
//after importing or requiring kingchop.

let string = `You should use inc. instead of co. on that website. The one that has .org domain. Then you inform Dr. Jarvis, Prof. Einstein, and Mr Telsa, about it.`;
const chopper = new Kingchop({useExceptions: ['org', 'inc', 'co']});
console.log(chopper.toSentence(string)); // results below
/*[
  'You should use inc. instead of co. on that website.',
  'The one that has .org domain.',
  'Then you inform Dr.',
  'Jarvis, Prof.',
  'Einstein, and Mr.',
  'Telsa, about it.'
]*/
```

---
#####  **actOnEnclosers** 

**Default**: false.

**Purpose**: to make match and possibly break into arrays in enclosers like (), '', "", ``.

**More**: Kingchop uses set of rules to put strings into array form, but with this method, you may want the matches to be included within enclosers like brackets.

**Value**: it only accepts 2 values, true or false. With false, no match, breaks or seperations happen within enclosers in results. With true, this causes matches which succeed on other text to succeed within enclosers.

**Usage**: 

``` node.js
//after importing or requiring kingchop.

const string = `The site to go is www.github.com/victoryosiobe/kingchop (but if you want to read the README.md, I don't know. Wait, I do, just find that here: www.github.com/victoryosiobe/kingchop#README.md), that's where to get more info on 'Kingchop the text chopper! ⚔️'. Is there anything else you need sir?`;
const chopper = new Kingchop({actOnEnclosers: false});
console.log(chopper.toSentence(string)); //results below
/*[
  "The site to go is www.github.com/victoryosiobe/kingchop (but if you want to read the README.md, I don't know. Wait, I do, just find that here: www.github.com/victoryosiobe/kingchop#README.md), that's where to get more info on 'Kingchop the text chopper! ⚔️'.",
  'Is there anything else you need sir?'
 ]*/
  
const chopper2 = new Kingchop({actOnEnclosers: true});
console.log(chopper2.toSentence(string)); //results below
/*[
  "The site to go is www.github.com/victoryosiobe/kingchop (but if you want to read the README.md, I don't know.",
  "Wait, I do, just find that here: www.github.com/victoryosiobe/kingchop#README.md), that's where to get more info on 'Kingchop the text chopper!",
  "⚔️'.",
  'Is there anything else you need sir?'
]*/

```

---
#####  **showDelimeters** 

**Default**: true.

**Purpose**: Normally, in other libraries, the array is formed by using delimiters, like '!?.', so those delimiters don't make it in the results. Well, this option if true, leaves the delimeters, instead of removing or using them.

**Value**: it only accepts 2 values, true or false. With true as default, it leaves the delimeters. With false, it uses the delimeters, hence, removing them.

**Usage**:

``` node.js
//after importing or requiring Kingchop.
const string = `You're a great progra!mmer. You don't have to feel it!!`;
const chopper = new Kingchop({showDelimeters: false});
console.log(chopper.toSentence(string)); //[ "You're a great progra!mmer", "You don't have to feel it" ]

const chopper2 = new Kingchop({showDelimeters: true});
console.log(chopper2.toSentence(string)); //[ "You're a great progra!mmer.", "You don't have to feel it!!" ]
```
---
#####  **correct** 

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

**Value**: it only accepts 2 values, true or false. With true as default, Kingchop tries to correct the text. With false, text remains as inputed.

**More**: You may need to use this elsewhere, like, just to correct text without Kingchop other functions. If so, check [Extras](#extras) section.

**Usage**:

``` node.js
//after importing or requiring Kingchop.

const string = 'You're a great programmer          . You don't have to feel it     !            !';
const chopper = new Kingchop({correct: false});
console.log(chopper.toSentence(string)); //["You're a great programmer          .", "You don't have to feel it     !            !"];

const chopper2 = new Kingchop({correct: true});
console.log(chopper2.toSentence(string)); //["You're a great programmer."", "You don't have to feel it!!"]
```
---
##### **returnStatus** 

**Default**: false.

**Purpose**: when text is passed in, with standard methods, you may want to know if any seperations, or breaks, or splits were done. 

**More**: it returns the output of Kingchop in object form. It only returns 2 properties in object form: value, and status. `{value: 'is whatever was processed by Kingchop', status: true or false (if anything was done, 'true', if not, 'false')}`.

**Value**: it only accepts 2 values, true or false. With true, Kingchop returns an object with 2 properties, value and status. With false, only processed text is returned.

**Usage**:

``` node.js
//after importing or requiring kingchop.

const string = `Kingchop is very fast. It can render results in an average of less than 3 milli seconds.`;
const chopper = new Kingchop({returnStatus: true});
const refinedText = chopper.toSentence(string);
console.log(refinedText); //results below
/*{[
  'Kingchop is very fast.',
  'It can render results in an average of less than 3 milli seconds.'
], true}*/

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
##### **showNonWords**

**Default**: true.

**Purpose**: this option is meant for the `toWord()` method. It lets result contain non-word characters.

**More**: if true, this option will let the non-words remain in result, if false, it removes all non-words in result, except single quotes that gives words like, don't, doesn't... meaning.

**Value**: it only accepts 2 values, true or false.

**Usage**: 

``` node.js
//after importing or requiring Kingchop.

const string = `You're a great programmer. You don't have to feel it!!`;
const chopper = new Kingchop({showNonWords: false});
console.log(chopper.toWord(string)); //["You're","a","great","programmer","You","don't","have","to","feel","it"]

const chopper2 = new Kingchop({showNonWords: true});
console.log(chopper2.toWord(string)); //["You're","a","great","programmer",".","You","don't","have","to","feel","it","!","!"]
```
---
##### **levelUp**

**Default**: true, 30.

**Purpose**: this option tries to make a good guess on what's to be a sentence with the length of the input. It is meant for `toSentence()` method.

**More**: if true, this option will use the length of the total string passed in, to find the minimum % length to use to decide what length of sentence is a sentence. And after all breaks into arrays, it checks each of them to find if any is less than or equal to the minimum %, if there are, it joins that array with previous array. 

With true as it is by default, it tries to guess if an array is a sentence or not, using Math.log as a balancer for scales.

Math.log helps reduces the rate at which the scale increases, making it easier to get almost same scale on small text and large ones. In other words, instead of using percentage to measure, we do that but with Math.log that slows the rate at which the scale changes.

For example, scale maybe 20 out of 100 on small text and it says, array values with 30 chars or less should not be a sentence, then that scale can reach 90 out of 100 when faced with large text. Meaning, longer sentences would be treated as "not a sentence".

Math.log slows that scale down. With the above example, the large text scale may reach 25% out of 100. 

With false, this fails.

With numbers which indicates true, you can change the scale to taste. Default is 30, and the allowed values of number, ranges from > 0 to < 100. Outside that, you'll get an error.

The higher the number, the less sensitive to small sentences. The lower, the more sensitive to small sentences.

**Note**: if status is false, like with returnStatus, or if no match, or breaks or separations into array is done, this will fail, causing it not to be useful. Also, treat the number value, like a volume value.

**Value**: it only accepts 3 values, true or false or numbers of range > 0 to < 100.

**Example of Usage**:
``` node.js
//after importing or requiring Kingchop.

const string = `Okay. Okay. I understood what you said. It is just that I can't do it right now. I promise I will attend to it.`;
const chopper = new Kingchop({levelUp: false});
console.log(chopper.toSentence(string)); // results below
/*['Okay.',
   'Okay.',
   'I understood what you said.',
   "It is just that I can't do it right now.",
   'I promise I will attend to it.'
  ]
*/
const chopper2 = new Kingchop({levelUp: true});
console.log(chopper2.toSentence(string)); //results below 
/*['Okay. Okay. I understood what you said.',
  "It is just that I can't do it right now.",
  'I promise I will attend to it.']
*/
const chopper3 = new Kingchop({levelUp: 10});
console.log(chopper3.toSentence(string)); //results below 
/*[
  "Okay. Okay. I understood what you said. It is just that I can't do it right now.",
  'I promise I will attend to it.'
  ]
*/
const chopper4 = new Kingchop({levelUp: 99});
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

#### **`toSentence(string)`**

This method is one that breaks text into arrays, sentence arrays. It uses those parameters for initializing, to offsets rules guiding it. It's a standard method of **kingchop**.

**Example Of Usage**:

``` node.js
//after importing or requiring Kingchop, and preparing your string.

const chopper = new Kingchop();
console.log(chopper.toSentence(string)); //returns arrays of sentences.
```

**Note**:

The following option do not apply to the `toWord()` method:

- showNonWords

---
#### **`toParagraph(string)`** **coming soon*

This method is one that breaks text into detected paragraphs arrays. It uses those parameters for initializing, to offsets rules guiding it. It's a standard method of **kingchop**.

**Example Of Usage**:

```node.js
//after importing or requiring Kingchop.
const string = `Do you know that the toWord() method was launched at version 1.0.4 of the Kingchop library?
                
                No I didn't.
                
                Okay, go check it out!
                Alright, but have all the coming soon been released?
                
                Na! Not yet. But some of them have been released
                
                Cool!`
const chopper = new Kingchop();
console.log(chopper.toParagraph(string)); //["Do you know that the toWord() method was launched at version 1.0.4 of the Kingchop library?","No I didn't.","Okay, go check it out!","Alright, but have all the coming soon been released?","Na! Not yet. But some of them have been released","Cool!"]
```
**Note**:

The following options do not apply to the `toParagraph()` method:

- addToExceptions
- useExceptions
- actOnEnclosers
- showDelimeters
- showNonWords

---
#### **`toWord(string)`**

This method is one that breaks text into words, all in arrays. It uses those parameters for initializing, to offsets rules guiding it. It's a standard method of **kingchop**.

`toWord()` is able to return words like don't, doesn't, and anything with single quotes, together. This is one of the most unconsidered thing in other libraries.

**Example Of Usage**:

```node.js
//after importing or requiring Kingchop.
const string = `Do you know that the toWord() method was launched at version 1.0.4 of the Kingchop library? No I didn't.`
const chopper = new Kingchop();
console.log(chopper.toWord(string)); //["Do","you","know","that","the","toWord","(",")","method","was","launched","at","version","1",".0",".4","of","the","Kingchop","library","?","No","I","didn't","."]
```
**Note**:

The following options do not apply to the `toWord()` method:

- addToExceptions
- useExceptions
- actOnEnclosers
- showDelimeters
- correct
- levelUp

The rest options work well for it. But the **showNonWords** option which is by default true, causes all non-words to stay in results. If set to false, it removes all non-words only for the `toWord()` method, except single quotes that gives words like, don't, doesn't... meaning.

**Open Question**: should this method handle numbers with periods too? I don't really like seeing this `"1", ".0", ".4"` in the results from the **Example Of Usage**. Should they be together? But they're not words you know? 😅

---

#### **`toSubSentence(string)`** **coming soon*

This method is one that breaks text into sub sentences arrays. Sub sentences delimeters will be ':,;', some others, and sentences delimeters too will be used. Yes, enclosers are counted as sub sentences. It will use those parameters for initializing, to offsets rules guiding it. It's going to be a standard method of **kingchop**.

**Note**:

The following option do not apply to the `toSubSentence()` method:

- showNonWords


# Error Codes
Kingchop returns verbose errors when things didn't go well. You get error codes, reasons for error, correction to errors, and a link to this document for more information.

**Before continuing, please, read the documentation to know the right things to do.**

**Example**:

``` node.js
const Kingchop = require('kingchop');
let string = `Kingchop demo!`
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

**E01**: Indicates an option value that isn't appropriate.

**E02**: Indicates parameter of a method was invalid.

**E03**: Indicates error happened within the library causing it to fail.

**E04**: Indicates an unsupported parameter or method instated by maintainers of this library.

# Extras

#### **`correctText(string)` method**
The `correctText(string)` method, takes in a string as a parameter and tries to correct the string passed in.

It removes unnecessary spaces between words and delimiters, and delimeters and delimeters.

**For example**: It can turn this string 'hi ! but ? them   !  !   !', to 'hi! but? them!!!'.

**Example of Usage**:

``` node.js
const Kingchop = require('kingchop');
const string = `hi ! but ? them   !    !   !`;
const chopper = new Kingchop();
console.log(chopper.correctText(string), 'corrected text with the Kingchop library');
```

**More Info**: If you make the `returnStatus` option true, correctText will return output in the `returnStatus` format. The method is meant for the processes of Kingchop, but you can use it if you need to.

# Coming Soon
1. **Compatibility with browsers, meaning, you can use it for frontend development, not just backend alone.**
2. **Sub Sentence Tokenization.**
3. **The python version of Kingchop ⚔️.**

# Thanks

**Thanks to the talisman library that I got some data from, to work on this.**

**Thank y'all out there for your support and open-sources.**

# Support

[Support this project via Kofi](https://ko-fi.com/victoryosiobe)
