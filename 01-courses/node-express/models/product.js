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
    constructor(title) {
        this.title = title;
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
}