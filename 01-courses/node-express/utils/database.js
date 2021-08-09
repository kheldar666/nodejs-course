const Sequelize = require('sequelize');
const mongodb = require('mongodb');

// Setting Up Sequelize
const sequelize = new Sequelize('node-express','root','admin',{
    dialect:'mysql',
    host:'localhost',
    logging: false
});
module.exports.sequelize = sequelize;
 

// Setting Up MongoDB
const MongoClient = mongodb.MongoClient;
const mongoConnect = (callback) => {
    MongoClient.connect('mongodb+srv://node-express-course:Jw8V2KptBuLPa2wY@node-express-course.spaol.mongodb.net/node-express-course?retryWrites=true&w=majority')
        .then( client => {
            console.info('Connection to MongoDB established !');
            callback(client);
        })
        .catch(err => console.error(err));

}
module.exports.mongoConnect = mongoConnect ;