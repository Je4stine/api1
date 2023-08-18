const CaseController = require('../controllers/cases.controller');

module.exports = function(app) {
    app.use(function(req, res, next) {
      res.header(
        "Access-Control-Allow-Headers",
        "x-access-token, Origin, Content-Type, Accept"
      );
      next();
    });

       app.post('/api/cases/add', CaseController.addCase);
       app.put('/api/cases/:id', CaseController.addCourtDate);
       app.get('/api/cases/paid', CaseController.getPaid);
       app.get('/api/cases/unpaid', CaseController.getUnpaid);
       app.get('/api/cases/informed', CaseController.getOperation);
       app.get ('/api/cases/courtdata', CaseController.getCourtDates);
  };