angular.module('handd', ['ngRoute', 'ui.bootstrap'])

.value('wikiUrl', 'http://52.19.102.72/mediawiki/api.php')

.filter('unsafe', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
})

.service('Homepage', function(wikiUrl, $http) {
  var self = this;
  this.fetchContent = function (callback) {
    $http.get(wikiUrl+'?action=parse&page=Hackers_%26_Designers&format=json').then(function(res) {
      var obj = res.data;
      callback(obj.parse.text['*']);
    });
  };
  this.fetchTitle = function (callback) {
    $http.get(wikiUrl+'?action=parse&page=Hackers_%26_Designers&format=json').then(function(res) {
      var obj = res.data;
      callback(obj.parse.title);
    });
  };
})

.service('Meetups', function(wikiUrl, $http) {
  var self = this;
  this.fetchContent = function (callback) {
    $http.get(wikiUrl+'?action=parse&page=HD-meet-ups&format=json').then(function(res) {
      var obj = res.data;
      callback(obj.parse.text['*']);
    });
  };
  this.fetchTitle = function (callback) {
    $http.get(wikiUrl+'?action=parse&page=HD-meet-ups&format=json').then(function(res) {
      var obj = res.data;
      callback(obj.parse.title);
    });
  };
})

.service('Summeracademy', function(wikiUrl, $http) {
  var self = this;
  this.fetchContent = function (callback) {
    $http.get(wikiUrl+'?action=parse&page=Hackers_%26_Designers_Summer_Academy&format=json').then(function(res) {
      var obj = res.data;
      callback(obj.parse.text['*']);
    });
  };
  this.fetchTitle = function (callback) {
    $http.get(wikiUrl+'?action=parse&page=Hackers_%26_Designers_Summer_Academy&format=json').then(function(res) {
      var obj = res.data;
      callback(obj.parse.title);
    });
  };
})

.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    controller:'HomepageCtrl as homepage',
    templateUrl:'homepage.html',
    resolve: {
    }
  })
  .when('/meetups', {
    controller: 'MeetupsCtrl as homepage',
    templateUrl:'homepage.html',
    resolve: {

    }
  })
  .when('/summeracademy', {
    controller: 'SummerAcademyCtrl as homepage',
    templateUrl:'homepage.html',
    resolve: {

    }
  })
})

.controller('HomepageCtrl', function(Homepage) {
  var homepage = this;
  Homepage.fetchContent(function(content) {
    console.log(content);
    homepage.content = content; 
  });
  Homepage.fetchTitle(function(title) {
    console.log(title);
    homepage.title = title; 
  });
})

.controller('MeetupsCtrl', function(Meetups) {
  var homepage = this;
  Meetups.fetchContent(function(content) {
    console.log(content);
    homepage.content = content; 
  });
  Meetups.fetchTitle(function(title) {
    console.log(title);
    homepage.title = title; 
  });
})

.controller('SummerAcademyCtrl', function(Summeracademy) {
  var homepage = this;
  Summeracademy.fetchContent(function(content) {
    console.log(content);
    homepage.content = content; 
  });
  Summeracademy.fetchTitle(function(title) {
    console.log(title);
    homepage.title = title; 
  });
});
        
