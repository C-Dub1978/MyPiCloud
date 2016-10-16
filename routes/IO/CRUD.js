/**
 * Created by foolishklown on 10/13/2016.
 */
var assert = require('assert'),
    fs = require('fs'),
    mongodb = require('mongodb'),
    mongoose = require('mongoose'),
    User = require('../../models/user'),
    mediaUri = 'mongodb://localhost/media',
    userUri = 'mongodb://localhost/mean-auth';

module.exports = {
    writeFile: function(userId, file, fileType, authInfo, title, res) {
        var readStreamId;
        mongodb.MongoClient.connect(mediaUri, (error, db) => {
            assert.ifError(error);

            var bucket = new mongodb.GridFSBucket(db);

            var readStream = fs.createReadStream(file);
                readStream.pipe(bucket.openUploadStream(file))
                .on('error', (error) => {
                    assert.ifError(error);
                })
                .on('finish', () => {
                    console.info('Wrote to db: ', file);
                    readStreamId = readStream.id;
                    console.log('readStreamid: ', readStreamId);
                    process.exit(0);
                });
        });

        var userConn = mongoose.createConnection('mongodb://localhost/mean-auth', (error) => {
            if(error) {
                console.error('Error connecting to the mean-auth instance'.red);
                process.exit(1);
                res.status(400).send(error);
            } else {
                User.findById(uid, (err, doc) => {
                    if(err) {
                        console.error(err);
                        process.exit(1);
                        res.status(404).send('Cant find that user with id: ', userId);
                    } else {
                        console.log('original doc: ', doc);
                        doc.addMedia(fileType, readStreamId, authInfo, title);
                        doc.save();
                        console.log('new doc: ', doc);
                    }
                })
            }
        });
        userConn.close();
        res.status(200).send({id: userId, type: fileType, ref: readStreamId, title: title});
    },

    downloadFile: function(userId, file, fileType, objId, location, res) {
        var conn = mongoose.createConnection(mediaUri, (error) => {
            assert.ifError(error);

            var gfs = Grid(conn.db, mongoose.mongo);

            gfs.findOne({_id: objId}, (err, doc) => {
                if(err) {
                    res.status(400).send(err);
                } else if(!doc) {
                    res.status(404).send('Error finding file')
                } else {
                    res.set('Content-Type', doc.contentType);
                    res.set('Content-Disposition', 'attachment; filename="' + doc.filename + '"');
                    var readStream = gfs.createReadStream({
                        _id: objId,
                        root: 'resume'
                    });

                    readStream.on('error', (err) => {
                        res.end();
                    });
                    readStream.pipe(res);
                }
            });
        });
        conn.close();
    },

    deleteFile: function(userId, fileType, objId, res) {
        var client = mongodb.MongoClient;
        console.log('object id to find is: ', objId);
        client.connect('mongodb://localhost/media', function(err, db) {
            db.collection('fs.files', {}, function(err, files) {
                files.remove({filename: "02 Random.mp3"}, function(err, result) {
                    if (err) {
                        console.log(err);
                    }
                    console.log(result);
                    db.close();
                    res.send(200);
                });
            });
        });
    }

};