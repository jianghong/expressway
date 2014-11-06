var app = angular.module('ExpressWay', ['ngRoute', 'ngMaterial']);

app.config(['$routeProvider',
  function($routeProvider){
    $routeProvider.
      when('/', {
        templateUrl: 'templates/marketing.html',
        controller: 'MarketingController'
      }).
      when('/apply', {
        templateUrl: 'templates/apply.html',
        controller: 'ApplyController'
      }).
      when('/search', {
        templateUrl: 'templates/search.html',
        controller: 'SearchController'
      }).
      when('/search/:question', {
        templateUrl: 'templates/results.html',
        controller: 'ResultsController'
      }).
      when('/apply/federalskilledworker', {
        templateUrl: 'templates/federalskilledworker.html',
        controller: 'FSWController'
      }).
      otherwise({
        redirectTo: '/'
      });
  }])

app.controller('BodyController', function($scope) {
  
});

app.controller('MainController', function($scope, $location, $rootScope, answersModel, $window) {
  var MAIN_THEME_CLASS = 'md-blue-theme';
  var hamburgerIconSrc = 'static/img/hamburger-icon.png';
  var backIconSrc = 'static/img/back-icon.png';
  var searchIconWSrc = 'static/img/search-icon.png';
  var searchIconBSrc = 'static/img/search-icon-b.png';

  $scope.isSearchContext = false;
  $scope.leftControlIconSrc = hamburgerIconSrc;
  $scope.leftControlTitle = 'ExpressWay';
  $scope.searchIconSrc = searchIconWSrc;
  $rootScope.isLoading = false;
  $rootScope.inputIsFocused = false;
  $rootScope.toolbarIsShrunk = $location.path() === '/' ? false : true;
  $scope.isApply = $location.path() !== '/' ? true : false;

  $scope.results = answersModel.answers ? answersModel.answers.question.answers : [];

  $scope.searchPlaceholder = "Where do I get my immigration forms?";

  $scope.suggestedQuestions = [
    {
      question: 'How do I immigrate to Canada?'
    },
    {
      question: 'How do I get a work permit?'
    },
    {
      question: 'What is the processing time of a work permit?'
    },
    {
      question: 'What work programs can I apply for?'
    }
  ];

  $scope.searchContext = function() {
    $scope.switchContext('/search');

  }

  $scope.inputBlur = function() {
    $scope.inputIsFocused = false;
  }

  $scope.applyContext = function() {
    $location.path('/apply');
    $rootScope.toolbarIsShrunk = true;
    $scope.isApply = true;
    $window.scrollTo(0, 0)
  }

  $scope.mainContext = function() {
    if (!$scope.isApply) {
      $rootScope.toolbarIsShrunk = false;
    }
    if (!$scope.isSearchContext) {
      $scope.isApply = false;
      $rootScope.toolbarIsShrunk = false;
      $location.path('/');
    }
    $scope.switchContext('/');
  }

  $scope.resultsContext = function() {
    $rootScope.isLoading = true;
    // console.log($scope.question);
    answersModel.askWatson($scope.question).then(function(data) {
      // console.log(data);
      answersModel.setData(data);
      // $location.path('/search/' + $scope.question);
      $scope.results = answersModel.answers.question.answers;
    }, function(error) {
      // console.log('error');
    }).finally(function() {
      $rootScope.isLoading = false;
    });
  }

  $scope.fswContext = function() {
    $location.path('/apply/federalskilledworker');
    $scope.isApply = true;
  }

  function switchContext(context) {
    // console.log(context);
    if (context.indexOf('/search') >= 0) {
      $scope.leftControlTitle = 'Back';
      $scope.isSearchContext = true;
      $scope.searchPlaceholder = "Ask Watson...";
      $scope.leftControlIconSrc = backIconSrc;
      $scope.searchIconSrc = searchIconBSrc;
      $scope.isSearchContext = true;
      $scope.inputIsFocused = true;
      $rootScope.toolbarIsShrunk = true;

    } else {
      $scope.leftControlTitle = 'ExpressWay';
      $scope.isSearchContext = false;
      $scope.searchPlaceholder = "Where do I get my immigration forms?";
      $scope.leftControlIconSrc = hamburgerIconSrc
      $scope.searchIconSrc = searchIconWSrc;
      $scope.isSearchContext = false;

    }
  }


  $rootScope.switchContext = switchContext;
 });

app.controller('MarketingController', function($scope, answersModel) {
  $scope.mainCard = {
    actionText: 'Start Asking',
    tagline: 'Immigrate with ease.',
    firstP: 'We are an immigration research tool that assist immigrants around the world.',
    secondP: 'With the power of Watson we answer natural language questions.'
  };



  $scope.testimonials = [
    {
      name: 'Don Handerson',
      quote: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam tincidunt tristique sem at ornare. Morbi vel augue eu eros euismod vulputate. Praesent tortor ante, imperdiet quis tellus sed, fermentum viverra elit.'
    },
    {
      name: 'Nancy Policks',
      quote: 'Donec sed porttitor ex, a tincidunt elit. Maecenas tincidunt tincidunt urna, aliquam imperdiet felis tincidunt in. Nunc et arcu eros.'
    },
    {
      name: 'Helen Mario',
      quote: 'Maecenas et orci quis dui eleifend efficitur. Vestibulum augue odio, luctus at consectetur a, luctus in odio. Suspendisse suscipit lacus ut lobortis imperdiet. Nullam elementum elementum mi nec faucibus.'
    }
  ];
});

app.controller('ApplyController', function($scope) {
  $scope.nexting = true;
  $scope.tabIndex = 0;
  $scope.personalQResponses = {
    age: '',
    hasFamilyInCanada: false,
    hasAccreditedCanadianDegree: false,
    currentStatus: '',
    inCanada: false,
    yearsInCanada: '',
    occupation: '',
    reason: '',
    fluent: '',
    armedForces: ''


  }

  $scope.nextPage = function() {
    $scope.tabIndex += 1;
    $scope.nexting = true;
  }

  $scope.previousPage = function() {
    $scope.tabIndex -= 1;
    $scope.nexting = false;
  }
});

app.controller('SearchController', function($scope) {
});

app.controller('FSWController', function($scope) {
  $scope.nexting = true;
  $scope.tabIndex = 0;
  $scope.personalQResponses = {
    age: '',
    hasFamilyInCanada: false,
    hasAccreditedCanadianDegree: false,
    currentStatus: '',
    inCanada: false,
    yearsInCanada: '',
    occupation: '',
    reason: '',
    fluent: '',
    armedForces: ''


  }

  $scope.nextPage = function() {
    $scope.tabIndex += 1;
    $scope.nexting = true;
  }

  $scope.previousPage = function() {
    $scope.tabIndex -= 1;
    $scope.nexting = false;
  }
});

// TODO: What questions should we hardcode to suggest?
app.controller('SuggestionsController', function($scope) {
  $scope.suggestedQuestions = [
    {
      question: 'What is ...?'
    },
    {
      question: 'What is your ...?'
    }
  ];
});

app.controller('ResultsController', function($scope, $routeParams, answersModel) {
  // console.log(answersModel.answers);
  if (!answersModel.answers) {
    answersModel.askWatson($routeParams.question).then(function(data) {
      answersModel.setData(data);
      $scope.answers = answersModel.answers.question.answers;
    }, function(error) {
      // console.log('error');
    });

  } else {
    $scope.answers = answersModel.answers.question.answers;
  }
});

app.run( function($rootScope, $location) {
   $rootScope.$watch(function() {
      return $location.path();
    },
    function(a){
      $rootScope.switchContext(a);
    });
});

app.service('answersModel', function($http, $q) {
  var watsonRoute = 'http://54.69.43.163/ask';

  this.askWatson = function(question) {
    return $q(function(resolve, reject) {
      $http.get(watsonRoute, {params: {q: question}}).
      success(function(data, status, headers, config) {
        resolve(data);
      }).
      error(function(error, status, headers, config) {
        reject(error);
      });
    });
  }

  this.setData = function(data) {
    this.answers = data;
  }
});

app.directive('toolbarAnimate', function($window){
    return {
        link: function($scope, $element, $attributes){
            $attributes.$observe('isSearching', function(value){
              if (value === 'true') {
                $element.animate({
                  height: '64px'
                }, 100, function() {
                });
              }
            });
        }
    };
});

app.directive('infoAnimate', function(){
    return {
        link: function(scope, element, attributes){
            attributes.$observe('isSearching', function(value){
              console.log(value);
              if (value === 'true') {
                element.slideUp(50);
              } else {
                element.slideDown(300);
              }
            });
        }
    };
});
