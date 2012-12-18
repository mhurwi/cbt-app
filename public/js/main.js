var AppRouter = Backbone.Router.extend({

    routes: {
        ""                  : "home",
        "incidents"	: "list",
        "incidents/page/:page"	: "list",
        "incidents/add"         : "addIncident",
        "incidents/:id"         : "incidentDetails",
        "about"             : "about"
    },

    initialize: function () {
        this.headerView = new HeaderView();
        $('.header').html(this.headerView.el);
    },

    home: function (id) {
        if (!this.homeView) {
            this.homeView = new HomeView();
        }
        $('#content').html(this.homeView.el);
        this.headerView.selectMenuItem('home-menu');
    },

	list: function(page) {
        var p = page ? parseInt(page, 10) : 1;
        var incidentList = new IncidentCollection();
        incidentList.fetch({success: function(){
            $("#content").html(new IncidentListView({model: incidentList, page: p}).el);
        }});
        this.headerView.selectMenuItem('home-menu');
    },

    incidentDetails: function (id) {
        var incident = new Incident({_id: id});
        incident.fetch({success: function(){
            $("#content").html(new IncidentView({model: incident}).el);
        }});
        this.headerView.selectMenuItem();
    },

	addIncident: function() {
        var incident = new Incident();
        $('#content').html(new IncidentView({model: incident}).el);
        this.headerView.selectMenuItem('add-menu');
	},

    about: function () {
        if (!this.aboutView) {
            this.aboutView = new AboutView();
        }
        $('#content').html(this.aboutView.el);
        this.headerView.selectMenuItem('about-menu');
    }

});

utils.loadTemplate(['HomeView', 'HeaderView', 'IncidentView', 'IncidentListItemView', 'AboutView'], function() {
    app = new AppRouter();
    Backbone.history.start();
});