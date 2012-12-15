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
});


// Incident View -- single
//------------------------
App.Views.Incident = Backbone.View.extend({
	tagName: 'div',

	template: template('incidentTemplate'),

	initialize: function() {
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

	render: function(){
		//filter all incidents
		//for each create new view
		//render view and append the el to the collection el
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
var incidentView = new App.Views.Incident({ model: incident });

//setup a new collection to contain incidents
var incidents = new App.Collections.Incidents();
incidents.add(incident);

//create new collection view instance
var incidentsView = new App.Views.Incidents({
});

$('#app').append(incidentView.render().el);

});
