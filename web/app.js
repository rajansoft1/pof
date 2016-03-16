/**
 * Created by rajanchaudhary on 3/9/16.
 */
var inventory = angular.module('inventory', [ 'restangular']);
inventory.factory('hlRestangular', ['Restangular', function (Restangular) {
    return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl("http://localhost:3007");
        RestangularConfigurer.setDefaultHttpFields({
            timeout: 15000
        });
    });
}]);
inventory.controller('mainCtrl',function ($scope) {
    $scope.url = ""
})
inventory.controller('addPurchaseOrderCtrl', function ($scope, hlRestangular) {
    hlRestangular.one("item").get({}).then(function (res) {
        console.log(res)
        $scope.items = res.data;
    })
})

inventory.controller('listPoCtrl', function ($scope, hlRestangular) {
    hlRestangular.one('')
})

