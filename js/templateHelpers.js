(function() {
  var get = Ember.get, set = Ember.set;
  Ember.onLoad('Ember.Handlebars', function(Handlebars) {
    var resolvePaths = Ember.Handlebars.resolvePaths,
        isSimpleClick = Ember.ViewUtils.isSimpleClick;

    function fullRouteName(router, name) {
      if (!router.hasRoute(name)) {
        name = name + '.index';
      }

      return name;
    }

    function resolvedPaths(linkView) {
      return resolvePaths(linkView.parameters);
    }

    function args(linkView, router, route) {
      var passedRouteName = route || linkView.namedRoute, routeName;

      routeName = fullRouteName(router, passedRouteName);

      Ember.assert("The route " + passedRouteName + " was not found", router.hasRoute(routeName));

      var ret = [ routeName ];
      return ret.concat(resolvePaths(linkView.parameters));
    }

    var SubnavView = Ember.View.extend({
      tagName: 'dd',
      namedRoute: null,
      currentWhen: null,
      title: null,
      activeClass: 'active',
      replace: false,
      attributeBindings: [],
      classNameBindings: 'active',

      active: Ember.computed(function() {
        var router = this.get('router'),
            params = resolvedPaths(this),
            currentWithIndex = this.currentWhen + '.index',
            isActive = router.isActive.apply(router, [this.currentWhen].concat(params)) ||
                       router.isActive.apply(router, [currentWithIndex].concat(params));

        if (isActive) { return get(this, 'activeClass'); }
      }).property('namedRoute', 'router.url'),

      router: Ember.computed(function() {
        return this.get('controller').container.lookup('router:main');
      }),

      click: function(event) {
        if (!isSimpleClick(event)) { return true; }

        event.preventDefault();
        if (this.bubbles === false) { event.stopPropagation(); }

        var router = this.get('router');

        router.transitionTo.apply(router, args(this, router));
      }
    });

    SubnavView.toString = function() { return "SubnavView"; };

    Ember.Handlebars.registerHelper('subnavTo', function(name) {
      var options = [].slice.call(arguments, -1)[0];
      var contexts = [].slice.call(arguments, 1, -1);

      var hash = options.hash;

      hash.namedRoute = name;
      hash.currentWhen = hash.currentWhen || name;

      hash.parameters = {
        data: options.data,
        contexts: contexts,
        roots: options.contexts
      };

      return Ember.Handlebars.helpers.view.call(this, SubnavView, options);
    });
  });
})();


