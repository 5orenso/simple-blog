## A very simple blog server

![Build status](https://travis-ci.org/5orenso/simple-blog.svg?branch=master)

Written in Node.js with support for Markdown files, images, embedded content and all other stuff you would expect from a blog.

Base idea of this server is to keep it as lean as possible. There should be no hard admin interface or other stuff getting in the way of publishing content.

## This is how it works

```
    ----------------   dropbox      -------------
   | who-am-i.md    |  auto sync   | Simple blog |
   | hello-blog.md  | -----------> | server      |
   | ...            |              | (Amazon)    |  web page    ------------
    ----------------               |             | ----------> | browser    |
    ----------------   dropbox     |             |             |            |
   | image.jpg      |  auto sync   |             |              ------------
   | image2.jpg     | -----------> |             |
    ----------------               |             |
                                    -------------    
```

- All content is worked on locally on your computer, phone og tablet. You can even work when offline.
- Everything is synced to the server by your Dropbox setup.
- Administration of users is done with your Dropbox sharing.


[Read more about the simple blog server.](http://litt.no/wiki/)

### Prerequisite
```
    # Install grunt
    $ npm install grunt -g

    # Install istanbul
    $ npm install istanbul -g
```

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

