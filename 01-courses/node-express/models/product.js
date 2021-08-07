const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');
const saveToFile = path.join(rootDir,'data','products.json');

const getProductsFromFile = (callback) => {
    fs.readFile(saveToFile, (err, fileContent)=>{
        let products = [];
        if(!err) {
            products = JSON.parse(fileContent);
        }
        callback(products);
    });
}

const saveProductsToFile = (products) => {
    fs.writeFile(saveToFile,JSON.stringify(products),(err) => {
        console.log(err);
    });
}

module.exports = class Product {
    constructor(title,imageUrl,description, price) {
        this.id=-1;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            if (this.id !== -1) {
                const updatedProducts = products.map(product => {
                    if(product.id === this.id)
                        return this;
                    else
                        return product;
                })
                saveProductsToFile(updatedProducts);
            } else {
                this.id = Math.random().toString().split('.')[1];
                products.push(this);
                saveProductsToFile(products);
            }
        });
    }

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }

    static getEmptyProduct() {
        // Use a default dummy image
        return new Product('','https://www.odoo.com/web/image/res.users/601020/image_1024?unique=c28878c','',0.00);
    }

    static findByid(id, callback) {
        getProductsFromFile(products => { 
            const product = products.find(p => p.id === id)
            callback(product);
        });
    }

    static deleteById(id, callback) {
        getProductsFromFile(products => {
            for (let index = 0; index < products.length; index++) {
                const product = products[index];
                if(product.id === id) {
                    products.splice(index,1);
                    break;
                }
            }
            
            saveProductsToFile(products);
        });
    }
}