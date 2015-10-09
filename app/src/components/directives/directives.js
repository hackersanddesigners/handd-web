/**
 * Created by lucianblankevoort on 08/10/15.
 */
angular.module('wikiDirectives', [])

    .directive('updatelinks', function($timeout) {
        return {
            link: function(scope, elem) {
                var links = angular.element(elem[0].querySelector('a'));
                $timeout(function() {
                    element.find('a').prop('target', '_blank');
                });
            }
        };
    })
.directive('changeUrl', function ($compile, $timeout) {
    return {
        restrict: 'EA',
        scope: true,
        link: function (scope, elem) {
            var links = angular.element(document.querySelector('a'));
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