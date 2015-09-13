# Plugins

Plugins are run before markdown is generated. The results returned from the 
plugins should be formatted as markdown compatible content.

A plugin needs:
- An opt.regexp to run match on.
- A get function to get the regexp.
- A replacer function to do the magic stuff on the replace match.

It all should be written as a node.js module.

