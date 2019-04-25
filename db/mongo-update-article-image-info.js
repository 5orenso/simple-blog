
db.image.find({
    exif: { $exists: 1 },
    stats: { $exists: 1 },
    features: { $exists: 1 },
    predictions: { $exists: 1 },
    predictionsCocoSsd: { $exists: 1 },
}).forEach( function(img) {
    print( 'img: ' + img.src);
    db.article.update({
        "img.src": img.src
    }, {
        $set: {
            "img.$.exif": img.exif,
            "img.$.geo": img.geo,
            "img.$.stats": img.stats,
            "img.$.features": img.features,
            "img.$.predictions": img.predictions,
            "img.$.predictionsCocoSsd": img.predictionsCocoSsd
        }
    });
});


// db.article.find({ "img.src": "film/varangerhalvoya-nasjonalpark-dag-1-div-3.jpg" })
//
// db.article.update({
//     "img.src": "film/varangerhalvoya-nasjonalpark-dag-1-div-3.jpg"
// }, {
//     $set: {
//         "img.$.exif": {},
//         "img.$.stats": {},
//         "img.$.features": {},
//         "img.$.predictions": {},
//         "img.$.predictionsCocoSsd": {},
//     }
// })
//
// db.student.update({name:'student_1','courses.name':'Algebra'},{$inc:{"courses.$.grades.1":10}})
