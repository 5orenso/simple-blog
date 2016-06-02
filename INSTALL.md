# Installation

* [AWS install](#user-content-aws-install)
* [Local install](#user-content-local-install)


# Amazon Web Service installation

Head over to my [AWS AMI Creation repo](https://github.com/5orenso/aws-ami-creation).
With almost no effert you're up and running with your own blog server inside an
Auto Scaling Group and behind an ELB.

# Local Installation

## Developer environment needed

### Install grunt

```bash
$ npm install -g grunt-cli
```

### Install istanbul

```bash
$ npm install istanbul -g
```

### Install ImageMagick

```bash
$ brew install imagemagick
```

## Application installation

### Clone repository

```bash
$ git clone git@github.com:5orenso/simple-blog.git
```

### Install dependencies

```bash
$ cd simple-blog
$ npm install
```

### Link content folders to your Dropbox folder

```bash
$ ln -s ~/Dropbox/Blog/articles
$ ln -s ~/Dropbox/Blog/images
```

### To watch files while developing.

```bash
$ ./run-watch.sh
```

### To run the server in develop mode and automatically reload when files changes.

```bash
$ ./run-server.sh
$ open -a Safari http://127.0.0.1:8080/
# Or simply point your favorite browser to http://127.0.0.1:8080/
```

### To view code coverage

```bash
$ ./report-test-cover.sh
```
