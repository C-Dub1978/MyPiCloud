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
        Write(file, req.query.id, req.query.type, req.query.info, res);         
    },

    readFile: (req, res, type) => {
        console.log('in our media crud file, we are calling to write in the readFile file...');
        Read(req, res, type);
    },

    deleteFile: (req, res) => {
        console.log('in our media crud file, requesting delete:');
        console.log(req.query.id);
        console.log(req.query.info);
        console.log(req.query.type);
        Delete(req.query.id, req.query.info, req.query.type, res);
    }
};