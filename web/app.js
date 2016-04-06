/**
 * Created by rajanchaudhary on 3/9/16.
 */
var parentOf = angular.module('parentOf', ['restangular', 'ui.router', 'LocalStorageModule', 'cgNotify']);
parentOf.config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

        // login screen
        .state('login', {
            url: '/login',
            templateUrl: 'app/views/login.html',
            controller: 'loginCtrl'
        })

        // register screen
        .state('register', {
            url: '/register',
            templateUrl: 'app/views/register.html',
            controller: 'registrationCtrl'
        })
        .state('refer', {
            url: '/refer',
            templateUrl: 'app/views/refer.html',
            controller: 'referCtrl'
        })
        // Home screen
        .state('home', {
            url: '/home',
            templateUrl: 'app/views/question.html',
            controller: 'questionsCtrl'
        })

        .state('activate', {
            url: '/activate',
            templateUrl: 'app/views/activate.html',
            controller: 'activateCtrl'
        })
        .state('about', {
            url: '/about',
            templateUrl: 'app/views/landingpage-01.html',
            controller: 'aboutCtrl'
        }).state('question-done', {
            url: '/question-done',
            templateUrl: 'app/views/questionDone.html',
            controller: 'questionDoneCtrl'
        }).state('thanks',{
            url: '/thanks',
            templateUrl: 'app/views/thankyou.html'
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
        if (!loggedIn && toState.name !== "login" && toState.name !== "register"&& toState.name !== "thanks") {
            $state.go('login');
            event.preventDefault();
            return;
        }


        // unmanaged
    });
});

parentOf.factory('hlRestangular', ['Restangular', function (Restangular) {
    return Restangular.withConfig(function (RestangularConfigurer) {
        RestangularConfigurer.setBaseUrl("http://api.parentof.com");
        RestangularConfigurer.setDefaultHttpFields({
            timeout: 15000
        });
    });
}]);
parentOf.controller('activateCtrl', function ($scope) {
})

parentOf.controller('mainCtrl', function ($scope) {
    $scope.url = "app/views/about.html"
    $scope.$on('redirect', function (e, u) {
        //console.log('redirect')
        $scope.url = u;
    })

    $scope.hideExtra = true;
    $scope.$on('showExtra', function(){
        $scope.hideExtra = true;
    })
})
parentOf.controller('questionDoneCtrl', function($scope){

})
parentOf.controller('registrationCtrl', function ($scope, hlRestangular, $state, localStorageService, notify, $location

) {
    var qs = $location.search();
    $scope.refer = qs["refer"]
    $scope.user = {
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        referredBy: $scope.refer,
        password: '',
        ageGroup: ''
    }
    $scope.register = function () {

        if($scope.refer){
            hlRestangular.one("user").one("id").customGET($scope.refer).then( function(valid){
                if(valid.data) {
                    hlRestangular.one("user").one('register').customPOST({user: $scope.user}).then(function (res) {
                        $scope.user.password = null
                        localStorageService.set('user', $scope.user)
                        if (res.status != 'error') {
                            localStorageService.set('user', res.data)
                            $state.go('activate');
                        }
                        else {
                            notify(res.data.message)
                        }
                    })
                }
                else{

                }
            })
        }

    }
})
parentOf.controller('loginCtrl', function ($scope, hlRestangular, $state, localStorageService,$location) {
    var qs = $location.search();
    $scope.refer = qs["refer"]
    $scope.user = {
        email: '',
        password: ''
    }
    $scope.login = function () {
        hlRestangular.one("user").one('login').customPOST($scope.user).then(function (res) {
            console.log(res)
            if (res.data._id) {

                $state.go('home')

            }
        })
    }
})

parentOf.controller('referCtrl', function ($scope, hlRestangular, localStorageService, $state) {
    $scope.contacts = []
    $scope.addEmail = function () {
        $scope.contacts.push({email: '', name: ''})
    }
    $scope.save = function () {
        hlRestangular.one('refer').customPOST({
            contacts: $scope.contacts,
            email: localStorageService.get('user').email
        }).then(function () {
            notify('Referral sent')
            $state.go('home')
        })
    }
    $scope.addEmail();
})
var Yes = "Yes"
var No = "No"
parentOf.controller('questionsCtrl', function ($scope, hlRestangular, localStorageService, $state) {

    var question34 = [
        {
            "question": "In the kitchen, does your child look around and see what's kept where?",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "Does your child enjoy going around the kitchen and watching things in the kitchen?",
            "options": ["Yes", "No"],
            "answer": ""
        },
        {
            "question": "During festivals or events, does your child watch the activities/rituals keenly and with interest?",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "Does your child enjoy watching the events/rituals?",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "When watching others dress up, does your child observe actions like tying laces, buttoning, combing hair?",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "Does s/he enjoy watching dressing up activities?",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "In a mall or a supermarket: Does your child look around for different things like toys, shoes, clothes, etc.?",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "Enjoys finding what items are kept where in the mall?",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "Knows where items are kept in the mall, especially the things which s/he wants.",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "Insists on buying what s/he wants after knowing where it is.",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "With surfaces: The child knows different surfaces like smooth or rough",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "The child touches different surfaces",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "Enjoys telling you if the surface is smooth or rough",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "Holds crayons or pencils between thumb and finger ",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "Enjoys drawing and scribbling with the crayons and pencils",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "While playing with Sand or Mud, the child holds Sand or Mud in his/her hand",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "Enjoys making balls with Sand or Mud",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "The child knows what is a stick",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "Uses stick in different ways like stirring, pushing, pulling, showing for hitting, batting, etc.",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "Enjoys using the stick in different ways",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "Regularly finds new ways of using the stick",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "The child knows what is a plate and a glass",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "Manipulates the plates and glasses by turning and twisting",
            "options": [Yes, No],
            'answer': ''
        },
        {
            "question": "Enjoys playing with plates and glasses",
            "options": [Yes, No],
            'answer': ''
        }
    ]
    var question45 =
        [
            {
                "question": "Does your child approach other children in a park/playground to play?",
                "options": [Yes, No],
                "answer": ""
            },
            {
                "question": "Does your child feel happy while approaching other children in a park/playground?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he manage to talk to other children in the park/playground and have a conversation?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he try to become friends with children in the park/playground?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he greet visitors who come home?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Is s/he happy to greet the visitors who come home?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he answer questions asked by visitors?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he give their toys to other children to play?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Is s/he happy while sharing toys with others?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "When s/he sees a sick person, does your child show concern for them?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "When someone is sick, does s/he try to stay silent?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "If someone around the child is sick, does s/he play by themselves, without bothering the sick person?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "When s/he finds that someone is sick, does your child try to help them by massaging their head or pressing the hand, etc?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does the child pretend to be in pain sometimes, and fakes pain?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he enjoy faking pain, and acting like in pain?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he manage to stay quiet, and pretend to be sad while faking pain?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does your child know when a person is a stranger?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he avoid the stranger and does not approach/talk to them?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Is s/he is scared and apprehensive of the stranger?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he know and recognise friends?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he comfortably approach friends?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Is s/he happy when they see a friend?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he always enjoy being with a friend?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Is s/he able to have talks and conversations with a friend?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he show concern when the friend is hurt?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does the child watch funny/comedy sequences on TV?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he scream in delight for funny scenes?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he want to see the funny scene again and again?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he know how to make up a story?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he narrate and tell you a story made up by self?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he enjoy the story and talks like s/he believes in it?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he narrate the story calmly and confidently?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he own a set of toys and knows all about it?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he take the toys to school or around the neighbourhood?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he brag and talk about the toy with others?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "When the child talks, does s/he know what they want?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he say what they need, clearly using words?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he feel happy when the other person understands what the child wants?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he use the right words to express his/her need?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does the child know what it wants when throwing a tantrum?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "In a tantrum, does s/he start shouting or rolling on the ground immediately?",
                "options": [Yes, No],
                'answer': ''
            },
            {
                "question": "Does s/he feel sad when the need is not understood or fulfilled?",
                "options": [Yes, No],
                'answer': ''
            },
        ]


    if (localStorageService.get('user').ageGroup == '3-4') {
        $scope.questions = question34;
    } else {
        $scope.questions = question45;
    }
    $scope.questions = question34;


    $scope.starRating = 5
    $scope.starSubmit = function () {
        $scope.submit = function () {
            hlRestangular.one('user').one('rating').customPOST({
                email: localStorageService.get('user').email,
                rating: $scope.starRating
            }).then(function (res) {

            })
        }
    }
    hlRestangular.one('user').customGET(localStorageService.get('user').email).then(function (data) {
        if (data.data) {
            $scope.answered = data.data.questions
            console.log($scope.answered)
        }
        if (data.data.resultLink) {
            $scope.token = data.data.resultLink;

        }
    })

    $scope.submit = function () {
        hlRestangular.one('user').one('questions').customPOST({
            email: localStorageService.get('user').email,
            questions: $scope.questions
        }).then(function (res) {
            if (res.data.questions) {
                $state.go('question-done')
            }
        })
    }

})

parentOf.directive('starRating', function () {
    return {
        scope: {
            rating: '=',
            maxRating: '@',
            readOnly: '@',
            click: "&",
            mouseHover: "&",
            mouseLeave: "&"
        },
        restrict: 'EA',
        template: "<div style='display: inline-block; margin: 0px; padding: 0px; cursor:pointer;' ng-repeat='idx in maxRatings track by $index'> \
                    <img ng-src='{{((hoverValue + _rating) <= $index) && \"http://www.codeproject.com/script/ratings/images/star-empty-lg.png\" || \"http://www.codeproject.com/script/ratings/images/star-fill-lg.png\"}}' \
                    ng-Click='isolatedClick($index + 1)' \
                    ng-mouseenter='isolatedMouseHover($index + 1)' \
                    ng-mouseleave='isolatedMouseLeave($index + 1)'></img> \
            </div>",
        compile: function (element, attrs) {
            if (!attrs.maxRating || (Number(attrs.maxRating) <= 0)) {
                attrs.maxRating = '5';
            }
            ;
        },
        controller: function ($scope, $element, $attrs) {
            $scope.maxRatings = [];

            for (var i = 1; i <= $scope.maxRating; i++) {
                $scope.maxRatings.push({});
            }
            ;

            $scope._rating = $scope.rating;

            $scope.isolatedClick = function (param) {
                if ($scope.readOnly == 'true') return;

                $scope.rating = $scope._rating = param;
                $scope.hoverValue = 0;
                $scope.click({
                    param: param
                });
            };

            $scope.isolatedMouseHover = function (param) {
                if ($scope.readOnly == 'true') return;

                $scope._rating = 0;
                $scope.hoverValue = param;
                $scope.mouseHover({
                    param: param
                });
            };

            $scope.isolatedMouseLeave = function (param) {
                if ($scope.readOnly == 'true') return;

                $scope._rating = $scope.rating;
                $scope.hoverValue = 0;
                $scope.mouseLeave({
                    param: param
                });
            };
        }
    };
});
