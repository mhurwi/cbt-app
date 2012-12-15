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


// Helper methods
// for templates
//---------------
window.template = function(id) {
	return _.template( $('#' + id).html() );
};


// Incident-- single
//---------------
App.Models.Incident = Backbone.Model.extend({
});


// Incident View -- single
//---------------------
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


console.log('app.js is now running on this page!');


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

var incidentView = new App.Views.Incident({ model: incident });

$('#app').append(incidentView.render().el);

});
