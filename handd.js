angular.module('handd', ['ngRoute'])

.value('wikiUrl', 'http://wiki.hackersanddesigners.nl/mediawiki/api.php')
.filter('unsafe', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
})

/*
.service('Utils', function() {
  var self = this;
  this.cleanLinks = function(html) {
    var el = angular.element(html)
    var links = el.find('a');
    console.log(links);
    for(var i = 0; i < links.length; i++) {
      var href  = angular.element(links[i]).attr('href');
      if(href.indexOf('mediawiki') != -1) {
        var params = href.split('?');
        if(params.length > 1) {
          var keyValues = params[1].split('&');
          for(var j = 0; j < keyValues.length; j++) {
            var keyValue = keyValues[j].split('=');
            if(keyValue[0] == 'title') {
              return '{{ keyValue[1] }}' 
            }
          }
        }
        return 'http://wiki.hackersanddesigners.nl' + href;
      }
      return href;
    }
  };
})
*/

.service('Homepage', function(wikiUrl, $http) {
  var self = this;
  this.fetch = function(callback) {
    $http.get(wikiUrl+'?action=parse&page=Hackers_%26_Designers&format=json').then(function(res) {
      var obj = res.data;
      html = obj.parse.text['*'];
      callback(html);
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
    //Utils.cleanLinks(html); 
    homepage.html = html; 
  });
});
        
