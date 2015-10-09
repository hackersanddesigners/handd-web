/**
 * Created by lucianblankevoort on 08/10/15.
 */
myApp.controller('mainCtrl', ['Page', '$scope', function(Page, $scope) {
    //URL http://server.com/index.html#/?page=pageId
    // Route: /:pageId
    //$routeParams ==> {pageId: '%27Awkward%27_Error'};
    //$route.current.params;
    var pageId = '%27Awkward%27_Error';
    $scope.homepage = this;
    Page.fetch(pageId, function(html) {
        //Utils.cleanLinks(html);
        //Utils.cleanImages(html);
        $scope.homepage.html = html;
    });
}]);