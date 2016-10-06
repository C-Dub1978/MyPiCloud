/**
 * Created by foolishklown on 10/2/2016.
 */

var mongoose = require('mongoose'),
    path = require('path'),
    Grid = require('gridfs-stream');

// here we will have to pass in the userid, and connect to their media database
// then we can use the object id to delete the file (or filename)
module.exports = function(fileName, res) {
    console.log('called delete file for gridfs');
    console.log('file is: ', fileName);
    var conn = mongoose.createConnection('mongodb://localhost/Media', (error) => {
        if(error) {
            console.error('Error connecting to mongod instance'.red);
            process.exit(1);
        } else {
            console.info('Connected successfully to mongod instance in the write file!'.blue);
        }
    });

    // Connect gridFs and mongo
    Grid.mongo = mongoose.mongo;

    conn.once('open', function() {
        console.log('connection open for reading!!!');
        var gfs = Grid(conn.db);

       // find the file, delete

    });
};