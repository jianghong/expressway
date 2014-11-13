var SAMPLE_Q1 = 'what is the national occupational classification?'
var SAMPLE_Q2 = 'what does it mean to be fluent in english or french?'
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
    answersModel.askWatson($scope.question).then(function(data) {
      answersModel.setData(data);
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
        // hard code answer
        if (question.toLowerCase() === SAMPLE_Q1) {
          data.question.answers.unshift({
            confidence: 0.74,
            id: 0,
            text: 'The National Occupational Classification (NOC) is the official governmental classification and description of occupations in the Canadian economy. The NOC identifies and groups occupations in the Canadian economy by skill type and level based on the tasks, duties and responsibilities of the occupation. The NOC is available on the Human Resources and Skills Development Canada (HRSDC) website at: http://www5.hrsdc.gc.ca/NOC',
            source: 'http://www5.hrsdc.gc.ca/NOC'
          });
        } else if (question.toLowerCase() === SAMPLE_Q2) {
          data.question.answers.unshift({
            confidence: 0.89,
            id: 0,
            text: "Language proof if you are 18-54 years of age Select one of the following types of proof to submit with your application: Results of an accepted third-party test at the equivalent of Canadian Language Benchmark (CLB/NCLC) / Niveaux de competence linguistique canadiensFootnote 1 level 4 or higher in speaking and listening either done previously for immigration purposes (acceptable even if expired) or done specifically for citizenship purposes. Test results from the following list are acceptable: Canadian English Language Proficiency Index Program General Test (CELPIP-G), not the academic version or the CELPIP-General LS two-skill (listening and speaking) version of the CELPIP general test. For tests taken after April 1, 2014, you must have achieved a score of level 4 or higher (up to 12) in listening and speaking For tests taken before April 1, 2014, you must have achieved a score of 2H or higher (i.e., 3L, 3H, 4L, 4H, 5L, or 5H) in listening and speaking. International English Language Testing System (IELTS), general training, not the academic version You must have achieved a score of: 4.0 or higher in speaking, and 4.5 or higher in listening. (Please note: If the test was done before November 28, 2008, we will accept a level 4 or higher); or Test d'Evaluation de Francais (TEF), Test d'Evaluation du Francais adapte au Quebec (TEFAQ) or TEF pour la naturalisation. After July 1st, 2012, you must have achieved a score of : Niveau B1, B2, C1 or C2 in Comprehension de l'oral and Expression orale Before July 1st, 2012, you must have achieved a score of: Niveau 3 or higher in Comprehension de l'oral and Expression orale. (Please note: if the Test d'Evaluation de Francais (TEF) was taken before July 1st, 2012, a level 3 is required for expression orale only. This applies only to the TEF and not the TEFAQ or TEF pour la naturalisation).",
            source: 'http://www.cic.gc.ca/english/information/applications/guides/EG7TOC.asp#factor2'
          });
        }
        console.log(data);
        resolve(data);
      }).
      error(function(error, status, headers, config) {
        reject(error);
      });
    });
  }

  this.setData = function(data) {
    this.answers = data;
    angular.forEach(data.question.answers, function(obj, i) {
      obj.confidence = obj.confidence * 100;
      obj.confidence = obj.confidence + '%';
    });
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
