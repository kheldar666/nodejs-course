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

// const mongodb = require('mongodb')
// const getDb = require('../../utils/db-mongodb').getDb;

// const PRODUCTS_COLLECTION = "Products";
// class Product {
//     constructor(title, price, description, imageUrl, id, userId) {
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this._id = id;
//         this.userId = userId
//     }
    
//     static getEmptyProduct() {
//         return new Product('','','','https://www.odoo.com/web/image/res.users/601020/image_1024?unique=c28878c');
//     }
    
//     save() {
//         let dbOp;
//         if(this._id) {
//             dbOp = getDb().collection(PRODUCTS_COLLECTION)
//                 .updateOne({_id:this._id},{$set: this})     //Be careful with _id. MUST be a MongoDB ObjectID            
//         } else {
//             dbOp = getDb().collection(PRODUCTS_COLLECTION)
//                 .insertOne(this)
//         }
//         return dbOp;
//     }

//     static fetchAll() {
//         return getDb().collection(PRODUCTS_COLLECTION)
//             .find() // We could pass a filter here, but it is not useful in our case
//             .toArray() //Find does NOT return a Promise, but a Cursor. So or now we transform into an Array, later we will do Pagination
//             .then( products => {
//                 return products;
//             })
//             .catch(err => console(err))
//     }

//     static findByStringId(productId) {
//         return getDb().collection(PRODUCTS_COLLECTION)
//             .find({_id: new mongodb.ObjectId(productId)})
//             .next()
//             .then( product => {
//                 return product;
//             })
//             .catch(err => console.error(err))

//     }

//     static deleteByStringId(productId) {
//         return getDb().collection(PRODUCTS_COLLECTION)
//             .deleteOne({_id: new mongodb.ObjectId(productId)});
//     }

//     static getProductsbyIds(arrProductIds) {
//         return getDb().collection(PRODUCTS_COLLECTION)
//             .find({_id: {$in: arrProductIds}})
//             .toArray()
//     };

// }

// module.exports = Product;