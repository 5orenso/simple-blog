# Replacers

Replacers are almost the same as plugins, but are runned after markdown is generated. 
Therefor you are able to alter the html code before it's presented.

A replacer needs:
- An opt.regexp to run match on.
- A get function to get the regexp.
- A replacer function to do the magic stuff on the replace match.

It all should be written as a node.js module.

