const fs = require('fs')
const path = require('path');
const rootDir = require('../utils/path');
const saveToFile = path.join(rootDir,'data','cart.json');

module.exports = class Cart {
    static addProduct(product) {
        //fetch previous cart
        this.loadCart(cart => {
            const productId = product.id;
            const price = product.price;
            
            let itemFound = false;
            cart.items.map(item => {
                if(item.productId === productId) {
                    itemFound = true;
                    item.qty = Number(item.qty) + 1; 
                }
            })
            if(!itemFound) {
                cart.items.push({productId:productId,qty:1})
            }
    
            cart.totalPrice = Number(cart.totalPrice) + Number(price);

            this.saveCart(cart);
        })
    }

    static removeProduct(product) {
        this.loadCart(cart => {
            for (let index = 0; index < cart.items.length; index++) {
                const item = cart.items[index];
                if(item.productId === product.id){
                    const removeValue = Number(item.qty)*product.price;
                    cart.items.splice(index,1);
                    cart.totalPrice = Number(cart.totalPrice) - removeValue;
                }
            }
            this.saveCart(cart);
        })
    }
    
    static loadCart(callback) {
        fs.readFile(saveToFile,(err, fileContent) => {
            let cart = {items:[], totalPrice:0 };
            if(!err) {
                cart = JSON.parse(fileContent);
            }
            callback(cart);
        })
    }
    
    static saveCart(cart) {
        fs.writeFile(saveToFile,JSON.stringify(cart),(err) => {
            console.log(err);
        });
    }
}