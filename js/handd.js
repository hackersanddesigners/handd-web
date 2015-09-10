angular.module('handd', ['ngRoute', 'ui.bootstrap'])

.value('wikiUrl', 'http://52.19.102.72/mediawiki/api.php')

.filter('unsafe', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
})

.directive('changeUrl', function ($compile, $timeout) {
    return {
        restrict: 'EA',
        scope: true,
        link: function (scope, elem, attrs) {
            $timeout(function() {
                console.log('replace');
                var href = elem.children('a').attr('href');
                elem.children('a').attr('href', null);
                elem.children('a').attr('ng-click', '$location.path(#"href")');
                $compile(elem.contents())(scope);
            });
            scope.open = function (url) {
                alert(url);
            }
        }
    }
})

.directive('ngDraggable', function($document, $window){
  function makeDraggable(scope, element, attr) {
    var startX = 0;
    var startY = 0;

    // Start with a random pos
    var x = Math.floor((Math.random() * 500) + 40);
    var y = Math.floor((Math.random() * 360) + 40);

    element.css({
      position: 'absolute',
      cursor: 'pointer',
      top: y + 'px',
      left: x + 'px'
    });

    element.on('mousedown', function(event) {
      event.preventDefault();
      
      startX = event.pageX - x;
      startY = event.pageY - y;
      
      $document.on('mousemove', mousemove);
      $document.on('mouseup', mouseup);
    });

    function mousemove(event) {
      y = event.pageY - startY;
      x = event.pageX - startX;

      element.css({
        top: y + 'px',
        left: x + 'px'
      });
    }

    function mouseup() {
      $document.unbind('mousemove', mousemove);
      $document.unbind('mouseup', mouseup);
    }
  }
  return {
    link: makeDraggable
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
  .when('/page/:pageid', {
    controller: 'pageCtrl',
    templateUrl:'homepage.html',
    resolve: {
    }
  })
  .when('/mediawiki/index.php/:title', {
    controller: 'titleCtrl',
    templateUrl:'homepage.html',
    resolve: {
    }
  })
  .otherwise({ redirectTo: '/page/30' });
})

.controller('PhotosCtrl', ['$scope', function($scope){
  $scope.photos = [
    '0001.jpg',
    '0002.jpg',
    '0003.jpg',
    '0004.jpg',
    '0005.jpg',
    '0006.jpg',
    '0007.jpg',
    '0008.jpg',
    '0009.jpg',
    '0010.jpg',
    '0011.gif',
    '0012.jpg',
    '0013.jpg',
    '0014.jpg',
    '0015.jpg',
    '0016.jpg',
    '0017.jpg',
    '0018.jpg',
    '0019.jpg',
    '0020.jpg'];
}])

.controller('categoryCtrl', function(wikiUrl, $scope, $http, $location) {
  $http.get(wikiUrl + '?action=query&list=categorymembers&format=json&cmtitle=Category%3AHackers%26Designers').success(function(response) {
    $scope.items = response.query.categorymembers;
  });
})
.controller('titleCtrl', function(wikiUrl, $routeParams, $scope, $http) {
  $scope.title = $routeParams.title;
  var homepage = this;
  $http.get(wikiUrl + '?action=parse&format=json&page=' + $routeParams.title).success(function(response){
    homepage.title = response.parse.title;
    homepage.content = response.parse.text['*'];
    $scope.homepage = homepage;
  });
})
.controller('pageCtrl', function(wikiUrl, $routeParams, $scope, $http) {
  $scope.pageid = $routeParams.pageid;
  var homepage = this;
  $http.get(wikiUrl + '?action=parse&format=json&pageid=' + $routeParams.pageid).success(function(response){
    homepage.title = response.parse.title;
    homepage.content = response.parse.text['*'];
    $scope.homepage = homepage;
  });
});
        
