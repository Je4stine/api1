const Message = require( '../controllers/messages.controller')

module.exports = function(app) {
    app.use(function(req, res, next) {
        res.header(
          "Access-Control-Allow-Headers",
          "x-access-token, Origin, Content-Type, Accept"
        );
        next();
      });

    app.get('/api/getAll', Message.getAll);

    app.put( '/api/approve', Message.Approve);

    app.post( '/api/addSms', Message.addMessages);
};


