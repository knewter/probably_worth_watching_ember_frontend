var PWW = Ember.Application.create();

// Maybe we're going to store stuff?
PWW.Store = DS.Store.extend({
  revision: 11,
  adapter: DS.RESTAdapter.create()
});

// Routes
PWW.Router.map(function(match){
  this.resource('categories', function(){
    this.resource('category', { path: ':category_id' }, function(){
      this.resource('video', { path: ':video_id' });
    });
  });
});

PWW.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('categories');
  }
});

PWW.CategoriesRoute = Ember.Route.extend({
  model: function() {
    return PWW.Category.find();
  }
});

PWW.CategoryRoute = Ember.Route.extend({
  model: function(params) {
    var categories = PWW.Category.find();
    var category = _.find(categories, function(cat){ cat.id == params.category_id })
    // lol handwavy find the right video list based on category
    return PWW.Video.find()
  },
  setupController: function(controller){
    var categories = PWW.Category.find();
    var category = _.find(categories, function(cat){ cat.id == params.category_id })
    // lol handwavy find the right video list based on category
    videos = PWW.Video.find();
    controller.set('content', videos);
  }
});


PWW.CategoriesController = Ember.ArrayController.extend({});

PWW.CategoryController = Ember.ArrayController.extend({
  itemController: 'indexVideo',
  selectedVideo: false,

  selectVideo: function(video){
    this.set('selectedVideo', video);
    this.target.router.transitionTo('video', video);
  }
});

PWW.IndexVideoController = Ember.ObjectController.extend({
  formattedDuration: function(){
    var duration = this.get('content.duration');
    var minutes = Math.floor(duration / 60);
    var seconds = duration % 60;
    return minutes + ":" + _.pad(seconds, 2, '0');
  }.property('content.formattedDuration')
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
          this.allVideos.addObject(PWW.Video.create({
            title: vid.title,
            url: vid.url,
            description: vid.description,
            id: vid.url,
            duration: vid.duration,
            embed: vid.embed
          }));
        }, this);
      }
    });
    return this.allVideos;
  }
});

PWW.Category = Ember.Object.extend();
PWW.Category.reopenClass({
  allCategories: [],
  find: function(){
    $.ajax({
      url: '/categories.json',
      dataType: 'json',
      context: this,
      success: function(response){
        response.forEach(function(category){
          this.allCategories.addObject(PWW.Category.create(category));
        }, this);
      }
    });
    return this.allCategories;
  }
});

PWW.initialize();
