$(document).ready(function() {


// use {{ }} for templating, to avoid conflict with ERB
_.templateSettings = {
  interpolate : /\{\{(.+?)\}\}/g,
  evaluate: /\{\@(.+?)\@\}/gim
};


// Setup namespace for app
//------------------------
window.App = {
	Models: {},
	Collections: {},
	Views: {},
	Router: {}
};

// pub/sub object
var vent = _.extend({}, Backbone.Events);

// Helper methods for templates
//-----------------------------
window.template = function(id) {
	return _.template( $('#' + id).html() );
};


// Router
// ------
App.Router = Backbone.Router.extend({
	routes: {
		'':'showAllIncidents',
		'incidents': 'showAllIncidents',
		'incidents/:id': 'showIncident',
		'search/:query': 'search',
		'*other': 'defaults'
	},

	index: function() {
		$('#app').html("<p>Index page!  Try going to <a href='/cbt#incidents'>here</a>");
	},

	showAllIncidents: function() {
		vent.trigger('incidents:showAll');
	},

	showIncident: function(id) {
		vent.trigger('incidents:show', id);
		console.log('route to show incident #' + id);
	},

	search: function(query) {
		console.log('you searched for:  ' + query);
	},

	defaults: function(other)  {
		console.log('whoops, not sure what you mean by:  ' + other);
	}

});



// Incident-- single
//------------------
App.Models.Incident = Backbone.Model.extend({

	idAttribute: '_id',

	validate: function(attrs){
		if ( ! $.trim(attrs.description) ) {
			return "You need to give a description of this incident in order to analyze it";
		}
	},

	defaults: {
		"description": "",
		"feelings": ["","",""],
		"thoughts": ["","",["", ""]]
	}
});


// Incident View -- single
//------------------------
App.Views.Incident = Backbone.View.extend({
	tagName: 'div',

	template: template('showIncidentTemplate'),

	initialize: function() {
		this.model.on('change', this.render, this);
		this.model.on('destroy', this.remove, this);
	},

	events: {
		'click .editDescription': 'editDescription',
		'click .destroyIncident': 'destroyIncident'
	},

	editDescription: function(){
		var newIncidentDescription = prompt("What happened?", this.model.get('description'));
		if (!newIncidentDescription) return;  //first validation to ensure theres a valid description
		this.model.set('description', newIncidentDescription);
	},

	destroyIncident: function() {
		//handle click to destroy the incident
		this.model.destroy();

	},

	remove: function(){
		this.$el.remove();
		// should flash notice that 'you have deleted this thing!'
		$('#notices').html('You have deleted this incident!');
	},

	render: function(){
		var template = this.template(this.model.toJSON());
		this.$el.html( template );

		return this;
	}
});


// Incidents Collection -- many
// ----------------------------
App.Collections.Incidents = Backbone.Collection.extend({
	model: App.Models.Incident,

	// set where the collection is to create/read/update/delete
	url: '/api/incidents'
});


// Incidents Collection View -- many
// ---------------------------------
App.Views.Incidents = Backbone.View.extend({
	tagName: 'div',

	initialize: function() {
		vent.on('incidents:showAll', this.showAll, this);
		vent.on('incidents:show', this.showIncident, this);
		this.collection.on('add', this.addOne, this);
	},

	showAll: function() {
		var incidents = this.collection;
		var incidentsView = new App.Views.Incidents({ collection: incidents });
		incidentsView.render();
		console.log('showing all');
	},

	showIncident: function(id) {
		var incident = this.collection.get(id);
		var incidentView = new App.Views.Incident({ model: incident });
		//replace html with the single model that we want
		this.$el.html(incidentView.render().el);
		//hide the 'add incident' view
		//$('#addIncident').hide();
		console.log('hello! from showIncident');

	},

	render: function(){
		//filter all incidents
		this.collection.each(this.addOne, this);
		return this;
	},

	addOne: function(incident){
		//for each create new view
		var incidentView = new App.Views.Incident({ model: incident });
		//render view and append the el to the collection el
		this.$el.append(incidentView.render().el);
	}

});

// Add an Incident
// ---------------

// logic exists to add only a single field.
// How do we add an entire incident, with all its properties?

App.Views.AddIncident = Backbone.View.extend({
	el: '#addIncident',

	events: {
		'submit': 'submit'
	},

	submit: function(e) {
		e.preventDefault();
		var newIncidentDescription = $(e.currentTarget).find('input[type=text]').val();
		var incident = new App.Models.Incident({ description: newIncidentDescription});
		this.collection.create(incident);
	}

});



//  Bootstrap and run the app
// --------------------------

console.log('app.js is now running on this page!');


// sample data for single incident
var incident1 = new App.Models.Incident({
		_id:1,
		description: 'I am a new incident!!',
		feelings:[
			//[feeling, intensityBefore, intensityAfter]
			['sad', 10, 7],
			['embarrassed', 8, 2],
			['scared', 6, 2]
		],
		thoughts:[
			//[thought, rational version, [*distortions]]
			['i should be quiet', 'i was flustered', ['overgeneralizing', 'mind-reading']],
			['i am a fartface', 'it could happen to anyone', ['labeling', 'fortune-telling']]
		]
	});

var incident2 = new App.Models.Incident({
	_id:2,
		description: 'My dog ate my shoes.',
		feelings:[
			//[feeling, intensityBefore, intensityAfter]
			['angry', 10, 7],
			['frustrated', 8, 2]
		],
		thoughts:[
			//[thought, rational version, [*distortions]]
			['he is dumb', 'he is only a dog', ['overgeneralizing', 'mind-reading']],
			['I hate this dumb dog', 'he is my friend', ['labeling', 'fortune-telling']]
		]
});

var incidents = new App.Collections.Incidents();
// incidents.add(incident1);
incidents.fetch({add: true});

var incidentsView = new App.Views.Incidents({ collection: incidents});
$('#app').html(incidentsView.render().el);


new App.Router();
// pushState:true will interfere with Sinatra routes.
// use # for now
Backbone.history.start({});

});

