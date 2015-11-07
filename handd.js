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
      $http.get(semanticApiUrl).then(function(res) {
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

.service('Ask', function(wikiUrl, $http, $q) {
  var self = this;
  this.fetchList = function(type, callback) {
    var objs = {};
    var promises = [];
    var query = '[[Category:Events]][[Type::' + type + ']]|?NameOfEvent|?OnDate|?Venue|?Time|sort=OnDate|order=descending';
    var url = wikiUrl + '?action=ask&query=' + query + '&format=json';
    //promises.push(
    $http.get(url).then(function(res) {
      //Aucallback(res.data);
      var data = res.data;
      var obj = data.query.results;
      if(!Array.isArray(obj)) {
        for (var attr in obj) { objs[attr] = obj[attr]; }
      }
      callback(objs);
    //}));
    });
    //$q.all(promises).then(function() {
    //});
  };
  this.fetchImages = function(callback) {
    var url = wikiUrl + '?action=query&list=allimages&ailimit=10&format=json'
    $http.get(url).then(function(res) {
      var data = res.data;
      callback(data.query.allimages);
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

.controller('PicsController', function(Ask, $scope, $window, $document) {
  var w = window,
    d = document,
    e = d.documentElement,
    g = d.getElementsByTagName('body')[0],
    x = (d.innerWidth || e.clientWidth || g.clientWidth) - 160,
    y = d.innerHeight || w.innerHeight || e.clientHeight|| g.clientHeight;
  var _startX = 0;
  var _startY = 0;
  var _offsetX = 0;
  var _offsetY = 0;
  var _dragElement;
  var _oldZIndex = 0;
  var _zindex = 10;
  var photosInitialized = false;
  var extractNumber = function(value) {
    var n = parseInt(value);
    return n == null || isNaN(n) ? 0 : n;
  };

  var fadeOut = function() {
    document.getElementById('photos').style.display = 'none';  
    document.getElementById('close').style.display = 'none';
  };

  document.querySelector('#close').onclick = fadeOut;

  var onMouseDown = function(e) {
    if (e == null) e = $window.event;
    var target = e.target != null ? e.target : e.srcElement;
   
    if ((e.button == 1 && $window.event != null ||
      e.button == 0) &&
      target.className.indexOf('drag') > -1) {
      _startX = e.clientX;
      _startY = e.clientY;
      _offsetX = extractNumber(target.style.left);
      _offsetY = extractNumber(target.style.top);
      _oldZIndex = target.style.zIndex;
      target.style.zIndex = 10000;
      _dragElement = target;
      document.onmousemove = onMouseMove;
      document.body.focus();
      document.onselectstart = function () { return false; };
      target.ondragstart = function() { return false; };
      return false;
    }
  };

  var onMouseMove = function(e) {
    if (e == null) var e = window.event; 
    _dragElement.style.left = (_offsetX + e.clientX - _startX) + 'px';
    _dragElement.style.top = (_offsetY + e.clientY - _startY) + 'px';
    _dragElement.style.top + ')'; 
  };

  var onMouseUp = function(e) {
    if (_dragElement != null) {
      _dragElement.style.zIndex = ++_zindex;
      document.onmousemove = null;
      document.onselectstart = null;
      _dragElement.ondragstart = null;
      _dragElement = null;
    }
  };

  Ask.fetchImages(function(objs) {
    if(!photosInitialized) {
      photosInitialized = true;
      document.onmousedown = onMouseDown;
      document.onmouseup = onMouseUp;
    }
    document.getElementById('photos').style.display = 'block';
    document.getElementById('close').style.display = 'block';

    for(var i = 0; i < objs.length; i++) {
      var photo = objs[i];
      var div = document.querySelector('#photos');
      var image = document.createElement('img');
      image.src = photo.url;
      image.className = 'drag';
      image.style.top = '' + Math.random() * (y) + 'px';
      image.style.left = '' + (Math.random() * (x) - 160) + 'px';
      div.appendChild(image);
    }
  }); 
})

.controller('LeftNavController', function(Ask, $scope) {
  $scope.title = 'MEETUPS';  
  $scope.showMenu = function($event) {
    angular.element($event.currentTarget).toggleClass('showing');
  };
  $scope.formatDate = function(dateStr) {
    var date = new Date(parseInt(dateStr) * 1000);
    return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
  };
  Ask.fetchList('Meetup', function(objs) {
    $scope.events = objs;
  });
})

.controller('RightNavController', function(Ask, $scope) {
  $scope.title = 'SUMMERY ACADEMY';  
  $scope.showMenu = function($event) {
    angular.element($event.currentTarget).toggleClass('showing');
  };
  $scope.formatDate = function(dateStr) {
    var date = new Date(parseInt(dateStr) * 1000);
    return date.getDate() + '/' + date.getMonth() + '/' + date.getFullYear();
  };
  Ask.fetchList('Summer Academy', function(objs) {
    $scope.events = objs;
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
            var str = '/mediawiki';
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
