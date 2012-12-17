var incidentCollection = new App.Collections.Incidents
	undefined
incidentCollection.fetch()
	Object
var i = new App.Views.Incidents({ collection: incidentCollection})
	undefined
i.render()
	child
$('#app').html(i.el)
	[
	<div id=​"app">​…​</div>​
	]