/**
 * Created by foolishklown on 10/13/2016.
 */
var assert = require('assert'),
    path = require('path'),
    Grid = require('gridfs-stream'),
    fs = require('fs'),
    mongodb = require('mongodb'),
    mongoose = require('mongoose'),
    User = require('../../models/user'),
    mediaUri = 'mongodb://localhost/media',
    userUri = 'mongodb://localhost/mean-auth';

module.exports = {
    writeFile: function (file, userId, fileType, fileInfo, res) {
        var fileId;
        var fileTitle = file.originalFilename;
        var conn = mongoose.createConnection(mediaUri, (error) => {
            if (error) {
                console.error('Error connecting to mongod media instance'.red);
                process.exit(1);
            } else {
                console.info('Connected successfully to mongod media instance in the write file!'.blue);
            }
        });
        // The following line is designating a file to grab/read, and save into mongo
        //  in our case it will be something from ng-file-upload that the user wants to upload
        var myFile = file.path;

        // Connect gridFs and mongo
        Grid.mongo = mongoose.mongo;

        conn.once('open', function () {
            console.log('connection open, ready for I/O!');
            var gfs = Grid(conn.db);

            // This write stream is how well write to mongo
            var writeStream = gfs.createWriteStream({
                // Name the file the way you want it stored in mongo
                filename: file.originalFilename,
                type: fileType,
                info: fileInfo
            });

            // Create a read stream, so that we can read its data, and then with that well use the
            //  write stream to write to the DB via piping the writestream
            var readStream = fs.createReadStream(myFile)
                .on('end', () => {
                    writeToUserDb(userId, fileType, readStream.id, fileInfo, fileTitle);
                    res.status(200).send(
                        {
                            ref: readStream.id,
                            type: fileType,
                            user: userId,
                            mediaInfo: fileInfo,
                            title: fileTitle
                        }
                    );
                })
                .on('error', () => {
                    res.status(500).send('error in writing with gridfs');
                })
                .pipe(writeStream);

            writeStream.on('close', function (file) {
                console.log(file.filename + 'written to DB');
                fs.unlink(myFile);
                myFile = null;
                conn.close();
            });
        });

        function writeToUserDb(uid, type, fileId, authInfo, title) {
            var userConn = mongoose.createConnection(userUri, (error) => {
                if (error) {
                    console.error('Error connecting to the mean-auth instance'.red);
                    process.exit(1);
                } else {
                    User.findById(uid, (err, doc) => {
                        if (err) {
                            console.error('Error finding user with id: ', uid);
                            process.exit(1);
                        } else {
                            console.log('original doc: ', doc);
                            doc.addMedia(type, fileId, authInfo, title);
                            doc.save();
                            console.log('new doc: ', doc);
                        }
                    })
                }
            });
            userConn.close();
        }
    },

    downloadFile: function (uid, objId, location, name, res) {
        var id = new mongodb.ObjectID(objId);
        
        console.log('called the read file for gridfs');
        console.log('file is: ', id);
        var conn = mongoose.createConnection(mediaUri, (error) => {
            if(error) {
                console.error('Error connecting to mongod instance'.red);
                process.exit(1);
            } else {
                console.info('Connected successfully to mongod instance in the write file!'.blue);
            }
        });

        var gfs = Grid(conn.db, mongoose.mongo);
        gfs.findOne({ _id: id}, function (err, file) {
            if (err) {
                return res.status(400).send(err);
            }
            else if (!file) {
                return res.status(404).send('Error on the database looking for the file.');
            }
            res.set('Content-Type', file.contentType);
            res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');

            var readstream = gfs.createReadStream({
                _id: id
            });

            var writeStream = gfs.createWriteStream('./');

            readstream.on("error", function(err) {
                res.end();
            });
            readstream.pipe(writeStream);
            res.status(200).send('Downloaded file');
        });
    },

    deleteFile: function (userId, fileType, objId, res) {
        var client = mongodb.MongoClient;
        var id = new mongodb.ObjectID(objId);

        client.connect(mediaUri, (err, db) => {
            db.collection('fs.files', {}, (err, files) => {
                files.remove({_id: id}, (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500);
                    }
                    console.info('deleted from fs.files: ', id);
                });
            });
            db.collection('fs.chunks', {}, (err, chunks) => {
                chunks.removeMany({files_id: id}, (err, result) => {
                    if (err) {
                        console.log(err);
                        res.status(500);
                    }
                    console.info('deleted from fs.chunks: ', id);
                });
            });
            db.close();
            deleteFromUserDb(userId, fileType, objId);
        });

        function deleteFromUserDb(userId, fileType, refId) {
            console.log('called to delete from user db without a \'this\' reference'.blue);
            console.log('user id passed is: ', userId);
            console.log('reference for the grid _id is: ', refId);
            var userConn = mongoose.createConnection(userUri, (error) => {
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
        res.status(200).send({id: userId, type: fileType, ref: id});
    },

    getAll: function (req, res) {
        var uid = req.query.id;
        var conn = mongoose.createConnection(userUri, (err) => {
            if (err) {
                console.error('Error connecting to mean-auth instance to read all');
                process.exit(1);
            } else {
                User.findById(uid, (err, doc) => {
                    if (err) {
                        console.error('Error finding user with id: ', uid);
                        process.exit(1);
                    } else {
                        if (doc) {
                            console.log('original doc: ', doc);
                            res.status(200).send({media: doc.media});
                        } else {
                            res.status(200);
                        }
                    }
                })
            }
        });
    }
};