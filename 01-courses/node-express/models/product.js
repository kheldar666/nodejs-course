const fs = require('fs');

const db = require('../utils/database');

module.exports = class Product {
    constructor(title,imageUrl,description, price) {
        this.id=-1;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        if (this.id !== -1) {
            // const updatedProducts = products.map(product => {
            //     if(product.id === this.id)
            //         return this;
            //     else
            //         return product;
            // })
            // saveProductsToFile(updatedProducts);
        } else {
            return db.execute('insert into products ' 
                    + '(title, price, imageUrl, description) ' 
                    + 'values (?, ?, ?, ?)',
                    [this.title, this.price, this.imageUrl, this.description]);
        }
    }

    static fetchAll() {
        return db.execute('select * from products');
    }

    static getEmptyProduct() {
        // Use a default dummy image
        return new Product('','https://www.odoo.com/web/image/res.users/601020/image_1024?unique=c28878c','',0.00);
    }

    static findByid(id) {
        return db.execute('select * from products where id= ?', [id]);
    }

    static deleteById(id) {

    }
}