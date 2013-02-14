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
  itemController: 'indexVideo',
  selectedVideo: false,

  selectVideo: function(video){
    this.set('selectedVideo', video);
  }
});

PWW.IndexVideoController = Ember.ObjectController.extend({
});

PWW.Video = Ember.Object.extend();
PWW.Video.reopenClass({
  allVideos: [],
  find: function(){
    $.ajax({
      url: '/videos.json',
      dataType: 'json',
      context: this,
      success: function(response){
        response.forEach(function(vid){
          this.allVideos.addObject(PWW.Video.create(vid));
        }, this);
      }
    });
    return this.allVideos;
  }
});

PWW.initialize();
