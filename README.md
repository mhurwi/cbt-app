Hello!
====

This is a demonstrator for [Sinatra](http://www.sinatrarb.com/) and [Twitter Bootstrap](http://twitter.github.com/bootstrap/). 

Use it as a boilerplate to start your own apps.

Go!
===

Download and run sinatra-bootstrap:

	git clone git@github.com:pokle/sinatra-bootstrap.git

	cd sinatra-bootstrap
    bundle install				# To install sinatra

	ruby app.rb 				# To run the sample
	
Then open [http://localhost:4567/](http://localhost:4567/)


todo
----
- get app.js to load on /secure/place
- get app.js to render and display a thing with title on the page, in #app




Notes
=====

run with: 'shotgun app.rb'

TO LOG IN:

- client requests GET '/login/form'
- client enters name into input with name="username"
- client hits submit button which sends POST to '/login/attempt'
- Server gets params['username'] and sets session[:identity] to it
- Then server redirects client back to either previous_url or '/'
- client is now LOGGED IN

TO ACCESS PROTECTED PAGE:

- client requests GET '/cbt*' (any secure page)
- server does before filter on this request--
- if there is NO session[:identity], that means user is not logged in, and the server provides error message 'sorry!' and sends client back to :login_form
- if server sees that user IS logged in, and there IS a session[:identity], then server goes on to process the request, GET '/secure/[URI]'
- Here, the server will provide the page to the logged in user.  In this case, the server will render our :appLayout page, and the authenticated user gets to use the app.




##TODO
* destroy incident
* edit all properties of an incident
* create new incident with all properties
* add user Password to login
* deploy
* refactor Incident model to use embedded {} instead of simple arrays
	* ie: feelings = [ {'feeling': 'sad', 'intensityBefore':10,*intensityAfter:2'}]

##DONE!!
* create new incident with just description
* edit incident description
* expand/collapse behavior for incidents in collection
* show all incidents
* show 1 incident
* hook up to MongoDB for persisitence of data