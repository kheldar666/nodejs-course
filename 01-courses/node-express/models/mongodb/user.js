const mongoose = require('mongoose')
require('mongoose-type-email')

const Schema = mongoose.Schema
const Order = require('./order')

const userSchema = new Schema({
    name : { 
        type:String,
        required:true
    },
    email: {
        type:Schema.Types.Email,
        require:true
    },
    cart: {
        items : [{
            product:{
                type:Schema.Types.ObjectId,
                required:true,
                ref:'Product'
            },
            quantity:{ 
                type:Number,
                require:true
            }
        }]
    }

})

userSchema.methods.addToCart = function(product) { // Do not use arrow function => Allows to use the 'this' properly
    const cartProductIndex = this.cart.items.findIndex( cp => {
        return cp.product.toString() === product._id.toString();
    })

    if(cartProductIndex > -1) {
        const newQty = this.cart.items[cartProductIndex].quantity + 1;
        this.cart.items[cartProductIndex].quantity = newQty;
    } else {
        this.cart.items.push({product:product, quantity:1})
    }

    this.save();
}

userSchema.methods.removeFromCart = function (productId) {
    const updatedOrderItems = this.cart.items.filter ( item => {
        return item.product.toString() !== productId.toString()
    });
    this.cart.items = updatedOrderItems;
    return this.save()
}

userSchema.methods.createOrder = function() {
    const newOrder = new Order();
    newOrder.items = this.cart.items;
    newOrder.orderedBy = this;
    return newOrder.save()
        .then( result => {
            this.cart = {items:[]}
            return this.save()
        })
        .catch( err => console.error(err))
}

module.exports = mongoose.model('User', userSchema);

//     createOrder() {
//         return this.getCartWithProducts()
//             .then( products => {
//                 const order = {
//                     items:products,
//                     user:{_id:this._id,username:this.username}
//                 }
//                 return getDb().collection(ORDERS_COLLECTION)
//                     .insertOne(order)
//                     .then( result => {
//                         return this.clearCart();
//                     })
//                     .catch( err => console.error(err))
//             })

//     }

//     clearCart() {
//         this.cart = {items: []};
//         return getDb().collection(USERS_COLLECTION)
//                 .updateOne(
//                     {_id:this._id},
//                     {$set : {cart : this.cart}}
//                 )
//     }

//     getOrders() {
//         return getDb().collection(ORDERS_COLLECTION)
//             .find({'user._id':this._id}).toArray()
//     }

//     static findByStringId(userId) {
//         return getDb().collection(USERS_COLLECTION)
//             .findOne({_id: new mongodb.ObjectId(userId)});

//     }

//     static getNewUser (jsonUser) {
//         return new User(
//             jsonUser.username,
//             jsonUser.email,
//             jsonUser.cart,
//             jsonUser._id
//         )
//     }

// }

// module.exports = User;