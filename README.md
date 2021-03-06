# CBT app

## Todo
### form to create new incident
* add another distortion for each thought
* break out form into wizard, using CBT wizard steps (below)



## Done!!
* created 'add another' for feelings and thoughts

## CBT wizard
These are the steps for the form wizard:

1. Describe the event
	* description
2. List all your feelings and the intensity you are feeling it at this point in time. 
	* feelings.feeling
	* feeling.feeling.intensityBefore
3. List all your thoughts concerning the incident.
	* thoughts.thought
4. For each thought, list all the distortions present in the thought.
	* thoughts.thought.distortions []
5. For each thought, enter a rational version of that thought.
	* thoughts.thought.rationalThought
6. For each feeling listed in step 2, enter the intensity you now feel the feeling, after having completed the process.  The intensity should have decreased substantially.
	* feelings.feeling.intensityAfter



---

# Thanks to Chris Coenraets for his Nodecellar application
[On github](https://github.com/ccoenraets/nodecellar)

### Node Cellar Sample Application with Backbone.js, Twitter Bootstrap, Node.js, Express, and MongoDB #

"Node Cellar" is a sample CRUD application built with with Backbone.js, Twitter Bootstrap, Node.js, Express, and MongoDB.

The application allows you to browse through a list of incidents, as well as add, update, and delete incidents.

This application is further documented [here](http://coenraets.org/blog).

The application is also hosted online. You can test it [here](http://nodecellar.coenraets.org).


## To run the application on your own Heroku account:##

1. Install the [Heroku Toolbelt](http://toolbelt.heroku.com)

2. [Sign up](http://heroku.com/signup) for a Heroku account

3. Login to Heroku from the `heroku` CLI:

        $ heroku login

4. Create a new app on Heroku:

        $ heroku create

5. Add the [MongoLab Heroku Add-on](http://addons.heroku.com/mongolab)

        $ heroku addons:add mongolab

6. Upload the app to Heroku:

        $ git push heroku master

7. Open the app in your browser:

        $ heroku open

