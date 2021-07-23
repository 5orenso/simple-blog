#!/bin/bash

cd /home/ubuntu/Dropbox/websites/litt.no/images
aws s3 sync ./ s3://simpleblog-images-original/litt.no/

cd /home/ubuntu/Dropbox/websites/altisokk.no/images
aws s3 sync ./ s3://simpleblog-images-original/altisokk.no/

cd /home/ubuntu/Dropbox/websites/zu.no/images
aws s3 sync ./ s3://simpleblog-images-original/zu.no/

cd /home/ubuntu/Dropbox/websites/varmeogsol.no/images
aws s3 sync ./ s3://simpleblog-images-original/varmeogsol.no/

cd /home/ubuntu/Dropbox/websites/vardo-ruta.no/images
aws s3 sync ./ s3://simpleblog-images-original/vardo-ruta.no/

cd /home/ubuntu/Dropbox/websites/trbygg.no/images
aws s3 sync ./ s3://simpleblog-images-original/trbygg.no/

cd /home/ubuntu/Dropbox/websites/torpa-il.no/images
aws s3 sync ./ s3://simpleblog-images-original/torpa-il.no/

cd /home/ubuntu/Dropbox/websites/themusher.no/images
aws s3 sync ./ s3://simpleblog-images-original/themusher.no/

cd /home/ubuntu/Dropbox/websites/mushsynnfjell.no/images
aws s3 sync ./ s3://simpleblog-images-original/mushsynnfjell.no/

cd /home/ubuntu/Dropbox/websites/lovetolearnmore.no/images
aws s3 sync ./ s3://simpleblog-images-original/lovetolearnmore.no/

cd /home/ubuntu/Dropbox/websites/kaffeogkode.no/images
aws s3 sync ./ s3://simpleblog-images-original/kaffeogkode.no/

cd /home/ubuntu/Dropbox/websites/hjortefot.no/images
aws s3 sync ./ s3://simpleblog-images-original/hjortefot.no/

cd /home/ubuntu/Dropbox/websites/fangst.no/images
aws s3 sync ./ s3://simpleblog-images-original/fangst.no/

cd /home/ubuntu/Dropbox/websites/dfoto.no/images
aws s3 sync ./ s3://simpleblog-images-original/dfoto.no/
