var layoutMenus = true;

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
    var wikiApiUrl = wikiUrl+'?action=parse&page=' + wikipage + '&format=json&disableeditsection=true';
    $http.get(wikiApiUrl).then(function(res) {
      var obj = res.data;
      html = {
        'title' : obj.parse.title,
        'text' : obj.parse.text['*']
      };
      var semanticApiUrl = wikiUrl + '?action=browsebysubject&subject=' + wikipage + '&format=json';
      console.log(semanticApiUrl);
      $http.get(semanticApiUrl).then(function(res) {
        console.log(JSON.stringify(res.data));
        var data = res.data.query.data;
        for(var i = 0; i < data.length; i++) {
          var item = data[i];
          html[item.property] = item.dataitem[0].item;
        }
        callback(html);
      });
    });
  };
})

.service('Ask', function(wikiUrl, $http) {
  var self = this;
  this.fetchList = function(year, callback) {
    var query = '[[Category:Events]][[Type::Meetup]]|?NameOfEvent|?OnDate|?Venue|?Time|sort=OnDate|order=descending';
    var url = wikiUrl + '?action=ask&query=' + query + '&format=json';
    console.log(url);
    return $http.get(url).then(function(res) {
      callback(res.data);
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
    $scope.formatDate = function(dateStr) {
      var items = dateStr.split('/');
      return items[3] + '/' + items[2] + '/' + items[1];
    };
    $scope.formatStr = function(str) {
      str = str.replace(/_/g, ' ');
      str = str.slice(0, str.length - 3);
      return str;
    }
    var wikipage = $routeParams.wikipage || 'Hackers_%26_Designers';
    Homepage.fetch(wikipage, function(html) {
      homepage.html = html;
    });
})

.controller('LeftNavController', function(Ask, $scope, $q, $timeout) {
  $scope.title = 'MEETUPS';  
  $scope.showMenu = function($event) {
    angular.element($event.currentTarget).toggleClass('showing');
  };

  $scope.formatDate = function(dateStr) {
    var date = new Date(parseInt(dateStr) * 1000);
    return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
  };

  var year = [2014, 2015, 2016];

  var objs = {};
  var promises = [];
  for (i = 0; i < year.length; i++) {
    promises.push(Ask.fetchList(year[i], function(data) {
      var obj = data.query.results;

      if(!Array.isArray(obj)) {
        for (var attr in obj) { objs[attr] = obj[attr]; }
      }
    }));
    $q.all(promises).then(function() {
      $scope.meetups = objs;
      console.log(JSON.stringify(meetups));
    })
  }
})

.controller('RightNavController', function($scope, $routeParams) {
  $scope.title = 'SUMMERY ACADEMY';  
  $scope.showMenu = function($event) {
    angular.element($event.currentTarget).toggleClass('showing');
  };
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
          //dealing with these unruly anchorlinks
          if(href && href.indexOf('#') != -1) {
            el.prop('href', null);
            //Trying to get angular $scope.scrollTo() to work. No luck so far
//              var anchorLink = href.split('#')[1];
//              var linkToEl = 'scrollTo("' + anchorLink + '")';
//              console.log(linkToEl);
//              el.prop('ng-click', linkToEl);
          };
          if(href && href.indexOf('mediawiki') != -1) {
            var paths = href.split('/');
            var last = paths[paths.length - 1];
            el.prop('href', '#/' + last);
          };
          //removes href for files/images
          if (href && href.indexOf('File') != -1) {
            el.prop('href', null);
          };
        }
      }, 1000);
    }
  };
});
