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

Howto setup

    npm install
    

Howto run unit tests:

    grunt watch
    

Howto run integration tests:

    grunt integration

    
Howto run script

    grunt run
    

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
| teaser    | :teaser    |                  | Teaser text used on the frontpage and on the very top.
| ingress   | :ingress   |                  | Blog intro. The start of the blog post. Keep it relatively short.
| body      | :body      |                  | The blog post. 
| img       | :img       | :img photo1.jpg  | Standard images used in the blog. It depends on the template where they are placed. You may use 
| aside     | :aside     |                  | Boxes with content to go on the right side of the blog post.
| tags      | :tags      | :tags foo,bar    | Content tag for this blog post.


## Special tags

| Tag name  | Tag          | Example of usage | Description 
|-----------|--------------|------------------|---------------------------------------------
| toc       | [:toc]       | [:toc]           | Automatic generated table of contents.
| fact      | [:fact file] | [:fact about-md] | A general fact box. This is usually shared between several blog posts.


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


| Tag             | Example                         | Result                                  |
|-----------------|---------------------------------|-----------------------------------------|
| Headlines       | # This is H1                    | [See below](#headlines-and-subheadlines)
|                 | ## This is H2                   | |
| Emphasis        | ```_italic_```                  | _italic_
| Bold            | ```__bold__```                  | __bold__
| Link            | ```[Link to an example](http://example.com/)``` | [Link to an example](http://example.com/)
| Images          | ```![Image alt text](http://parsedown.org/md.png)``` | ![Image alt text](http://parsedown.org/md.png) 
| Quotes          | ```> This is the quoted text``` | [See below](#text-quotes)
| Unordered lists | - First element                 | [See below](#ordered-and-unordered-lists)
|                 | - Second element                | |
| Ordered lists   | 1. First element                | [See below](#ordered-and-unordered-lists)
|                 | 2. Second element               | |
| Strike through  | ```~~Mistaken text~~```         | ~~Mistaken text~~ 
| Horizontal line | ```----- or *****```            | [See below](#horizontal-line)
| Table           |                                 | [See below](#tables)
| Table of content| :toc: 


## Work in progress

More to come :) 
The hottest feature is:
- Dropbox integration


### Read more about:

- [Promises in general](https://www.promisejs.org/)
- [Node.js when](https://github.com/cujojs/when)
- [Markdown](http://daringfireball.net/projects/markdown/syntax)
- [Github flavoured Markdown](https://help.github.com/articles/github-flavored-markdown)
- [Express](http://expressjs.com/)
- [Swig](https://github.com/paularmstrong/swig)

