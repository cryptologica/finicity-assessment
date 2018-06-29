// Modules
const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const app = express();

// Constants
const db = require('./config/db');
const port = 8000;

// Used to parse URL parameters
app.use(bodyParser.urlencoded({
    extended: true
}));

// Connect to DB and start the server
MongoClient.connect(db.url, { useNewUrlParser: true }, (err, database) => {
    if (err) return console.log(err);
    database = database.db("finicity");
    require('./app/routes')(app, database);
    app.listen(port, () => {
        console.log('Listening on port ' + port + '...');
    });
})