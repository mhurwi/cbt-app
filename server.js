var express = require('express'),
    path = require('path'),
    http = require('http'),
    incident = require('./routes/incidents');

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.logger('dev'));  /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser()),
    app.use(express.static(path.join(__dirname, 'public')));
});

app.get('/incidents', incident.findAll);
app.get('/incidents/:id', incident.findById);
app.post('/incidents', incident.addIncident);
app.put('/incidents/:id', incident.updateIncident);
app.delete('/incidents/:id', incident.deleteIncident);

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
