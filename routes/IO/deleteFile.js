/**
 * Created by foolishklown on 10/2/2016.
 */

var Grid = require('gridfs-stream'),
    User = require('../../models/user'),
    mongoose = require('mongoose');


module.exports = function(id, ref, type, res) {
    console.log(ref.green);
    Grid.mongo = mongoose.mongo;

    var objId = mongoose.mongo.ObjectId(ref);
    console.log('TEST'.yellow);
    console.log(objId);

    var conn = mongoose.createConnection('mongodb://localhost/media');
    conn.once('open', function () {
        var gfs = Grid(conn.db);
        gfs.exist({_id: objId}, function(err, found) {
            if(err) {
                console.error('error finding file'.red);
            } else {
                console.info('found file', found);
                gfs.remove({_id: objId }, function(err) {
                    if(err) {
                        console.error('error removing that file');
                        process.exit(1);
                    } else {
                        console.info('removed file: ', found.green);
                        deleteFromUserDb(id, type, ref);
                        res.status(200).send({id: id, type: type, ref: ref});
                    }
                });
            }
        });
    });
    conn.close();

    function deleteFromUserDb(userId, fileType, refId) {
        var userConn = mongoose.createConnection('mongodb://localhost/mean-auth', (error) => {
            if(error) {
                console.error('Error connecting to the mean-auth instance'.red);
                process.exit(1);
            } else {
                User.findById(userId, (err, doc) => {
                    if(err) {
                        console.error('Error finding user with id: ', uid);
                        process.exit(1);
                    } else {
                        console.log('original doc: ', doc);
                        doc.removeMedia(fileType, refId);
                        doc.save();
                        console.log('new doc: ', doc);
                    }
                })
            }
        });
    }
};