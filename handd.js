angular.module('handd', ['ngRoute'])

.value('wikiUrl', 'http://wiki.hackersanddesigners.nl/mediawiki/api.php')
.filter('unsafe', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
})

.service('Homepage', function(wikiUrl, $http) {
  var self = this;
  this.fetch = function(wikipage, callback) {
    $http.get(wikiUrl+'?action=parse&page=' + wikipage + '&format=json').then(function(res) {
      var obj = res.data;
      html = {
        'date' : 'DD.MM',
        'title' : obj.parse.title,
        'text' : obj.parse.text['*']
      };
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
  .when('/:wikipage', {
    controller:'HomepageController as homepage',
    templateUrl:'homepage.html',
    resolve: {
    }
  })
})

.controller('HomepageController', function(Homepage, $scope, $routeParams) {
    var homepage = this;
    var wikipage = $routeParams.wikipage || 'Hackers_%26_Designers';

    $scope.showMenu = function($event) {
      angular.element($event.currentTarget).toggleClass('showing');
    };

    Homepage.fetch(wikipage, function(html) {
        homepage.html = html.text;    
    });

    Homepage.fetch('HD-meet-ups', function(html) {
        homepage.leftMenu = html.text;
    });

    Homepage.fetch('Hackers_%26_Designers_Summer_Academy', function(html) {
        homepage.rightMenu = html.text;    
    });
})

.directive('updateimages', function($timeout) {
  return {
    link: function(scope, element) {
      $timeout(function() {
        var images = element.find('img');
        for(var index in images) {
          var el = angular.element(images[index]);
          var wikiUrl = 'http://wiki.hackersanddesigners.nl';
          // Fix src attr - JBG
          var src = el.prop('src');
          if(src) {
            src = src.replace(/.*?:\/\//g, '');
            var str = '.*?/mediawiki';
            var re = new RegExp(str, 'g');
            src = src.replace(re, wikiUrl + '/mediawiki');
            el.attr('src', src);
          }

          // Fix srcset attr - JBG
          var srcset = el.prop('srcset');
          if(srcset) {
            srcset = srcset.replace(/.*?:\/\//g, '');
            var str = '.*?/mediawiki';
            var re = new RegExp(str, 'g');
            srcset = srcset.replace(re, wikiUrl + '/mediawiki');
            el.attr('srcset', srcset);
          }
        }
      }, 1000);
    }
  };
})

.directive('updatelinks', function($timeout) {
  return {
    link: function(scope, element) {
      $timeout(function() {
        var links = element.find('a');
        for(var index in links) {
          var el = angular.element(links[index]);
          var href = el.prop('href');
          if(href && href.indexOf('mediawiki') != -1) {
            var paths = href.split('/');
            var last = paths[paths.length - 1];
            el.prop('href', '#/' + last);
          }
        }
      }, 1000);
    }
  };
});
        
