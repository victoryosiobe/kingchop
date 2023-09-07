### Quick Links
- [Kingchop](#kingchop)
- [Why Kingchop?](#whyKingChop)
- [How To Use?](#howToUse)

- [Parameters](#parameters)
  - [Options](#options)
- [Extras](#extra)
- [Coming Soon](#comingSoon)
- [Thanks](#thanks)
- [Support](#support)


# **Kingchop ⚔️** {#kingchop}

Kingchop is a node.js English based library used for tokenizing text (chopping text). It uses rules for tokenizing, and you can adjust these rules as you please.

## Why Kingchop? {#whyKingChop}

Kingchop is built for **flexibility**, **stability**, **ease** and **simplicity** unlike other libraries.
I too was tired of searching for tokenizing libraries, especially for tokenizing sentences to array, so I built this library.

With kingchop, urls, ellips like **...**, **..........**, and enclosers like **(), '', ``, ""** are handled properly.

Kingchop is also able to handle multiple delimeters like '!?.', like in this text `'Anyone??? I just need assistance... .. Okay good!!! !'`, if tokenizing to sentence arrays, by default, Kingchop returns `[ 'Anyone???', 'I just need assistance.....', 'Okay good!!!!' ]`. Slightly different? Because, KingChop tries to correct the text.

Kingchop lets users change other settings easily. How? Through Parameters!

You decide if output is to be in lowcase, or if delimeters like '.!?' should be in the output, or if text inputed is to be corrected, and lots more...
## How To Use? {#howToUse}

Firstly, you have to install Kingchop, like this in a cli:
``` node.js
npm install kingchop
```
If you use yarn, then:
``` node.js
yarn add kingchop
```
If you're experiencing an error, called SYMLINK:
``` node.js
yarn add kingchop --no-bin-links
```
To fire up Kingchop after install in specified directory, you should simply run:
``` node.js
const Kingchop = require('kingchop');
const chopper = new Kingchop();
```

**OR**

``` node.js
import Kingchop from 'kingchop'
const chopper = new Kingchop();
```
# Parameters {#parameters}

Kingchop is class based, which means you should require or import it as above, then initialize the class as an instance with `const chopper = new Kingchop()`.

**Example:**
```node.js
const string = 'Tech! Tech! Tech! Don't you want to become a doctor son? Treat people.....you know? Because, I don't understand these jargons you're writing there. Just go to sleep.';
const chopper = new Kingchop();
console.log(chopper.toSentence(string)); //returns lowcase of arrays of sentences.
```
Doing just that, you use the default settings of Kingchop.

For options or settings change, you initialize with a parameter, called options, which is an object.

# Options {#options}

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

const string = 'Do you know about KINGCHOP? And do you know what it can do?'
const chopper = new Kingchop({lowcase: true});
console.log(chopper.toSentence(string)); //[ 'do you know about kingchop?', 'and do you know what it can do?' ]

const chopper2 = new Kingchop({lowcase: false});
console.log(chopper2.toSentence(string)); //[ 'Do you know about KINGCHOP?', 'And do you know what it can do?' ]

```
----
##### **addToExceptions** 

**Default**: null. 

**Purpose**: Exceptions are words, or abrevations that ends or begin with delimiters like '!?.'. This option adds more exceptions to the existing exceptions after filtering possible duplicates.
 
**Example**: in the string, 'Prof. Victory Osiobe', Prof there, is in the existing exceptions list, but what they do is that they offset the rules, by ignoring them and the delimiters surrounding them, helping to not break by the delimiters that starts or follow them.

**More**: here are the list of existing exceptions, `['Dr', 'etc', 'Jr', 'M', 'Mgr', 'Mr', 'Mrs', 'Ms', 'Mme', 'Mlle', 'Prof', 'Sr', 'St', 'p', 'pp', 'pst', 'dj', 'po']`. There's no need to add the delimeters with them, as Kingchop takes care of that. For more coverage, they are set to case insensitive.

**Value**: it only accepts a string or an array of exceptions, with null, it fails.

**Usage**: 
``` node.js
//after importing or requiring kingchop.
let string = 'You should use inc. instead of co. on that website. The one that has .org domain. Then you inform Dr. Jarvis, Prof. Einstein, and Mr. Telsa about it.';
const chopper = new Kingchop({addToExceptions: ['org', 'inc', 'co']});
console.log(chopper.toSentence(string)); //results below
/*[
  'You should use inc. instead of co. on that website.',
  'The one that has .org domain.',
  'Then you inform Dr. Jarvis, Prof. Einstein, and Mr. Telsa, about it.'
]*/
```
----
##### **useExceptions** 

**Default**: null.

**Purpose**: use only provided exceptions (no addition to existing exceptions).

**Value**: it only accepts a string or an array of exceptions, with null, it fails.

**Usage**: 
``` node.js
//after importing or requiring kingchop.

let string = 'You should use inc. instead of co. on that website. The one that has .org domain. Then you inform Dr. Jarvis, Prof. Einstein, and Mr Telsa, about it.';
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
----
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
----
#####  **showDelimeters** 

**Default**: true.

**Purpose**: Normally, in other libraries, the array is formed by using delimiters, like '!?.', so those delimiters don't make it in the results. Well, this option if true, leaves the delimeters, instead of removing or using them.

**Value**: it only accepts 2 values, true or false. With true as default, it leaves the delimeters. With false, it uses the delimeters, hence, removing them.

**Usage**:
``` node.js
//after importing or requiring Kingchop.
const string = 'You're a great progra!mmer. You don't have to feel it!!';
const chopper = new Kingchop({showDelimeters: false});
console.log(chopper.toSentence(string)); //[ "You're a great progra!mmer", "You don't have to feel it" ]

const chopper2 = new Kingchop({showDelimeters: true});
console.log(chopper2.toSentence(string)); //[ "You're a great progra!mmer.", "You don't have to feel it!!" ]
```

----
#####  **correct** 

**Default**: true.

**Purpose**: With this, strings like:
```
hello            ! How are you  ?       ?
```
Will be transformed to 
```
hello! How are you??
```
It corrects spaces from delimeters.

**Value**: it only accepts 2 values, true or false. With true as default, Kingchop tries to correct the text. With false, text remains as inputed.

**More**: You may need to use this elsewhere, like, just to correct text without Kingchop other functions. If so, check [EXTRAS](#extras) section.

**Usage**:
``` node.js
//after importing or requiring Kingchop.

const string = 'You're a great programmer          . You don't have to feel it     !            !';
const chopper = new Kingchop({correct: false});
console.log(chopper.toSentence(string)); //['You're a great programmer          .', 'You don't have to feel it     !            !'];

const chopper2 = new Kingchop({correct: true});
console.log(chopper2.toSentence(string)); //['You're a great programmer.', 'You don't have to feel it!!']
```

----
##### **returnStatus** 

**Default**: false.

**Purpose**: when text is passed in, with standard methods, you may want to know if any seperations, or breaks, or splits were done. 

**More**: it returns the output of Kingchop in object form. It only returns 2 properties in object form: value, and status. `{value: 'is whatever was processed by Kingchop', status: true or false (if anything was done, 'true', if not, 'false')}`.

**Value**: it only accepts 2 values, true or false. With true, Kingchop returns an object with 2 properties, value and status. With false, only processed text is returned.

**Usage**:
``` node.js
//after importing or requiring kingchop.

const string = 'Kingchop is very fast. It can render results in an average of less than 3 milli seconds.'
const chopper = new Kingchop({returnStatus: true});
const refinedText = chopper.toSentence(string);
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
----

##### **levelUp** **coming soon*

**Default**: true.

**Purpose**: this option tries to make a good guess on what's to be a sentence with the length of the input.

**More**: if true, this option will use the length of the total string passed in, to find the minimum % (that's pre set) of the length of the input. And after all breaks into arrays, it checks each of them to find if any is less than or equal to the minimum %, if they are, it joins that array with previous array. 

**Note**: if status is false, like with returnStatus, or if no match, or breaks or separations into array is done, this will fail, causing it not to be useful.

**Value**: it only accepts 2 values, true or false. With true as it will be default, it tries to guess if an array is a sentence or not. With false, it uses the delimeters, hence, removing them.

**Usage**: *coming soon.*

----

**Phew! That was a long one. But I've got a little more. Let's talk on the available methods.**

# Methods {#methods}

**All methods listed, takes in 1 parameter, a string.**

#### **`toSentence(string)`**

This method is one that breaks text into arrays, sentence arrays. It uses those parameters I named options to offsets rules guiding it. It's a standard method of **kingchop**.

**Example Of Usage**:
``` node.js
//after importing or requiring Kingchop, and preparing your string.

const chopper = new Kingchop();
console.log(chopper.toSentence(string)); //returns arrays of sentences.
```
----
#### **`toParagraph(string)`** **coming soon*

This method is one that breaks text into detected paragraphs arrays. It will use those parameters I named options, to offsets rules guiding it. It's going to be a standard method of **kingchop**.

----
#### **`toSubSentence(string)`** **coming soon*

This method is one that breaks text into sub sentences arrays. Sub sentences delimeters will be ':,;', some others, and sentences delimeters too will be used. Yes, enclosers are counted as sub sentences. It will use those parameters I named options, to offsets rules guiding it. It's going to be a standard method of **kingchop**.

----
#### **`toWord(string)`** **coming soon*

This method is one that breaks text into words, all in arrays. It will use those parameters I named options, to offsets rules guiding it. It's going to be a standard method of **kingchop**.

# EXTRAS {#extras}

#### **`correctText(string)` method**
The `correctText(string)` method, takes in a string as a parameter and tries to correct the string passed in.

**For example**: It can turn this string 'hi ! but ? them   !  !   !', to 'hi! but? them!!!'.

**Example of Usage**:
``` node.js
const Kingchop = require('kingchop');
const string = 'hi ! but ? them   !    !   !';
const chopper = new Kingchop();
console.log(chopper.correctText(string), 'corrected text with the Kingchop library');
```
**More Info**: The method is meant for the processes of Kingchop, but you can use it if you need to.

# Coming Soon {#comingSoon}
1. **Compatibility with browsers, meaning, you can use it for frontend development, not just backend alone.**
2. **Paragraph Tokenization.**
3. **Sub Sentence Tokenization.**
4. **Word Tokenization.**
5. **The levelUp option.**
6. **The python version of Kingchop ⚔️.**

# Thanks {#thanks}

**Thanks to the ==talisman== library that I got some data from to work on this.**

**Thank y'all out there for your support and open-sources.**

# Support {#support}

[Donate for faster development of Kingchop via Kofi](https://kofi.com/victoryosiobe)