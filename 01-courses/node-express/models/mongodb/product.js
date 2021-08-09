const getDb = require('../../utils/db-mongodb').getDb;

class Product {
    constructor(title, price, description, imageUrl) {
        this.title = title;
        this.price = price;
        this.description = description,
        this.imageUrl = imageUrl
    }

    save() {
        const db = getDb();
        return db.collection('Products')
            .insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch( err => console.error(err));
    }

    static getEmptyProduct() {
        return new Product('','','','https://www.odoo.com/web/image/res.users/601020/image_1024?unique=c28878c');
    }
}

module.exports = Product;