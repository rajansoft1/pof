/**
 * Created by rajanchaudhary on 3/9/16.
 */
var parentOf = angular.module('parentOf', [ 'restangular', 'ui.router', 'LocalStorageModule', 'cgNotify' ]);
parentOf.config(function($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        // login screen
        .state('login', {
            url: '/login',
            templateUrl: 'login.html',
            controller: 'loginCtrl'
        })

        // register screen
        .state('register', {
            url: '/register',
            templateUrl: 'register.html',
            controller: 'registrationCtrl'
        })

        // Home screen
        .state('home', {
            url: '/home',
            templateUrl: 'question.html',
            controller: 'questionsCtrl'
        })

        .state('activate', {
            url: '/activate',
            templateUrl: 'activate.html',
            controller: 'activateCtrl'
        })
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/home');

});

parentOf.config(function (localStorageServiceProvider) {
    localStorageServiceProvider
        .setPrefix('pof');
    localStorageServiceProvider
        .setStorageType('localStorage');
});

parentOf.run(function ($rootScope, $state, $location, localStorageService) {

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {

        var loggedIn = localStorageService.get('user');
        // NOT authenticated - wants any private stuff
        if(!loggedIn && toState.name !== "login"&& toState.name !== "register")
        {
            $state.go('register');
            event.preventDefault();
            return;
        }


        // unmanaged
    });
});

parentOf.factory('hlRestangular', ['Restangular', function (Restangular) {
    return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl("http://localhost:3009");
        RestangularConfigurer.setDefaultHttpFields({
            timeout: 15000
        });
    });
}]);
parentOf.controller('activateCtrl',function ($scope) {
})

parentOf.controller('mainCtrl',function ($scope) {
    $scope.url = "register.html"
    $scope.$on('redirect', function(e, u){
        //console.log('redirect')
        $scope.url = u;
    })
})

parentOf.controller('registrationCtrl', function ($scope, hlRestangular, $state, localStorageService, notify) {
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
            if(res.status != 'error') {
                localStorageService.set('user', $scope.user)
                $state.go('activate');
            }
            else{
                notify(res.message)
            }
        })
    }

})
parentOf.controller('loginCtrl', function ($scope, hlRestangular) {
    $scope.user  = {
        email: '',
        password: ''
    }
    $scope.login = function () {
        hlRestangular.one("user").one('login').customPOST($scope.user).then(function (res) {
            console.log(res)
        })
    }
})

parentOf.controller('questionsCtrl', function($scope, hlRestangular, localStorageService){
    $scope.questions = [
        {"question": "Which is largest",
            "options": [1,2,3,4,5],
            'answer': ''
        },
        {"question": "Which is largest",
            "options": [2,3,4,5,6],
            "answer":''
        },
        {"question": "Which is largest",
            "options": [2,3,4,5,6],
            "answer":''
        }
    ]

    hlRestangular.one('user').customGET(localStorageService.get('user').email)

    $scope.submit = function(){
        console.log($scope.questions)
    }

})


