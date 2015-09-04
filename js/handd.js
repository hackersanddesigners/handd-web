angular.module('handd', ['ngRoute', 'ui.bootstrap'])

.value('wikiUrl', 'http://52.19.102.72/mediawiki/api.php')

.filter('unsafe', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
})

.service('Homepage', function(wikiUrl, $http) {
  var self = this;
  this.fetch = function (callback) {
    $http.get(wikiUrl+'?action=parse&page=Hackers_%26_Designers&format=json').then(function(res) {
      var obj = res.data;
      callback(obj.parse.text['*']);
    });
  };
})

.config(function($routeProvider) {
  $routeProvider
  .when('/', {
    controller:'HomepageController as homepage',
    templateUrl:'homepage.html',
    resolve: {
    }
  })
})

.controller('HomepageController', function(Homepage) {
  var homepage = this;
  Homepage.fetch(function(html) {
    console.log(html);
    homepage.html = html; 
  });
});
        
