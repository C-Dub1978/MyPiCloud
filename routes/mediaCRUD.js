/**
 * Created by foolishklown on 10/2/2016.
 */
var Read = require('./IO/readFile'),
    Write = require('./IO/writeFile'),
    All = require('./IO/readAll'),    
    Delete = require('./IO/deleteFile');

module.exports = {

    getAll: (req, res) => {
        All(req, res);
    },

    writeFile: (req, res) => {
        var file = req.files['0'];
        //console.log('file from request is: ', file);
        Write(file, req.query.id, req.query.type, res);
        //console.log('response back: ', res);
    },

    readFile: (req, res, type) => {
        console.log('in our media crud file, we are calling to write in the readFile file...');
        Read(req, res, type);
    },

    deleteFile: (req, res) => {
        console.log('in our media crud file, requesting delete');
        Delete(req, res);
    }
};