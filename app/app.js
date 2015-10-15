angular
  .module('myApp', ['ngMaterial', 'ngRoute'])
  .value('wikiUrl', 'http://wiki.hackersanddesigners.nl/mediawiki/api.php')
  .config(function ($mdThemingProvider, $routeProvider) {
    $mdThemingProvider.theme('default')
      .primaryPalette('brown')
      .accentPalette('red');
    $routeProvider
      .when('/', {
        controller: 'HomepageController as homepage',
        templateUrl: 'homepage.html',
        resolve: {
        }
      })
      .when('/:wikipage', {
        controller: 'HomepageController as homepage',
        templateUrl: 'homepage.html',
        resolve: {
        }
      });
    })
    .filter('unsafe', function ($sce) {
    return function(val) {
      return $sce.trustAsHtml(val);
    };
  })
  .controller('AppCtrl', function ($scope, $timeout, $mdSidenav, $mdUtil, $log) {
    $scope.toggleLeft = buildToggler('left', 'right');
    $scope.toggleRight = buildToggler('right', 'left');

    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildToggler(navID, oppositeNav) {
      var debounceFn =  $mdUtil.debounce(function(){
        $mdSidenav(navID).toggle().then(function () {
          if($mdSidenav(navID).isOpen()){
            $mdSidenav(oppositeNav).close();
            $log.debug(navID + " is open");
          } else {
            $log.debug(navID + " is closed");
          }
        });
      },50);
      return debounceFn;
    }
  })
  .controller('LeftCtrl', function ($scope, $timeout, $mdSidenav, Ask) {
    $scope.close = function () {
      $mdSidenav('left').close().then(function () {
        console.log("close LEFT is done");
      });
    };
    var meetups = this;
    var year = [2014, 2015, 2016];
//    var forEachYear = function(arr, fn) {
//      var newArray = [];
//      for (i = 0; i < year.length; i++) {
//        newArray.push(fn(arr[i]))
//      };
//      return newArray;
//    };
//    console.log(forEachYear(year, Ask.fetch));
    for (i = 0; i < year.length; i++) {
      Ask.fetch(year[i], function(data) {
        meetups.stuff = data.query.results;
      });
    };
  })
  .controller('RightCtrl', function ($scope, $timeout, $mdSidenav, $log) {
    $scope.close = function () {
      $mdSidenav('right').close().then(function () {
        $log.debug("close RIGHT is done");
      });
    };
  })
  .controller('HomepageController', function(Homepage, $scope, $routeParams) {
    var homepage = this;
    var wikipage = $routeParams.wikipage || 'Hackers_%26_Designers';
    Homepage.fetch(wikipage, function(html) {
      homepage.html = html;
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
  })
  .directive('sidenavPushIn', function () {
    return {
      restrict: 'A',
      require: '^mdSidenav',
      link: function ($scope, element, attr, sidenavCtrl) {
        var body = angular.element(document.body);
        body.addClass('md-sidenav-push-in');
        var cssClass = (element.hasClass('md-sidenav-left') ? 'md-sidenav-left' : 'md-sidenav-right') + '-open';
        var stateChanged = function (state) {
          body[state ? 'addClass' : 'removeClass'](cssClass);
        };
        // overvwrite default functions and forward current state to custom function
        angular.forEach(['open', 'close', 'toggle'], function (fn) {
          var org = sidenavCtrl[fn];
          sidenavCtrl[fn] = function () {
            var res = org.apply(sidenavCtrl, arguments);
            stateChanged(sidenavCtrl.isOpen());
            return res;
          };
        });
      }
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
  .service('Ask', function(wikiUrl, $http) {
    var self = this;
    this.fetch = function(year, callback) {
      var query = '[[Category:Meetups]][[In Year::' + year + ']]|?On Date|?Location|format=array';
      $http.get(wikiUrl + '?action=ask&query=' + query + '&format=json').then(function(res) {
        var obj;
        obj = res.data;
        callback(obj);
//        return obj;
      });
    };
  });