const Product = require("./product");
const User = require("./user");
const Cart = require("./cart");
const CartItem = require("./cart-item");
const Order = require("./order");
const OrderItem = require("./order-item");

//Creating Relations between Models
Product.belongsTo(User, {contraints:true, onDelete:'CASCADE'});
Product.belongsToMany(Cart, {through: CartItem})
Product.belongsToMany(Order, {through: OrderItem})

User.hasMany(Product);
User.hasOne(Cart);
User.hasMany(Order);

Cart.belongsTo(User, {contraints:true, onDelete:'CASCADE'});
Cart.belongsToMany(Product, {through: CartItem});

Order.belongsTo(User, {contraints:true, onDelete:'CASCADE'});
Order.belongsToMany(Product, {through: OrderItem});