## A very simple blog server
[![Build Status](https://travis-ci.org/5orenso/simple-blog.svg?branch=master)](https://travis-ci.org/5orenso/simple-blog)
[![Coverage Status](https://coveralls.io/repos/5orenso/simple-blog/badge.svg?branch=master)](https://coveralls.io/r/5orenso/simple-blog?branch=master)
[![GitHub version](https://badge.fury.io/gh/5orenso%2Fsimple-blog.svg)](http://badge.fury.io/gh/5orenso%2Fsimple-blog)

Written in Node.js with support for Markdown files, images, embedded content and all other stuff you would expect from a blog.

Base idea of this server is to keep it as lean as possible. There should be no hard admin interface or other stuff getting in the way of publishing content.

Search capabilities is added with an ElasticSearch integration adapter.

## This is how it works

```
    ----------------   dropbox      -------------     -------
   | who-am-i.md    |  auto sync   | Simple blog |   | Nginx |
   | hello-blog.md  | -----------> | server      |-->|   or  |
   | ...            |              | (Amazon)    |   | Cloud-|  web page    -----------
    ----------------               |             |   | Front | ----------> | browser   |
    ----------------   dropbox     |             |   |       |             | or mobile |
   | image.jpg      |  auto sync   |             |   |       |              -----------
   | image2.jpg     | -----------> |             |   |       |
    ----------------               |             |    -------
                                    -------------
    ----------------                      |
   | ElasticSearch  | --------------------
    ----------------

```

- All content is worked on locally on your computer, phone og tablet. You can even work when offline.
- Everything is synced to the server by your Dropbox setup.
- Administration of users is done with your Dropbox sharing.


[Read more about the simple blog server.](http://litt.no/wiki/)

### Prerequisite

#### Install grunt

    $ npm install -g grunt-cli

#### Install istanbul

    $ npm install istanbul -g

#### Install ImageMagick

    $ brew install imagemagick


### Setup developer environment

#### Clone repository

    $ git clone git@github.com:5orenso/simple-blog.git

#### Install dependencies

    $ cd simple-blog
    $ npm install

#### Link content folders to your Dropbox folder
    $ ln -s ~/Dropbox/Blog/articles
    $ ln -s ~/Dropbox/Blog/images

#### To watch files while developing.

    $ ./run-watch.sh

#### To run the server in develop mode and automatically reload when files changes.

    $ ./run-server.sh
    $ open -a Safari http://127.0.0.1:8080/
    # Or simply point your favorite browser to http://127.0.0.1:8080/


#### To view code coverage

    $ ./report-test-cover.sh


## Howto publish content

Content are located in the content folder.  
Articles are located in the article folder and sub folders.  
Images are located in the images folder and sub folders.  
Simply save your article in the correct folder and voila, it's published.  

### Example blog post
```md
 :title My blog post title
 :teaser Read all about it!
 :body
 ## Hello world!
 
 This is my first blog post.
 
```

__That's all there is to it.__

See the [wiki page](./wiki.md) for more details.


## Markdown is used for writing.

> Markdown is intended to be as easy-to-read and easy-to-write as is feasible.

Readability, however, is emphasized above all else. A Markdown-formatted document should be publishable as-is, as plain text, without looking like it’s been marked up with tags or formatting instructions.

- Read more in [Markdown official syntax guide](http://daringfireball.net/projects/markdown/syntax).
- [Github markdown page](https://help.github.com/articles/github-flavored-markdown)
- [Markdown cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#links)


## Work in progress

More to come :)


### Read more about:

- [Promises in general](https://www.promisejs.org/)
- [Node.js when](https://github.com/cujojs/when)
- [Markdown](http://daringfireball.net/projects/markdown/syntax)
- [Github flavoured Markdown](https://help.github.com/articles/github-flavored-markdown)
- [Express](http://expressjs.com/)
- [Swig](https://github.com/paularmstrong/swig)


### HOWTO upgrade dev environment
```bash
npm install buster --save-dev
npm install buster-istanbul --save-dev
npm install grunt --save-dev
npm install grunt-buster --save-dev
npm install grunt-contrib-jshint --save-dev
npm install grunt-contrib-nodeunit --save-dev
npm install grunt-contrib-watch --save-dev
npm install grunt-coveralls --save-dev
npm install grunt-jscs --save-dev
npm install grunt-nodemon --save-dev
npm install grunt-shell --save-dev
```

