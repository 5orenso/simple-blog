/* eslint-disable */
db.category.find().forEach( function(cat) {
    cat.menu = 1;
    db.category.save(cat);
})
