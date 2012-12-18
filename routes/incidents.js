var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('incidentdb', server, {safe: true});

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'incidentdb' database");
        db.collection('incidents', {safe:true}, function(err, collection) {
            if (err) {
                console.log("The 'incidents' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving incident: ' + id);
    db.collection('incidents', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};

exports.findAll = function(req, res) {
    db.collection('incidents', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addIncident = function(req, res) {
    var incident = req.body;
    console.log('Adding incident: ' + JSON.stringify(incident));
    db.collection('incidents', function(err, collection) {
        collection.insert(incident, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}

exports.updateIncident = function(req, res) {
    var id = req.params.id;
    var incident = req.body;
    delete incident._id;
    console.log('Updating incident: ' + id);
    console.log(JSON.stringify(incident));
    db.collection('incidents', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, incident, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating incident: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(incident);
            }
        });
    });
}

exports.deleteIncident = function(req, res) {
    var id = req.params.id;
    console.log('Deleting incident: ' + id);
    db.collection('incidents', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var incidents = [
    {
        description: "I feel happy",
        feelings: {feelingName: 'fun', intensityBefore: 10, intensityAfter: 2 },
        thoughts: {thought: 'im laughing', distortions:['labeling', 'overgeneralization'], rationalThought: 'right i am laughing'}
    },
    {
        description: "I feel sad",
    }];

    db.collection('incidents', function(err, collection) {
        collection.insert(incidents, {safe:true}, function(err, result) {});
    });

};