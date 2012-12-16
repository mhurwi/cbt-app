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


// Helper methods for templates
//-----------------------------
window.template = function(id) {
	return _.template( $('#' + id).html() );
};


// Incident-- single
//------------------
App.Models.Incident = Backbone.Model.extend({
	validate: function(attrs){
		if ( ! $.trim(attrs.description) ) {
			return "You need to give a description of this incident in order to analyze it";
		}
	},

	defaults: {
		description: "",
		feelings: ["","",""],
		thoughts: ["","",["", ""]]
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
		$('#notices').html('You have deleted this incident!');
	},

	render: function(){
		var template = this.template(this.model.toJSON());
		this.$el.html( template);
		return this;
	}
});


// Incidents Collection -- many
// ----------------------------
App.Collections.Incidents = Backbone.Collection.extend({
	model: App.Models.Incident
});


// Incidents Collection View -- many
// ---------------------------------
App.Views.Incidents = Backbone.View.extend({
	tagName: 'div',


	initialize: function() {
		this.collection.on('add', this.addOne, this);
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

// logic exists to add only a single field.  How do we add an entire incident, with all its properties?

App.Views.AddIncident = Backbone.View.extend({
	el: '#addIncident',

	events: {
		'submit': 'submit'
	},

	submit: function(e) {
		e.preventDefault();
		var newIncidentDescription = $(e.currentTarget).find('input[type=text]').val();
		var incident = new App.Models.Incident({ description: newIncidentDescription});
		this.collection.add(incident);
	}

});



//  Bootstrap and run the app
// --------------------------

console.log('app.js is now running on this page!');


// sample data for single incident
var incident = new App.Models.Incident({
	description: 'I forgot my lunch and yelled fartface loudly.',
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

//new single incident view
//var incidentView = new App.Views.Incident({ model: incident });

//setup a new collection to contain incidents
var incidents = new App.Collections.Incidents();
incidents.add(incident);

var addIncidentView = new App.Views.AddIncident({ collection: incidents });

//create new collection view instance
var incidentsView = new App.Views.Incidents({ collection: incidents});

// display the incidentsView in div#app!!!
$('#app').append(incidentsView.render().el);

});



//  TODO
// edit incident
// destroy incident
// create new incident
// expand/collapse behavior for incidents in collection
// route to show all incidents, show 1 incident
// hook up to MongoDB for persisitence of data
// add user Password to login
// deploy