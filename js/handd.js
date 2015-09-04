angular.module('handd', ['ngRoute', 'ui.bootstrap'])

.value('wikiUrl', 'http://52.19.102.72/mediawiki/api.php')

.filter('unsafe', function($sce) {
  return function(val) {
    return $sce.trustAsHtml(val);
  };
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
        
