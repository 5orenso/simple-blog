:title Howto install on Amazon ubuntu

:body

## Howto install on Ubuntu


```bash

sudo apt-get install git
sudo git clone https://github.com/5orenso/simple-blog.git

sudo mkdir /var/run/simple-blog/ /var/log/simple-blog/
sudo chown www-data /var/run/simple-blog/ /var/log/simple-blog/

sudo cp upstart.conf /etc/init/simple-blog.conf
sudo initctl start simple-blog
sudo tail -f /var/log/simple-blog/simple-blog.log


```