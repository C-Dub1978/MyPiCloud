 'use strict'

var Auth = require('./auth'),
    Media = require('./mediaCRUD'),
    multiparty = require('connect-multiparty');

module.exports = function(app) {
    // SITE ROOT
    app.get('/', (req, res) => { // replace this route with a landing or home page, or break this out into another controller if needed!
        res.render('auth.ejs');
    });
    app.get('/login', Auth.render); // route for the login page
    app.get('/logout', Auth.logout); // route for logging out

    app.post('/login', Auth.login); // form request endpoint for logging in
    app.post('/register', Auth.register); // form request endpoint for user registration

    // DAHSBOARD
    app.all('/dashboard*', Auth.session); // protect all dashboard routes from unauthorized users
    app.get('/dashboard', (req, res) => { // renders the dashboard, break this out into another controller if needed!
        res.render('dashboard', req.session);
    });
    app.get('/dashboard/getAll', Media.getAll);

    // if there is no request following this call, then use the above app.get all callback format
    app.post('/dashboard/uploadAudio', multiparty(), Media.writeFile);
    app.post('/dashboard/uploadVideo', multiparty(), Media.writeFile);
    app.post('/dashboard/uploadImage', multiparty(), Media.writeFile);
    app.post('/dashboard/uploadDocument', multiparty(), Media.writeFile);

    app.get('/dashboard/removeMedia', multiparty(), Media.deleteFile);


};
