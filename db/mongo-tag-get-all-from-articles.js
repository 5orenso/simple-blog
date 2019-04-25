db.article.distinct('tags', {}).forEach( function(tag) {
    print( 'tag: ' + tag);
    if (tag !== null) {
        const total = db.tag.find({ title: tag }).count();
        print( 'total: ' + total);
        if (!total) {
            const seq = db.sequence.findAndModify({
                query: { name: 'tag' },
                update: { $inc: { seq: 1 } },
            });
            db.tag.insert({ id: seq.seq, title: tag });
        }
    }
})
