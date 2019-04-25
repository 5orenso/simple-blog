db.article.find().forEach( function(art) {
    if (art.tags) {
        for(let i = 0; i < art.tags.length; i++) {
            art.tags[i] = art.tags[i].toLowerCase();
        }
        print(art.tags);
        db.article.save(art);
    }
})
