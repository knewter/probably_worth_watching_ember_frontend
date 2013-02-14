var PWW = Ember.Application.create();

// Maybe we're going to store stuff?
PWW.Store = DS.Store.extend({
  revision: 11,
  adapter: DS.RESTAdapter.create()
});

// Routes
PWW.Router.reopen({
  location: 'history'
});

PWW.Router.map(function(match){
  this.route('index', { path: '/' });
});

PWW.IndexRoute = Ember.Route.extend({
  model: function() {
    return PWW.Video.find();
  }
});

PWW.IndexController = Ember.ArrayController.extend({
});

PWW.video = DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  duration: DS.attr('number'),
  url: DS.attr('string'),
  embed: DS.attr('string')
});

PWW.initialize();
