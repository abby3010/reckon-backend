
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://fungtrix:H0TOOWF7irmhbM5D@cluster0.xax6rgd.mongodb.net/?retryWrites=true&w=majority";
let _db;
exports.connection = {

    connectToServer: (callback) => {
        MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
            _db = client.db('test');
            return callback(err);
        });
    },

    getDb: function () {
        return _db;
    }
};
