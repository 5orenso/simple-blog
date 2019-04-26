ubuntu@mongo11:~$ mongo simpleBlogLittno --eval "var collection = 'article'" ./variety/variety.js
MongoDB shell version v3.6.7
connecting to: mongodb://127.0.0.1:27017/simpleBlogLittno
MongoDB server version: 3.6.7
Variety: A MongoDB Schema Analyzer
Version 1.5.1, released 02 October 2017
Using collection of "article"
Using query of { }
Using limit of 116
Using maxDepth of 99
Using sort of { "_id" : -1 }
Using outputFormat of "ascii"
Using persistResults of false
Using resultsDatabase of "varietyResults"
Using resultsCollection of "articleKeys"
Using resultsUser of null
Using resultsPass of null
Using logKeysContinuously of false
Using excludeSubkeys of [ ]
Using arrayEscape of "XX"
Using lastValue of false
Using plugins of [ ]
+----------------------------------------------------------------------------------------------------------------------------+
| key                                                         | types                   | occurrences | percents             |
| ----------------------------------------------------------- | ----------------------- | ----------- | -------------------- |
| __v                                                         | Number                  |         116 | 100.0000000000000000 |
| _id                                                         | ObjectId                |         116 | 100.0000000000000000 |
| author                                                      | String                  |         116 | 100.0000000000000000 |
| body                                                        | String                  |         116 | 100.0000000000000000 |
| bodyParts                                                   | Array                   |         116 | 100.0000000000000000 |
| category                                                    | String                  |         116 | 100.0000000000000000 |
| colParts                                                    | Array                   |         116 | 100.0000000000000000 |
| comments                                                    | Array                   |         116 | 100.0000000000000000 |
| createdDate                                                 | Date                    |         116 | 100.0000000000000000 |
| id                                                          | Number                  |         116 | 100.0000000000000000 |
| imageObject                                                 | Object                  |         116 | 100.0000000000000000 |
| imageObject.keywords                                        | Array                   |         116 | 100.0000000000000000 |
| imageObject.loc                                             | Object                  |         116 | 100.0000000000000000 |
| imageObject.loc.coordinates                                 | Array                   |         116 | 100.0000000000000000 |
| img                                                         | Array (113),null (3)    |         116 | 100.0000000000000000 |
| imgParts                                                    | Array                   |         116 | 100.0000000000000000 |
| imgText                                                     | Array (112),null (4)    |         116 | 100.0000000000000000 |
| imgTextParts                                                | Array                   |         116 | 100.0000000000000000 |
| likes                                                       | Array                   |         116 | 100.0000000000000000 |
| published                                                   | Date                    |         116 | 100.0000000000000000 |
| status                                                      | Number                  |         116 | 100.0000000000000000 |
| tags                                                        | Array (46),null (70)    |         116 | 100.0000000000000000 |
| teaserParts                                                 | Array                   |         116 | 100.0000000000000000 |
| title                                                       | String                  |         116 | 100.0000000000000000 |
| titleParts                                                  | Array                   |         116 | 100.0000000000000000 |
| updatedDate                                                 | Date                    |         116 | 100.0000000000000000 |
| img.XX._id                                                  | ObjectId                |         113 |  97.4137931034482705 |
| img.XX.exif                                                 | Object (111),null (2)   |         113 |  97.4137931034482705 |
| img.XX.src                                                  | String                  |         113 |  97.4137931034482705 |
| img.XX.stats                                                | Object                  |         113 |  97.4137931034482705 |
| img.XX.stats.atime                                          | String (6),Date (107)   |         113 |  97.4137931034482705 |
| img.XX.stats.atimeMs                                        | Number                  |         113 |  97.4137931034482705 |
| img.XX.stats.birthtime                                      | String (6),Date (107)   |         113 |  97.4137931034482705 |
| img.XX.stats.birthtimeMs                                    | Number                  |         113 |  97.4137931034482705 |
| img.XX.stats.blksize                                        | Number                  |         113 |  97.4137931034482705 |
| img.XX.stats.blocks                                         | Number                  |         113 |  97.4137931034482705 |
| img.XX.stats.ctime                                          | String (6),Date (107)   |         113 |  97.4137931034482705 |
| img.XX.stats.ctimeMs                                        | Number                  |         113 |  97.4137931034482705 |
| img.XX.stats.dev                                            | Number                  |         113 |  97.4137931034482705 |
| img.XX.stats.gid                                            | Number                  |         113 |  97.4137931034482705 |
| img.XX.stats.ino                                            | Number                  |         113 |  97.4137931034482705 |
| img.XX.stats.mode                                           | Number                  |         113 |  97.4137931034482705 |
| img.XX.stats.mtime                                          | String (6),Date (107)   |         113 |  97.4137931034482705 |
| img.XX.stats.mtimeMs                                        | Number                  |         113 |  97.4137931034482705 |
| img.XX.stats.nlink                                          | Number                  |         113 |  97.4137931034482705 |
| img.XX.stats.rdev                                           | Number                  |         113 |  97.4137931034482705 |
| img.XX.stats.size                                           | Number                  |         113 |  97.4137931034482705 |
| img.XX.stats.uid                                            | Number                  |         113 |  97.4137931034482705 |
| img.XX.exif.exifImageWidth                                  | Number                  |         111 |  95.6896551724137936 |
| img.XX.exif.exifOffset                                      | Number                  |         111 |  95.6896551724137936 |
| img.XX.exif.key                                             | Number (105),String (7) |         111 |  95.6896551724137936 |
| img.XX.exif.xResolution                                     | Number                  |         111 |  95.6896551724137936 |
| img.XX.exif.yResolution                                     | Number                  |         111 |  95.6896551724137936 |
| img.XX.features                                             | Object                  |         110 |  94.8275862068965552 |
| img.XX.features.artifacts                                   | Object                  |         110 |  94.8275862068965552 |
| img.XX.features.artifacts.filename                          | String                  |         110 |  94.8275862068965552 |
| img.XX.features.artifacts.verbose                           | String                  |         110 |  94.8275862068965552 |
| img.XX.features.background color                            | String                  |         110 |  94.8275862068965552 |
| img.XX.features.border color                                | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel depth                               | Object                  |         110 |  94.8275862068965552 |
| img.XX.features.channel depth.blue                          | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel depth.green                         | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel depth.red                           | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics                          | Object                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.blue                     | Object                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.blue.kurtosis            | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.blue.max                 | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.blue.mean                | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.blue.min                 | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.blue.skewness            | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.blue.standard deviation  | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.green                    | Object                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.green.kurtosis           | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.green.max                | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.green.mean               | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.green.min                | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.green.skewness           | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.green.standard deviation | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.red                      | Object                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.red.kurtosis             | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.red.max                  | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.red.mean                 | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.red.min                  | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.red.skewness             | String                  |         110 |  94.8275862068965552 |
| img.XX.features.channel statistics.red.standard deviation   | String                  |         110 |  94.8275862068965552 |
| img.XX.features.chromaticity                                | Object                  |         110 |  94.8275862068965552 |
| img.XX.features.chromaticity.blue primary                   | String                  |         110 |  94.8275862068965552 |
| img.XX.features.chromaticity.green primary                  | String                  |         110 |  94.8275862068965552 |
| img.XX.features.chromaticity.red primary                    | String                  |         110 |  94.8275862068965552 |
| img.XX.features.chromaticity.white point                    | String                  |         110 |  94.8275862068965552 |
| img.XX.features.class                                       | String                  |         110 |  94.8275862068965552 |
| img.XX.features.colorspace                                  | String                  |         110 |  94.8275862068965552 |
| img.XX.features.compose                                     | String                  |         110 |  94.8275862068965552 |
| img.XX.features.compression                                 | String                  |         110 |  94.8275862068965552 |
| img.XX.features.depth                                       | Number                  |         110 |  94.8275862068965552 |
| img.XX.features.dispose                                     | String                  |         110 |  94.8275862068965552 |
| img.XX.features.elapsed time                                | String                  |         110 |  94.8275862068965552 |
| img.XX.features.endianess                                   | String                  |         110 |  94.8275862068965552 |
| img.XX.features.filesize                                    | String                  |         110 |  94.8275862068965552 |
| img.XX.features.format                                      | String                  |         110 |  94.8275862068965552 |
| img.XX.features.gamma                                       | String                  |         110 |  94.8275862068965552 |
| img.XX.features.geometry                                    | String                  |         110 |  94.8275862068965552 |
| img.XX.features.height                                      | Number                  |         110 |  94.8275862068965552 |
| img.XX.features.image statistics                            | Object                  |         110 |  94.8275862068965552 |
| img.XX.features.image statistics.overall                    | Object                  |         110 |  94.8275862068965552 |
| img.XX.features.image statistics.overall.kurtosis           | String                  |         110 |  94.8275862068965552 |
| img.XX.features.image statistics.overall.max                | String                  |         110 |  94.8275862068965552 |
| img.XX.features.image statistics.overall.mean               | String                  |         110 |  94.8275862068965552 |
| img.XX.features.image statistics.overall.min                | String                  |         110 |  94.8275862068965552 |
| img.XX.features.image statistics.overall.skewness           | String                  |         110 |  94.8275862068965552 |
| img.XX.features.image statistics.overall.standard deviation | String                  |         110 |  94.8275862068965552 |
| img.XX.features.interlace                                   | String                  |         110 |  94.8275862068965552 |
| img.XX.features.iterations                                  | String                  |         110 |  94.8275862068965552 |
| img.XX.features.matte color                                 | String                  |         110 |  94.8275862068965552 |
| img.XX.features.number pixels                               | String                  |         110 |  94.8275862068965552 |
| img.XX.features.orientation                                 | String                  |         110 |  94.8275862068965552 |
| img.XX.features.page geometry                               | String                  |         110 |  94.8275862068965552 |
| img.XX.features.pixels per second                           | String                  |         110 |  94.8275862068965552 |
| img.XX.features.print size                                  | String                  |         110 |  94.8275862068965552 |
| img.XX.features.profiles                                    | Object                  |         110 |  94.8275862068965552 |
| img.XX.features.properties                                  | Object                  |         110 |  94.8275862068965552 |
| img.XX.features.properties.date:create                      | String                  |         110 |  94.8275862068965552 |
| img.XX.features.properties.date:modify                      | String                  |         110 |  94.8275862068965552 |
| img.XX.features.properties.jpeg:colorspace                  | String                  |         110 |  94.8275862068965552 |
| img.XX.features.properties.jpeg:sampling-factor             | String                  |         110 |  94.8275862068965552 |
| img.XX.features.properties.signature                        | String                  |         110 |  94.8275862068965552 |
| img.XX.features.rendering intent                            | String                  |         110 |  94.8275862068965552 |
| img.XX.features.resolution                                  | String                  |         110 |  94.8275862068965552 |
| img.XX.features.tainted                                     | String                  |         110 |  94.8275862068965552 |
| img.XX.features.transparent color                           | String                  |         110 |  94.8275862068965552 |
| img.XX.features.type                                        | String                  |         110 |  94.8275862068965552 |
| img.XX.features.units                                       | String                  |         110 |  94.8275862068965552 |
| img.XX.features.user time                                   | String                  |         110 |  94.8275862068965552 |
| img.XX.features.version                                     | String                  |         110 |  94.8275862068965552 |
| img.XX.features.width                                       | Number                  |         110 |  94.8275862068965552 |
| img.XX.features.quality                                     | Number                  |         109 |  93.9655172413793167 |
| teaser                                                      | String (107),null (2)   |         109 |  93.9655172413793167 |
| filename                                                    | String                  |         108 |  93.1034482758620641 |
| img.XX.features.profiles.profile-exif                       | String                  |         108 |  93.1034482758620641 |
| img.XX.features.properties.exif:exifimagelength             | String                  |         108 |  93.1034482758620641 |
| img.XX.features.properties.exif:exifimagewidth              | String                  |         108 |  93.1034482758620641 |
| img.XX.features.properties.exif:exifoffset                  | String                  |         108 |  93.1034482758620641 |
| img.XX.features.properties.exif:xresolution                 | String                  |         108 |  93.1034482758620641 |
| img.XX.features.properties.exif:yresolution                 | String                  |         108 |  93.1034482758620641 |
| ingress                                                     | null (105),String (3)   |         108 |  93.1034482758620641 |
| vimeo                                                       | null                    |         108 |  93.1034482758620641 |
| youtube                                                     | null (79),String (29)   |         108 |  93.1034482758620641 |
| img.XX.predictions                                          | Array                   |         106 |  91.3793103448275872 |
| img.XX.predictions.XX.className                             | String                  |         106 |  91.3793103448275872 |
| img.XX.predictions.XX.probability                           | Number                  |         106 |  91.3793103448275872 |
| img.XX.predictionsCocoSsd                                   | Array                   |         106 |  91.3793103448275872 |
| img.XX.features.profiles.profile-8bim                       | String                  |          92 |  79.3103448275862064 |
| img.XX.exif.exifImageLength                                 | Number                  |          91 |  78.4482758620689680 |
| img.XX.exif.exifVersion                                     | String                  |          89 |  76.7241379310344769 |
| img.XX.exif.componentsConfiguration                         | String                  |          88 |  75.8620689655172384 |
| img.XX.exif.flashPixVersion                                 | String                  |          88 |  75.8620689655172384 |
| img.XX.exif.sceneCaptureType                                | Number                  |          88 |  75.8620689655172384 |
| img.XX.exif.dateTime                                        | String (6),Date (81)    |          87 |  75.0000000000000000 |
| img.XX.exif.dateTimeDigitized                               | String (6),Date (81)    |          87 |  75.0000000000000000 |
| img.XX.exif.dateTimeOriginal                                | String (6),Date (81)    |          87 |  75.0000000000000000 |
| img.XX.exif.software                                        | String                  |          87 |  75.0000000000000000 |
| img.XX.exif.exposureTime                                    | String                  |          86 |  74.1379310344827616 |
| img.XX.exif.fNumber                                         | Number                  |          86 |  74.1379310344827616 |
| img.XX.exif.flash                                           | Number                  |          86 |  74.1379310344827616 |
| img.XX.exif.focalLength                                     | Number                  |          86 |  74.1379310344827616 |
| img.XX.exif.isoSpeedRatings                                 | Number                  |          86 |  74.1379310344827616 |
| img.XX.exif.make                                            | String                  |          86 |  74.1379310344827616 |
| img.XX.exif.meteringMode                                    | Number                  |          86 |  74.1379310344827616 |
| img.XX.exif.model                                           | String                  |          86 |  74.1379310344827616 |
| img.XX.features.properties.exif:datetime                    | String                  |          86 |  74.1379310344827616 |
| img.XX.features.properties.exif:datetimedigitized           | String                  |          86 |  74.1379310344827616 |
| img.XX.features.properties.exif:datetimeoriginal            | String                  |          86 |  74.1379310344827616 |
| img.XX.features.properties.exif:exifversion                 | String                  |          86 |  74.1379310344827616 |
| img.XX.features.properties.exif:software                    | String                  |          86 |  74.1379310344827616 |
| img.XX.exif.shutterSpeedValue                               | Number (60),String (27) |          85 |  73.2758620689655231 |
| img.XX.exif.whiteBalance                                    | Number                  |          85 |  73.2758620689655231 |
| img.XX.features.properties.exif:componentsconfiguration     | String                  |          85 |  73.2758620689655231 |
| img.XX.features.properties.exif:exposuretime                | String                  |          85 |  73.2758620689655231 |
| img.XX.features.properties.exif:flash                       | String                  |          85 |  73.2758620689655231 |
| img.XX.features.properties.exif:flashpixversion             | String                  |          85 |  73.2758620689655231 |
| img.XX.features.properties.exif:fnumber                     | String                  |          85 |  73.2758620689655231 |
| img.XX.features.properties.exif:focallength                 | String                  |          85 |  73.2758620689655231 |
| img.XX.features.properties.exif:isospeedratings             | String                  |          85 |  73.2758620689655231 |
| img.XX.features.properties.exif:make                        | String                  |          85 |  73.2758620689655231 |
| img.XX.features.properties.exif:meteringmode                | String                  |          85 |  73.2758620689655231 |
| img.XX.features.properties.exif:model                       | String                  |          85 |  73.2758620689655231 |
| img.XX.features.properties.exif:scenecapturetype            | String                  |          85 |  73.2758620689655231 |
| img.XX.exif.exposureProgram                                 | Number                  |          84 |  72.4137931034482705 |
| img.XX.features.properties.exif:aperturevalue               | String                  |          84 |  72.4137931034482705 |
| img.XX.features.properties.exif:shutterspeedvalue           | String                  |          84 |  72.4137931034482705 |
| img.XX.features.properties.exif:whitebalance                | String                  |          84 |  72.4137931034482705 |
| img.XX.exif.exposureMode                                    | Number                  |          83 |  71.5517241379310320 |
| img.XX.features.properties.exif:colorspace                  | String                  |          83 |  71.5517241379310320 |
| img.XX.features.properties.exif:exposureprogram             | String                  |          83 |  71.5517241379310320 |
| img.XX.features.properties.exif:exposuremode                | String                  |          82 |  70.6896551724137936 |
| img.XX.exif.colorSpace                                      | String                  |          81 |  69.8275862068965552 |
| img.XX.exif.exposureBiasValue                               | Number (80),String (1)  |          80 |  68.9655172413793167 |
| img.XX.features.profile-xmp                                 | String                  |          80 |  68.9655172413793167 |
| img.XX.features.properties.exif:exposurebiasvalue           | String                  |          79 |  68.1034482758620641 |
| img.XX.exif.subSecTimeDigitized                             | Number                  |          78 |  67.2413793103448256 |
| img.XX.exif.subSecTimeOriginal                              | Number                  |          78 |  67.2413793103448256 |
| img.XX.features.properties.exif:subsectimedigitized         | String                  |          77 |  66.3793103448275872 |
| img.XX.features.properties.exif:subsectimeoriginal          | String                  |          77 |  66.3793103448275872 |
| img.XX.features.properties.unknown                          | String                  |          76 |  65.5172413793103487 |
| img.XX.exif.gpsInfo                                         | String                  |          74 |  63.7931034482758648 |
| img.XX.features.properties.exif:gpsinfo                     | String                  |          73 |  62.9310344827586192 |
| img.XX.exif.customRendered                                  | Number                  |          72 |  62.0689655172413808 |
| img.XX.features.properties.exif:customrendered              | String                  |          72 |  62.0689655172413808 |
| img.XX.exif.gpsLatitude                                     | String                  |          69 |  59.4827586206896584 |
| img.XX.exif.gpsLatitudeRef                                  | String                  |          69 |  59.4827586206896584 |
| img.XX.exif.gpsLongitude                                    | String                  |          69 |  59.4827586206896584 |
| img.XX.exif.gpsLongitudeRef                                 | String                  |          69 |  59.4827586206896584 |
| img.XX.exif.lat                                             | Number                  |          69 |  59.4827586206896584 |
| img.XX.exif.lng                                             | Number                  |          69 |  59.4827586206896584 |
| img.XX.exif.maxApertureValue                                | Number                  |          69 |  59.4827586206896584 |
| img.XX.features.properties.exif:maxaperturevalue            | String                  |          69 |  59.4827586206896584 |
| img.XX.exif.gpsAltitude                                     | Number                  |          68 |  58.6206896551724128 |
| img.XX.features.properties.exif:gpslatitude                 | String                  |          68 |  58.6206896551724128 |
| img.XX.features.properties.exif:gpslatituderef              | String                  |          68 |  58.6206896551724128 |
| img.XX.features.properties.exif:gpslongitude                | String                  |          68 |  58.6206896551724128 |
| img.XX.features.properties.exif:gpslongituderef             | String                  |          68 |  58.6206896551724128 |
| img.XX.features.properties.exif:gpsaltitude                 | String                  |          67 |  57.7586206896551744 |
| img.XX.exif.gpsAltitudeRef                                  | String                  |          66 |  56.8965517241379288 |
| img.XX.features.properties.exif:gpsaltituderef              | String                  |          65 |  56.0344827586206904 |
| img.XX.exif.focalPlaneResolutionUnit                        | String                  |          64 |  55.1724137931034448 |
| img.XX.exif.focalPlaneXResolution                           | Number                  |          64 |  55.1724137931034448 |
| img.XX.exif.focalPlaneYResolution                           | Number                  |          64 |  55.1724137931034448 |
| img.XX.features.properties.exif:focalplaneresolutionunit    | String                  |          64 |  55.1724137931034448 |
| img.XX.features.properties.exif:focalplanexresolution       | String                  |          64 |  55.1724137931034448 |
| img.XX.features.properties.exif:focalplaneyresolution       | String                  |          64 |  55.1724137931034448 |
| img.XX.exif.subSecTime                                      | Number                  |          62 |  53.4482758620689680 |
| img.XX.features.properties.exif:subsectime                  | String                  |          62 |  53.4482758620689680 |
| img.XX.features.properties.exif:artist                      | String                  |          61 |  52.5862068965517224 |
| img.XX.exif.artist                                          | String                  |          59 |  50.8620689655172384 |
| img.XX.exif.gpsMapDatum                                     | String                  |          59 |  50.8620689655172384 |
| img.XX.exif.gpsStatus                                       | String                  |          59 |  50.8620689655172384 |
| img.XX.exif.gpsVersionID                                    | String                  |          59 |  50.8620689655172384 |
| img.XX.features.properties.exif:gpsmapdatum                 | String                  |          59 |  50.8620689655172384 |
| img.XX.features.properties.exif:gpsstatus                   | String                  |          59 |  50.8620689655172384 |
| img.XX.features.properties.exif:gpsversionid                | String                  |          59 |  50.8620689655172384 |
| img.XX.features.profiles.copyright                          | String                  |          57 |  49.1379310344827616 |
| img.XX.features.profiles.description                        | String                  |          57 |  49.1379310344827616 |
| img.XX.features.profiles.manufacturer                       | String                  |          57 |  49.1379310344827616 |
| img.XX.features.profiles.model                              | String                  |          57 |  49.1379310344827616 |
| img.XX.features.profiles.profile-icc                        | String                  |          57 |  49.1379310344827616 |
| img.XX.exif.gpsDop                                          | Number                  |          56 |  48.2758620689655160 |
| img.XX.features.properties.exif:gpsdop                      | String                  |          56 |  48.2758620689655160 |
| img.XX.predictionsCocoSsd.XX.bbox                           | Array                   |          55 |  47.4137931034482776 |
| img.XX.predictionsCocoSsd.XX.class                          | String                  |          55 |  47.4137931034482776 |
| img.XX.predictionsCocoSsd.XX.score                          | Number                  |          55 |  47.4137931034482776 |
| img.XX.exif.gpsMeasureMode                                  | String                  |          54 |  46.5517241379310320 |
| img.XX.exif.gpsSatellites                                   | String                  |          54 |  46.5517241379310320 |
| img.XX.features.properties.exif:gpsmeasuremode              | String                  |          54 |  46.5517241379310320 |
| img.XX.features.properties.exif:gpssatellites               | String                  |          54 |  46.5517241379310320 |
| img.XX.exif.resolutionUnit                                  | Number                  |          52 |  44.8275862068965552 |
| img.XX.features.properties.exif:resolutionunit              | String                  |          49 |  42.2413793103448256 |
| img.XX.features.profile-iptc                                | String                  |          48 |  41.3793103448275872 |
| img.XX.features.profiles.profile-iptc                       | String                  |          46 |  39.6551724137931032 |
| img.XX.features.profiles.city[1,90]                         | String                  |          45 |  38.7931034482758648 |
| img.XX.features.profiles.unknown[2,0]                       | String                  |          45 |  38.7931034482758648 |
| img.XX.features.profiles.created date[2,55]                 | String                  |          42 |  36.2068965517241352 |
| img.XX.features.profiles.created time[2,60]                 | String                  |          42 |  36.2068965517241352 |
| img.XX.features.profiles.unknown[2,62]                      | String                  |          42 |  36.2068965517241352 |
| img.XX.features.profiles.unknown[2,63]                      | String                  |          42 |  36.2068965517241352 |
| img.XX.features.profiles.byline[2,80]                       | String                  |          37 |  31.8965517241379324 |
| img.XX.exif.orientation                                     | Number                  |          34 |  29.3103448275862064 |
| img.XX.features.properties.exif:orientation                 | String                  |          31 |  26.7241379310344840 |
| img.XX.features.city[1,90]                                  | String                  |          28 |  24.1379310344827580 |
| img.XX.features.unknown[2,0]                                | String                  |          28 |  24.1379310344827580 |
| img.XX.features.created date[2,55]                          | String                  |          26 |  22.4137931034482776 |
| img.XX.features.created time[2,60]                          | String                  |          26 |  22.4137931034482776 |
| img.XX.features.unknown[2,62]                               | String                  |          26 |  22.4137931034482776 |
| img.XX.features.unknown[2,63]                               | String                  |          26 |  22.4137931034482776 |
| imageObject.aperture                                        | String                  |          25 |  21.5517241379310356 |
| imageObject.author                                          | String                  |          25 |  21.5517241379310356 |
| imageObject.camera                                          | String                  |          25 |  21.5517241379310356 |
| imageObject.contentUrl                                      | String                  |          25 |  21.5517241379310356 |
| imageObject.description                                     | String                  |          25 |  21.5517241379310356 |
| imageObject.focal                                           | String                  |          25 |  21.5517241379310356 |
| imageObject.iso                                             | String                  |          25 |  21.5517241379310356 |
| imageObject.lens                                            | String                  |          25 |  21.5517241379310356 |
| imageObject.loc.type                                        | String                  |          25 |  21.5517241379310356 |
| imageObject.name                                            | String                  |          25 |  21.5517241379310356 |
| imageObject.published                                       | Date                    |          25 |  21.5517241379310356 |
| imageObject.shutter                                         | String                  |          25 |  21.5517241379310356 |
| img.XX.features.byline[2,80]                                | String                  |          25 |  21.5517241379310356 |
| img.XX.features.properties.rdf:alt                          | String                  |          25 |  21.5517241379310356 |
| img.XX.exif.focalLengthIn35mmFilm                           | Number                  |          21 |  18.1034482758620676 |
| img.XX.exif.sensingMethod                                   | Number                  |          21 |  18.1034482758620676 |
| img.XX.exif.sceneType                                       | String                  |          20 |  17.2413793103448292 |
| img.XX.features.properties.exif:focallengthin35mmfilm       | String                  |          20 |  17.2413793103448292 |
| img.XX.features.properties.exif:sensingmethod               | String                  |          20 |  17.2413793103448292 |
| img.XX.features.properties.exif:scenetype                   | String                  |          19 |  16.3793103448275872 |
| img.XX.exif.brightnessValue                                 | Number (15),String (3)  |          17 |  14.6551724137931032 |
| img.XX.exif.gpsTimeStamp                                    | String                  |          17 |  14.6551724137931032 |
| img.XX.features.properties.exif:brightnessvalue             | String                  |          16 |  13.7931034482758612 |
| img.XX.features.properties.exif:gpstimestamp                | String                  |          16 |  13.7931034482758612 |
| img.XX.exif.yCbCrPositioning                                | String                  |          15 |  12.9310344827586210 |
| img.XX.exif.compression                                     | Number                  |          14 |  12.0689655172413790 |
| img.XX.exif.jpegInterchangeFormat                           | Number                  |          14 |  12.0689655172413790 |
| img.XX.exif.jpegInterchangeFormatLength                     | Number                  |          14 |  12.0689655172413790 |
| img.XX.exif.makerNote                                       | String                  |          14 |  12.0689655172413790 |
| img.XX.exif.gpsImgDirection                                 | Number                  |          13 |  11.2068965517241388 |
| img.XX.exif.gpsImgDirectionRef                              | String                  |          13 |  11.2068965517241388 |
| img.XX.exif.subjectArea                                     | String                  |          13 |  11.2068965517241388 |
| img.XX.features.properties.exif:makernote                   | String                  |          13 |  11.2068965517241388 |
| img.XX.features.properties.exif:ycbcrpositioning            | String                  |          13 |  11.2068965517241388 |
| img.XX.features.properties.exif:compression                 | String                  |          12 |  10.3448275862068968 |
| img.XX.features.properties.exif:gpsimgdirection             | String                  |          12 |  10.3448275862068968 |
| img.XX.features.properties.exif:gpsimgdirectionref          | String                  |          12 |  10.3448275862068968 |
| img.XX.features.properties.exif:jpeginterchangeformat       | String                  |          12 |  10.3448275862068968 |
| img.XX.features.properties.exif:jpeginterchangeformatlength | String                  |          12 |  10.3448275862068968 |
| img.XX.features.properties.exif:subjectarea                 | String                  |          12 |  10.3448275862068968 |
| img.XX.encoding                                             | String                  |          11 |   9.4827586206896548 |
| img.XX.ext                                                  | String                  |          11 |   9.4827586206896548 |
| img.XX.mimetype                                             | String                  |          11 |   9.4827586206896548 |
| img.XX.name                                                 | String                  |          11 |   9.4827586206896548 |
| img.XX.newFilename                                          | String                  |          11 |   9.4827586206896548 |
| img.XX.exif.gpsDateStamp                                    | String                  |          10 |   8.6206896551724146 |
| img.XX.exif.gpsDestBearing                                  | Number                  |           9 |   7.7586206896551726 |
| img.XX.exif.gpsDestBearingRef                               | String                  |           9 |   7.7586206896551726 |
| img.XX.exif.gpsSpeed                                        | Number                  |           9 |   7.7586206896551726 |
| img.XX.exif.gpsSpeedRef                                     | String                  |           9 |   7.7586206896551726 |
| img.XX.features.profiles.image name[2,5]                    | String                  |           9 |   7.7586206896551726 |
| img.XX.features.properties.exif:gpsdatestamp                | String                  |           9 |   7.7586206896551726 |
| img.XX.features.image name[2,5]                             | String                  |           8 |   6.8965517241379306 |
| img.XX.features.properties.exif:gpsdestbearing              | String                  |           8 |   6.8965517241379306 |
| img.XX.features.properties.exif:gpsdestbearingref           | String                  |           8 |   6.8965517241379306 |
| img.XX.features.properties.exif:gpsspeed                    | String                  |           8 |   6.8965517241379306 |
| img.XX.features.properties.exif:gpsspeedref                 | String                  |           8 |   6.8965517241379306 |
| img.XX.exif.sharpness                                       | Number                  |           7 |   6.0344827586206895 |
| img.XX.features.properties.exif:sharpness                   | String                  |           7 |   6.0344827586206895 |
| img.XX.exif.contrast                                        | String                  |           6 |   5.1724137931034484 |
| img.XX.exif.digitalZoomRatio                                | Number                  |           6 |   5.1724137931034484 |
| img.XX.exif.saturation                                      | Number                  |           6 |   5.1724137931034484 |
| img.XX.features.properties.exif:contrast                    | String                  |           6 |   5.1724137931034484 |
| img.XX.features.properties.exif:digitalzoomratio            | String                  |           6 |   5.1724137931034484 |
| img.XX.features.properties.exif:saturation                  | String                  |           6 |   5.1724137931034484 |
| img.XX.exif.compressedBitsPerPixel                          | Number                  |           5 |   4.3103448275862073 |
| img.XX.exif.fileSource                                      | String                  |           5 |   4.3103448275862073 |
| img.XX.exif.imageDescription                                | String                  |           5 |   4.3103448275862073 |
| img.XX.exif.lightSource                                     | Number                  |           5 |   4.3103448275862073 |
| img.XX.features.properties.exif:compressedbitsperpixel      | String                  |           5 |   4.3103448275862073 |
| img.XX.features.properties.exif:filesource                  | String                  |           5 |   4.3103448275862073 |
| img.XX.features.properties.exif:imagedescription            | String                  |           5 |   4.3103448275862073 |
| img.XX.features.properties.exif:lightsource                 | String                  |           5 |   4.3103448275862073 |
| img.XX.exif.exposureIndex                                   | Number                  |           4 |   3.4482758620689653 |
| img.XX.exif.gainControl                                     | Number                  |           4 |   3.4482758620689653 |
| img.XX.exif.subjectDistance                                 | Number                  |           4 |   3.4482758620689653 |
| img.XX.exif.subjectDistanceRange                            | Number                  |           4 |   3.4482758620689653 |
| img.XX.features.properties.exif:exposureindex               | String                  |           4 |   3.4482758620689653 |
| img.XX.features.properties.exif:gaincontrol                 | String                  |           4 |   3.4482758620689653 |
| img.XX.features.properties.exif:subjectdistance             | String                  |           4 |   3.4482758620689653 |
| img.XX.features.properties.exif:subjectdistancerange        | String                  |           4 |   3.4482758620689653 |
| img.XX.features.properties.photoshop:datecreated            | String                  |           4 |   3.4482758620689653 |
| img.XX.features.properties.xmp:createdate                   | String                  |           4 |   3.4482758620689653 |
| img.XX.features.properties.xmp:creatortool                  | String                  |           4 |   3.4482758620689653 |
| img.XX.features.properties.xmp:modifydate                   | String                  |           4 |   3.4482758620689653 |
| img.XX.exif.photometricInterpretation                       | Number                  |           3 |   2.5862068965517242 |
| img.XX.features.original transmission reference[2,103]      | String                  |           3 |   2.5862068965517242 |
| img.XX.features.profiles.keyword[2,25]                      | String                  |           3 |   2.5862068965517242 |
| img.XX.features.properties.exif:photometricinterpretation   | String                  |           3 |   2.5862068965517242 |
| img.XX.features.properties.rdf:bag                          | String                  |           3 |   2.5862068965517242 |
| img.XX.exif.copyright                                       | String                  |           2 |   1.7241379310344827 |
| img.XX.exif.deviceSettingDescription                        | String                  |           2 |   1.7241379310344827 |
| img.XX.exif.interoperabilityIndex                           | String                  |           2 |   1.7241379310344827 |
| img.XX.exif.interoperabilityOffset                          | String                  |           2 |   1.7241379310344827 |
| img.XX.exif.interoperabilityVersion                         | String                  |           2 |   1.7241379310344827 |
| img.XX.features.profiles.profile-app10                      | String                  |           2 |   1.7241379310344827 |
| img.XX.features.properties.aux:firmware                     | String                  |           2 |   1.7241379310344827 |
| img.XX.features.properties.aux:flashcompensation            | String                  |           2 |   1.7241379310344827 |
| img.XX.features.properties.aux:imagenumber                  | String                  |           2 |   1.7241379310344827 |
| img.XX.features.properties.aux:lens                         | String                  |           2 |   1.7241379310344827 |
| img.XX.features.properties.aux:lensid                       | String                  |           2 |   1.7241379310344827 |
| img.XX.features.properties.aux:serialnumber                 | String                  |           2 |   1.7241379310344827 |
| img.XX.features.properties.exif:copyright                   | String                  |           2 |   1.7241379310344827 |
| img.XX.features.properties.exif:devicesettingdescription    | String                  |           2 |   1.7241379310344827 |
| img.XX.features.properties.exif:interoperabilityindex       | String                  |           2 |   1.7241379310344827 |
| img.XX.features.properties.exif:interoperabilityoffset      | String                  |           2 |   1.7241379310344827 |
| img.XX.features.properties.exif:interoperabilityversion     | String                  |           2 |   1.7241379310344827 |
| img.XX.features.special instructions[2,40]                  | String                  |           2 |   1.7241379310344827 |
| img.XX.exif.tileLength                                      | String                  |           1 |   0.8620689655172413 |
| img.XX.exif.tileWidth                                       | String                  |           1 |   0.8620689655172413 |
| img.XX.features.copyright string[2,116]                     | String                  |           1 |   0.8620689655172413 |
| img.XX.features.profiles.copyright string[2,116]            | String                  |           1 |   0.8620689655172413 |
| img.XX.features.properties.aux:lensinfo                     | String                  |           1 |   0.8620689655172413 |
| img.XX.features.properties.exif:tilelength                  | String                  |           1 |   0.8620689655172413 |
| img.XX.features.properties.exif:tilewidth                   | String                  |           1 |   0.8620689655172413 |
| img.XX.features.properties.mwg-rs:appliedtodimensions       | String                  |           1 |   0.8620689655172413 |
| img.XX.features.properties.mwg-rs:regionlist                | String                  |           1 |   0.8620689655172413 |
+----------------------------------------------------------------------------------------------------------------------------+
