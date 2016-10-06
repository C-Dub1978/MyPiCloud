/**
 * Created by foolishklown on 8/27/2016.
 */
var mongoose = require('mongoose'),
    path = require('path'),
    Grid = require('gridfs-stream'),
    fs = require('fs');

module.exports = function(file, userId, fileType, res) {
    console.log('called the write file for gridfs');
    console.log('file is: ', file);
    var conn = mongoose.createConnection('mongodb://localhost/'.concat(userId), (error) => {
        if(error) {
            console.error('Error connecting to mongod instance'.red);
            process.exit(1);
        } else {
            console.info('Connected successfully to mongod instance in the write file!'.blue);
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
            type: fileType
        });

        // Create a read stream, so that we can read its data, and then with that well use the
        //  write stream to write to the DB via piping the writestream
        var readStream = fs.createReadStream(myFile)
            .on('end', () => {
                console.log('read stream: ', readStream);
                res.status(200).send({id: readStream.id, type: fileType, user: userId});
            })
            .on('error', () => {
                res.status(500).send('error in writing with gridfs');
            })
            .pipe(writeStream);

        //fs.createReadStream(myFile).pipe(writeStream);

        writeStream.on('close', function (file) {
            console.log(file.filename + 'written to DB');
            setTimeout(() => {
                fs.unlink(myFile);
            });
            conn.close();
        });
    });

};