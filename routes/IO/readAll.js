/**
 * Created by cdub on 8/30/2016.
 */
var mongoose = require('mongoose'),
    Grid = require('gridfs-stream'),
    user = '',
    files = {};

module.exports = function(req, res) {
    user = req.params.id;
    var Url = 'mongodb://localhost:27017/Media';
    mongo.connect(Url, function(err, db) {
          if(err) {
              console.error('Error connecting to mongo to read all');
              process.exit(1);
          } else {
              // here we will pass the user's array of media objects, loop through, find all, then send the array
              // of object id's to have angular show with ng-repeat
              var userCollection = db.collection('fs.files');
              userCollection.find({}).toArray(function(err, docs) {
                  console.log('media docs');
                  console.log(docs);
                  db.close();
                  res.sendFile(__dirname + docs);
              });
          }
    });
};