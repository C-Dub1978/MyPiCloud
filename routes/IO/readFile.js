/**
 * Created by foolishklown on 8/27/2016.
 */
var mongoose = require('mongoose'),
    path = require('path'),
    Grid = require('gridfs-stream'),
    fs = require('fs'),
    buffer = '';

module.exports = function(fileId, res) {
    console.log('called the read file for gridfs');
    console.log('file is: ', fileId);
    var conn = mongoose.createConnection('mongodb://localhost/Media', (error) => {
        if(error) {
            console.error('Error connecting to mongod instance'.red);
            process.exit(1);
        } else {
            console.info('Connected successfully to mongod instance in the read file!'.blue);
        }
    });

    // Connect gridFs and mongo
    Grid.mongo = mongoose.mongo;

    conn.once('open', function() {
        console.log('connection open for reading!!!');
        var gfs = Grid(conn.db);

        // This will be the write stream to write to our local filesystem, using the read stream
        //  that well create next
        var dbWriteStream = fs.createWriteStream({filename: fileName});

        // Create the read stream, well be using it to read the information from mongo so that we
        //  can write it to the above write stream. Here we can use a filename or an ObjectID
        fs.createReadStream(fileName).pipe(dbWriteStream);

        dbWriteStream.on('close', function() {
            readStream = gfs.createReadStream({filename: fileName});

            readStream.on('data', function(chunk) {
                buffer += chunk;
            });

            readStream.on('end', function() {
                console.log('contents of file buffer: ', buffer);
                res.sendFile(buffer);
            })
        })
    });
};