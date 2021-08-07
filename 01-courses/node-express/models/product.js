const fs = require('fs');
const path = require('path');
const rootDir = require('../utils/path');
const saveToFile = path.join(rootDir,'data','products.json');

const getProductFromFile = (callback) => {
    fs.readFile(saveToFile, (err, fileContent)=>{
        let products = [];
        if(!err) {
            products = JSON.parse(fileContent);
        }
        callback(products);
    });
}

module.exports = class Product {
    constructor(title,imageUrl,description, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductFromFile((products) => {
            products.push(this);
            fs.writeFile(saveToFile,JSON.stringify(products),(err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(callback) {
        getProductFromFile(callback);
    }

    static getEmptyProduct() {
        return new Product('','','',0.00);
    }

    static getProduct(id) {
        return new Product('Edit Title','Edit Image','Edit Description',6.66);
    }
}