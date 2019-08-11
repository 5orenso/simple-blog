/* eslint-disable */
db.article.find({}).forEach( function(art) {
    print(`${art.title}: ${art.category}`);
    if (art.category) {
        db.category.find({ $or: [
            { title: art.category },
            { url: { $regex: art.category } }
        ]}).forEach(function(cat) {
            print(`\t${cat.title}: ${cat.id}`);
            art.categoryId = parseInt(cat.id, 10);
            db.article.save(art);
        });
    }
    print('done');
})