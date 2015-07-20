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

    $ npm install


#### To watch files while developing.

    $ ./run-watch.sh

#### To run the server in develop mode and automatically reload when files changes.

    $ ./run-server.sh

#### To view code coverage

    $ ./report-test-cover.sh


## Howto publish content

Content are located in the content folder.  
Articles are located in the article folder and sub folders.  
Images are located in the images folder and sub folders.  
Simply save your article in the correct folder and voila, it's published.  


## Blog posts are separated into sections. 
Possible sections are:

| Section   | Tag        | Example of usage | Description
|-----------|------------|------------------|---------------------------------------------
| title     | :title     | :title My title  | Title of the blog post.
| published | :published | :published 2014-10-05 | Publish date of the blog post.
| teaser    | :teaser    |                  | Teaser text used on the frontpage and on the very top.
| ingress   | :ingress   |                  | Blog intro. The start of the blog post. Keep it relatively short.
| body      | :body      |                  | The blog post.
| img       | :img       | :img photo1.jpg  | Standard images used in the blog. It depends on the template where they are placed. You may use
| aside     | :aside     |                  | Boxes with content to go on the right side of the blog post.
| images    | :images    | :images /path/   | Load all images from one of the content categories.


## Special tags
| Tag name  | Tag          | Example of usage | Description
|-----------|--------------|------------------|---------------------------------------------
| toc       | &#91;:toc]       | &#91;:toc]           | Automatic generated table of contents.
| fact      | &#91;:fact file] | &#91;:fact about-md] | A general fact box. This is usually shared between several blog posts.
| menu      | &#91;:menu]      | &#91;:menu]          | List all categories inside the content dir.
| artlist   | &#91;:artlist]   | &#91;:artlist [category]]       | List all articles inside the content dir in a plain list format.
| artlist_block | &#91;:artlist_block ] | &#91;:artlist_block [category]] | List all articles inside the content dir in a plain list format.


### Example blog post
```md
 :title My blog post title
 :teaser Read all about it!
 :body
 ## Hello world!
 
 This is my first blog post.
 
```

__That's all there is to it.__


## Markdown is used for writing.

> Markdown is intended to be as easy-to-read and easy-to-write as is feasible.

Readability, however, is emphasized above all else. A Markdown-formatted document should be publishable as-is, as plain text, without looking like it’s been marked up with tags or formatting instructions.

- Read more in [Markdown official syntax guide](http://daringfireball.net/projects/markdown/syntax).
- [Github markdown page](https://help.github.com/articles/github-flavored-markdown)


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

### HOWTO install Dropbox sync
```bash
   66  cd ~ && wget -O - "https://www.dropbox.com/download?plat=lnx.x86_64" | tar xzf -
   67  ~/.dropbox-dist/dropboxd
   72  wget https://www.dropbox.com/download?dl=packages/dropbox.py
   73  mv download\?dl\=packages%2Fdropbox.py dropbox.py
cd Dropbox
  107  python ~/dropbox.py exclude add '1Password' '1Password.agilekeychain' 'Akvarie' 'Apps' 'backup' 'Bilder' 'Bilder til deling' 'Billetter' 'Books' 'Camera Uploads' 'CleanCode' 'Design' 'dev' 'dictonary' 'FINNske helårsbadere og venner' 'Flyfish' 'GoPro' 'GO_WEB' 'Grafikk' 'Havna' 'heltsykt' 'henriette' 'instagram' 'iOS' 'Julen 2013' 'Kjartanfolderen' 'Laytr Design' 'Maler' 'Moller' 'Musikk' 'New Datasheets January 2012' 'Nils og meg' 'Øistein og Marit' 'Photos' 'Picbox' 'Presentasjoner' 'Privat' 'Public' 'reise' 'Schou Vapen' 'Screenshots' 'Shared 2012 Eltek Extranet project' 'ShopShop' 'Sign On' 'Software' 'Sorenso.no' 'Statistikk' 'YouBay Design' 'kart' 'TeliaSonera' 'foto' 'Genious Scan' 'ScreenRecordings' 'Flyfisheurope - FFE' 'flintelvkulpen' 'DJI Phantom' 'Delt til Øistein' 'Byggeprosjekter' 'Trening' 'Camera Uploads alias' 'Screenshots alias' 'Screenshots alias 2' 'untitled folder' 'kvitteringer' 'nils' 'Camera Uploads from Hege'
  108  python ~/dropbox.py exclude list
  176  ps aux | grep dropbox
  184  python ~/dropbox.py status
  185  python ~/dropbox.py help
  186  python ~/dropbox.py filestatus wrap-up-fishing-in-finnmark-2014.md
  250  python ~/dropbox.py filestatus wrap-up-fishing-in-finnmark-2014.md
  251  python ~/dropbox.py start
  252  python ~/dropbox.py filestatus wrap-up-fishing-in-finnmark-2014.md
  255  python ~/dropbox.py filestatus wrap-up-fishing-in-finnmark-2014.md
  340  ps aux | grep dropbox
  341  python ~/dropbox.py filestatus wrap-up-fishing-in-finnmark-2014.md
  342  python ~/dropbox.py start
  343  python ~/dropbox.py stop
  344  python ~/dropbox.py start
  351  python ~/dropbox.py filestatus _tracking-service.md
  352  python ~/dropbox.py status
  368  python ~/dropbox.py exclude add /srv/simple-blog/content/images/wipbilder/
  374  python ~/dropbox.py exclude add /srv/simple-blog/content/images/wipbilder/
  377  python ~/dropbox.py exclude list
  378  python ~/dropbox.py exclude add Blog/images/wipbilder
  383  python ~/dropbox.py exclude add 'Blog (1)'
  384  python ~/dropbox.py exclude add 'BLOG (2)'
  386  python ~/dropbox.py exclude add 'Camera Uploads from Hege'
  387  python ~/dropbox.py exclude add 'kvitteringer' 'Moller (1)' 'nils'
  648  python ~/dropbox.py status
  649  python ~/dropbox.py staart
  650  python ~/dropbox.py start
  651  python ~/dropbox.py status
  665  python ~/dropbox.py status
  666  python ~/dropbox.py start
  667  python ~/dropbox.py status
  845  history | dropbox
  846  history | grep dropbox
```