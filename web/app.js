/**
 * Created by rajanchaudhary on 3/9/16.
 */
var parentOf = angular.module('parentOf', [ 'restangular']);

parentOf.factory('hlRestangular', ['Restangular', function (Restangular) {
    return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl("http://localhost:3009");
        RestangularConfigurer.setDefaultHttpFields({
            timeout: 15000
        });
    });
}]);

parentOf.controller('mainCtrl',function ($scope) {
    $scope.url = "register.html"
    $scope.$on('redirect', function(e, u){
        console.log('redirect')
        $scope.url = u;
    })
})

parentOf.controller('registrationCtrl', function ($scope, hlRestangular) {
    $scope.user  = {
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        referredBy: '',
        password: '',
        ageGroup: ''
    }
    $scope.register = function () {
        hlRestangular.one("user").one('register').customPOST({user: $scope.user}).then(function (res) {
           console.log(res)
        })
    }
})
parentOf.controller('loginCtrl', function ($scope, hlRestangular) {
    $scope.user  = {
        email: '',
        password: ''
    }
    $scope.register = function () {
        hlRestangular.one("user").one('login').customPOST({user: $scope.user}).then(function (res) {
            console.log(res)
        })
    }
})
parentOf.controller('listPoCtrl', function ($scope, hlRestangular) {
    hlRestangular.one('')
})

