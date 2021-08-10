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
                required:true
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

    newOrder.orderedBy.user = this;
    newOrder.orderedBy.username = this.name;

    return newOrder.save()
        .then( result => {
            this.cart = {items:[]}
            return this.save()
        })
        .catch( err => console.error(err))
}

module.exports = mongoose.model('User', userSchema);