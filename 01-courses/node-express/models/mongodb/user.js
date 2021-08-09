const mongodb = require('mongodb')
const getDb = require('../../utils/db-mongodb').getDb;

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
            return cp._id.equals(product._id);
        })

        if(cartProductIndex > -1) {
            const newQty = this.cart.items[cartProductIndex].quantity + 1;
            this.cart.items[cartProductIndex].quantity = newQty;
        } else {
            this.cart.items.push({...product, quantity:1})
        }

        return getDb().collection(USERS_COLLECTION)
            .updateOne(
                {_id:this._id},
                {$set : {cart: this.cart}}
            )
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