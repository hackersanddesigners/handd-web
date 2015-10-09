/**
 * Created by lucianblankevoort on 08/10/15.
 */
myApp.controller('mainCtrl', ['Page', '$scope', function(Page, $scope) {
    $scope.homepage = this;
    Page.fetch(function(html) {
        //Utils.cleanLinks(html);
        //Utils.cleanImages(html);
        $scope.homepage.html = html;
    });
}]);