/**
 * Created by cdub on 8/30/2016.
 */
var mongoose = require('mongoose'),
    Grid = require('gridfs-stream'),
    User = require('../../models/user'),
    files = {};

module.exports = function(req, res) {
    var uid = req.query.id;
    var conn = mongoose.createConnection('mongodb://localhost/mean-auth', (err) =>  {
          if(err) {
              console.error('Error connecting to mean-auth instance to read all');
              process.exit(1);
          } else {
              User.findById(uid, (err, doc) => {
                  if(err) {
                      console.error('Error finding user with id: ', uid);
                      process.exit(1);
                  } else {
                      if(doc) {
                          console.log('original doc: ', doc);
                          res.status(200).send({media: doc.media});
                      } else {
                          res.status(200);
                      }
                  }
              })
          }
    });
};