const DataUsers = require( '../controllers/dataUsers.controller.js')

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });

    app.get('/users', DataUsers.getAll);

    app.post( '/api/addUsers', DataUsers.addUser);

    app.post ('/api/getUsers', DataUsers.getUsers)
};