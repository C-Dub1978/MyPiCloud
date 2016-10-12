/**
 * Created by foolishklown on 10/2/2016.
 */

var Grid = require('gridfs-stream'),
    User = require('../../models/user'),
    mongoose = require('mongoose');


module.exports = function(id, ref, type, res) {
    console.log(ref.green);
    Grid.mongo = mongoose.mongo;

    var conn = mongoose.createConnection('mongodb://localhost/media', (err) => {
        if(err) {
            console.error('cant connect to instance to delete'.red);
        } else {
            console.info('connected successfully, trying to delete'.cyan);
        }
    });

    conn.once('open', () => {
        console.log('opened'.green);
        var gfs = Grid(conn.db);

        gfs.files.remove({
            _id: ref
        },(err) => {
            if(err) {
                return handleError(err);
            }
            console.log('removed : ', ref);
            deleteFromUserDb(id, type, ref);
            res.status(200).send({id: id, type: type, ref: ref});
            }
        )
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