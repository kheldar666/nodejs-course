const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema ({
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
    }],
    orderedBy: {
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model('Order', orderSchema);