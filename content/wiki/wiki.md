:title Blog Wiki
:teaser A very simple and scalable blog platform
:body
[:menu]

## Table of contents

[:toc]

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

That's all there is to it.



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



### Headlines and subheadlines

```md
# This is an H1
## This is an H2
### This is an H3
#### This is an H4
```

Turns into this:
```html
<h1>This is an H1</h1>
<h2>This is an H2</h2>
<h3>This is an H3</h3>
<h4>This is an H4</h4>
```

### Text formatting

```md
_This is emphasis_
__This is bold emphasis__
```

Looks like this:  
_This is emphasis_  
__This is bold emphasis__


### Links

```md
[Link to an example](http://example.com/ "Title")
```

Looks like this:  
[Link to an example](http://example.com/ "Title")


### Images

Inline-style:
```md
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")
```
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")


### Text quotes

```md
> Quotes are  
> written this way
```

Turns into this:
> Quotes are
> written this way

Quotes can also contain Markdown elements.

```md
> ### The Fox
> 
> Ching ching ching.
> Pow, pow, pow.
```

Looks like this:
> ### The Fox
> 
> Ching ching ching.
> Pow, pow, pow.



### Ordered and unordered lists

```md
- Cat
- Dog
- Horse

1. Donkey
2. Squirrel
3. Rat
```

Turns into this:
- Cat
- Dog
- Horse

And ordered list:
1. Donkey
2. Squirrel
3. Rat


### Tables

Draw a text table and it becomes a html table.

```md
| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |
```

Looks like this:

| First Header  | Second Header |
| ------------- | ------------- |
| Content Cell  | Content Cell  |
| Content Cell  | Content Cell  |



If you want spesific alignment use colons within the header row on the side you want to align to.

```md
| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -------------:|
| col 3 is      | some wordy text | $1600         |
```

Looks like this:

| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ |:---------------:| -------------:|
| col 3 is      | some wordy text | $1600         |


### Horizontal line

```md
-----
*****
```

Turns into the same line like this:
  
-----

### Read more
[:artlist wiki]