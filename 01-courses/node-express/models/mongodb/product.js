const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema ({
    title:{
        type: String,
        required: true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    imageUrl:{
        type:String,
        required:true,
        default:'https://www.odoo.com/web/image/res.users/601020/image_1024?unique=c28878c'
    },
    createdBy: {
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model('Product', productSchema);
