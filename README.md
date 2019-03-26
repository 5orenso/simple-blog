## A very simple blog server

[![Join the chat at https://gitter.im/5orenso/simple-blog](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/5orenso/simple-blog?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
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

* [Install instructions](INSTALL.md)


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


### Howto upgrade modules
```bash
$ npm install -g npm-check-updates
$ ncu --upgrade --upgradeAll
$ npm install --no-optional
```


### Howto upgrade editor
```bash
$ cp ../simplemde-markdown-editor/dist/simplemde.min.js ./template/global/js/.
$ cp ../simplemde-markdown-editor/dist/simplemde.min.css ./template/global/css/.
```

### Howto move database
```javascript
> db.copyDatabase('simpleBlog', 'simpleBlogLittno')
> use simpleBlog;
> db.dropDatabase();
```

### Howto move database
```bash
$ node ./bin/import-article-to-mongo.js /srv/config/simple-blog/config-litt.no.js
$ node ./bin/import-category-to-mongo.js /srv/config/simple-blog/config-litt.no.js
$ node ./bin/import-image-to-mongo.js /srv/config/simple-blog/config-litt.no.js

$ node ./bin/import-article-to-mongo.js /srv/config/simple-blog/config-kaffeogkode.no.js
$ node ./bin/import-category-to-mongo.js /srv/config/simple-blog/config-kaffeogkode.no.js
$ node ./bin/import-image-to-mongo.js /srv/config/simple-blog/config-kaffeogkode.no.js

$ node ./bin/import-article-to-mongo.js /srv/config/simple-blog/config-zu.no.js
$ node ./bin/import-category-to-mongo.js /srv/config/simple-blog/config-zu.no.js
$ node ./bin/import-image-to-mongo.js /srv/config/simple-blog/config-zu.no.js
```

## Other Resources

* [AWS Basic setup with Cloudformation](https://github.com/5orenso/aws-cloudformation-base)
* [AWS Server setup with Cloudformation](https://github.com/5orenso/aws-cloudformation-servers)
* [AWS Lambda boilerplate](https://github.com/5orenso/aws-lambda-boilerplate)
* [Automated AWS Lambda update](https://github.com/5orenso/aws-lambda-autodeploy-lambda)
* [AWS API Gateway setup with Cloudformation](https://github.com/5orenso/aws-cloudformation-api-gateway)
* [AWS IoT setup with Cloudformation](https://github.com/5orenso/aws-cloudformation-iot)
