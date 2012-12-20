window.IncidentView = Backbone.View.extend({

    initialize: function () {
        _.bindAll(this, 'render', 'render_feeling', 'render_thought', 'on_feeling_submit', 'on_thought_submit');
        this.render();
        this.model.bind('add:feelings', this.render_feeling);
        this.model.bind('add:thoughts', this.render_thought);

    },

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    },

    events: {
        "change"        : "change",
        "click .save"   : "beforeSave",
        "click .delete" : "deleteIncident",
        "click .addAnotherFeeling": "addAnotherFeeling",
        "click .addAnotherThought": "addAnotherThought",
        "drop #picture" : "dropHandler",
        "click .newFeelingButton": "on_feeling_submit",
        "click .newThoughtButton": "on_thought_submit"
    },

    render_feeling: function(feeling) {
        var feeling_view = new IncidentView({ model: feeling });
        this.$('div.feelings_list').append($(feeling_view.render() ));
    },

    render_thought: function(thought) {
        var thought_view = new IncidentView({ model: thought });
        this.$('div.thoughts_list').append($(thought_view.render() ));
    },

    on_feeling_submit: function(e) {
        var new_feeling = new Feeling({
            name: this.$('.new_feeling_name').val(),
            intensityBefore: this.$('.new_feeling_intensityBefore').val(),
            intensityAfter: this.$('.new_feeling_intensityAfter').val(),
            incident: this.model._id
            });
        new_feeling.save();
        
    },

    on_thought_submit: function(e) {
    var new_thought = new Thought({
        name: this.$('.new_thought_thought').val(),
        intensityBefore: this.$('.new_thought_distortions').val(),
        intensityAfter: this.$('.new_thought_rationalThought').val(),
        incident: this.model
        });
    new_feeling.save();
    },


    change: function (event) {
        // Remove any existing alert message
        utils.hideAlert();

        // Apply the change to the model
        var target = event.target;
        var change = {};
        change[target.name] = target.value;
        this.model.set(change);

        // Run validation rule (if any) on changed item
        var check = this.model.validateItem(target.id);
        if (check.isValid === false) {
            utils.addValidationError(target.id, check.message);
        } else {
            utils.removeValidationError(target.id);
        }
    },

    beforeSave: function () {
        var self = this;
        var check = this.model.validateAll();
        if (check.isValid === false) {
            utils.displayValidationErrors(check.messages);
            return false;
        }
        this.saveIncident();
        return false;
    },

    saveIncident: function () {
        var self = this;
        console.log('before save');
        this.model.save(null, {
            success: function (model) {
                self.render();
                app.navigate('incidents/' + model.id, false);
                utils.showAlert('Success!', 'Incident saved successfully', 'alert-success');
            },
            error: function () {
                utils.showAlert('Error', 'An error occurred while trying to delete this item', 'alert-error');
            }
        });
    },

    deleteIncident: function () {
        this.model.destroy({
            success: function () {
                alert('Incident deleted successfully');
                window.history.back();
            }
        });
        return false;
    },

    addAnotherFeeling: function(e){
        e.preventDefault();
        var newInput = document.createElement("input");
        newInput.innerHTML = "<br><input type='text' name='feeling' style='width: 90%;'><% feeling.feeling %></input>";
        $('.feelings-controls').append(newInput);
    },

    addAnotherThought: function(e){
        e.preventDefault();
        var newInput = document.createElement("input");
        newInput.innerHTML = "<br><input type='text' name='thought' style='width: 90%;'><% thought.thought %></input>";
        $('.thoughts-controls').append(newInput);
    },

    dropHandler: function (event) {
        event.stopPropagation();
        event.preventDefault();
        var e = event.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        this.pictureFile = e.dataTransfer.files[0];

        // Read the image file from the local file system and display it in the img tag
        var reader = new FileReader();
        reader.onloadend = function () {
            $('#picture').attr('src', reader.result);
        };
        reader.readAsDataURL(this.pictureFile);
    }

});


window.FeelingView = Backbone.View.extend({
    tagName: 'div',

    className: 'feeling_view',

    initialize: function(){
        _.bindAll(this, 'render');
        this.model.bind('change', this.render);
    },

    render: function() {
        return $(this.el).html(this.template(this.model.toJSON()));
        console.log('im from FeelingView');
    }
});


window.ThoughtView = Backbone.View.extend({
    tagName: 'div',

    className: 'thought_view',

    initialize: function(){
        _.bindAll(this, 'render');
        this.model.bind('change', this.render);
    },

    render: function() {
        return $(this.el).html(this.template(this.model.toJSON()));
    },
});