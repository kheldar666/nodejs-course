const mongodb = require('mongodb')
const getDb = require('../../utils/db-mongodb').getDb;
const Product = require('./product');

const USERS_COLLECTION = "Users";
class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this._id = id;
        if(!cart) {
            this.cart = {items: []}
        } else {
            this.cart = cart;
        }
    }
    
    save() {
        return getDb().collection(USERS_COLLECTION)
            .insertOne(this);
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex( cp => {
            return cp.productId.toString() === product._id.toString();
        })

        if(cartProductIndex > -1) {
            const newQty = this.cart.items[cartProductIndex].quantity + 1;
            this.cart.items[cartProductIndex].quantity = newQty;
        } else {
            this.cart.items.push({productId:product._id, quantity:1})
        }

        return getDb().collection(USERS_COLLECTION)
            .updateOne(
                {_id:this._id},
                {$set : {cart: this.cart}}
            )
    }

    getCartWithProducts() {
        return Product.getProductsFromCart(this.cart)
        .then( arrProducts =>{
            const updatedCart = arrProducts.map( product => {
                return {
                    ...product,
                    quantity:this.cart.items.find(i => {
                        return i.productId.toString() === product._id.toString()
                    }).quantity
                }
            })
           return updatedCart
        })
        .catch(err => console.error(err))
    }

    static findByStringId(userId) {
        return getDb().collection(USERS_COLLECTION)
            .findOne({_id: new mongodb.ObjectId(userId)});

    }

    static getNewUser (jsonUser) {
        return new User(
            jsonUser.username,
            jsonUser.email,
            jsonUser.cart,
            jsonUser._id
        )
    }

}

module.exports = User;