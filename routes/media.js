/**
 * Created by foolishklown on 10/2/2016.
 */
var Read = require('./IO/readFile'),
    Write = require('./IO/writeFile'),
    All = require('./IO/readAll'),    
    Delete = require('./IO/deleteFile'),
    CRUD = require('./IO/CRUD');

module.exports = {

    getAll: (req, res) => {
        //All(req, res);
        CRUD.getAll(req, res);
    },

    writeFile: (req, res) => {
        var file = req.files['0'];
        console.log('the response is:');
        console.log(res);
        //Write(file, req.query.id, req.query.type, req.query.info, res);
        CRUD.writeFile(file, req.query.id, req.query.type, req.query.info, res);
    },

    downloadFile: (req, res) => {
        console.log('in our media crud file, we are calling to write in the readFile file...');
        //Read(req, res, type);
        CRUD.downloadFile(req.query.id, req.query.info, req.query.location, req.query.name, res);
    },

    deleteFile: (req, res) => {
        console.log('in our media crud file, requesting delete:');
        console.log('response: ');
        console.log(res);
        //Delete(req.query.id, req.query.info, req.query.type, res);
        CRUD.deleteFile(req.query.id, req.query.type, req.query.info, res);
    }
};