const mongodb = require('mongodb');
const config = require('../configurations/mongodb');

const MongoClient = mongodb.MongoClient;

let _db;

// Setting Up MongoDB
const mongoConnect = (callback) => {
    MongoClient.connect(config.connectionString)
        .then( client => {
            console.info('Connection to MongoDB established !');
            _db = client.db('shopDb') //Overwrite the default value from the connection string
            callback(client);
        })
        .catch(err => {
            console.error(err);
            throw(err);
        });

}

const getDb = () => {
    if(_db) {
        return _db;
    }
    throw 'No Database Found !'
}

module.exports.mongoConnect = mongoConnect ;
module.exports.getDb = getDb ;