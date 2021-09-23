# Work in progress


https://console.developers.google.com/project

### Release names
https://www.google.com/webhp?sourceid=chrome-instant&rlz=1C5AVSZ_enNO643NO643&ion=1&espv=2&es_th=1&ie=UTF-8#q=battlestar%20galactica%20names&es_th=1

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



Delete an index in Elasticsearch>
$ curl -XDELETE 'http://172.30.0.227:9200/lokenhavna.no/'


### Move images

aws s3 sync s3://simpleblog-images-original/femundlopet.litt.no/ s3://simpleblog-images-original/femundlopet.no/

