:title Howto install on Amazon ubuntu

:body

## Howto install on Ubuntu


```bash

sudo apt-get install git
sudo apt-get install make

cd ~ && wget -O - "https://www.dropbox.com/download?plat=lnx.x86_64" | tar xzf -
~/.dropbox-dist/dropboxd
wget https://www.dropbox.com/download?dl=packages/dropbox.py
mv download\?dl\=packages%2Fdropbox.py dropbox.py
cd Dropbox
chmod 755 .
python ~/dropbox.py start
python ~/dropbox.py exclude add [lists of excluded folders]
python ~/dropbox.py exclude list


cd /srv/
sudo git clone https://github.com/5orenso/simple-blog.git

curl -sL https://deb.nodesource.com/setup | sudo bash -
sudo apt-get install nodejs

sudo mkdir /var/run/simple-blog/ /var/log/simple-blog/
sudo chown www-data /var/run/simple-blog/ /var/log/simple-blog/

cd simple-blog/
sudo chown ubuntu content
sudo rm -rf content/images
ln -s ~/Dropbox/Blog/articles content/.
ln -s ~/Dropbox/Blog/images content/.


sudo npm install --production
sudo cp etc/upstart.conf /etc/init/simple-blog.conf
sudo initctl start simple-blog
sudo tail -f /var/log/simple-blog/simple-blog.log




```