var SAMPLE_Q1 = 'what is cec?'
var SAMPLE_Q2 = 'what work experience can i use for cec?'
var SAMPLE_Q3 = 'what are the language requirements for cec?'
var STATIC_IMG_ROUTE = 'static/img'

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
      when('/apply/inside', {
        templateUrl: 'templates/apply.html',
        controller: 'InsideController'
      }).
      when('/apply/outside', {
        templateUrl: 'templates/apply.html',
        controller: 'OutsideController'
      }).      
      when('/apply/demo', {
        templateUrl: 'templates/demo.html',
        controller: 'DemoController'
      }).
      when('/apply/outside/permanent', {
        templateUrl: 'templates/programlist.html',
        controller: 'OutsidePermanentController'
      }).
      when('/apply/outside/temporarily', {
        templateUrl: 'templates/programlist.html',
        controller: 'OutsideTemporaryController'
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
      question: 'How much money should I declare for CEC?'
    },
    {
      question: 'What work experience can I use for CEC?'
    },
    {
      question: 'What are the language requirements for CEC?'
    },
    {
      question: 'Will my off-campus work count towards CEC?'
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
      $scope.results = answersModel.answers.question.evidencelist;
      console.log($scope.results);
    }, function(error) {
      // console.log('error');
    }).finally(function() {
      $rootScope.isLoading = false;
    });
  }

  $scope.askOnClick = function(ev) {
    $scope.question = ev.currentTarget.innerText;
    $scope.resultsContext();
  }
  $scope.fswContext = function() {
    $location.path('/apply/federalskilledworker');
    $scope.isApply = true;
  }

  $scope.demoContext = function() {
    $location.path('/apply/demo');
    $scope.isApply = true;
  }

  function switchContext(context) {
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
  $scope.sectionTitle = "Tell us where you are.";

  $scope.categories = [
    {
      name: "Inside Canada",
      imgSrc: STATIC_IMG_ROUTE + "/insidecanada.png",
      href: "/#/apply/inside",
      description: "Find your way into Canada."
    },
    {
      name: "Outside Canada",
      imgSrc: STATIC_IMG_ROUTE + "/outsidecanada.png",
      href: "/#/apply/outside",
      description: "Extend your stay or bring your family over."
    }
  ];
});

app.controller('InsideController', function($scope) {
  $scope.sectionTitle = "What would you like to do in Canada?";
  $scope.bannerColor = '#C55C5E';
  $scope.bannerIconSrc = STATIC_IMG_ROUTE + '/insidecanada.png';

  $scope.categories = [
    {
      name: "Extend my stay",
      imgSrc: STATIC_IMG_ROUTE + "/outsidesponsor.png",
      href: "/#/apply/inside/extend"
    },
    {
      name: "Sponsor someone",
      imgSrc: STATIC_IMG_ROUTE + "/outsideextend.png",
      href: "/#/apply/inside/sponsor"
    },
    {
      name: "Stay permanently",
      imgSrc: STATIC_IMG_ROUTE + "/outsidepermanent.png",
      href: "/#/apply/inside/permanent"
    },
    {
      name: "Obtain citizenship",
      imgSrc: STATIC_IMG_ROUTE + "/citizenship.png",
      href: "/#/apply/inside/citizenship"
    }        
  ];
});

app.controller('OutsideController', function($scope) {
  $scope.sectionTitle = 'Outside Canada';
  $scope.bannerColor = '#79C2AF';
  $scope.bannerIconSrc = STATIC_IMG_ROUTE + '/outsidecanada.png';

  $scope.categories = [
    {
      name: "Stay temporarily",
      imgSrc: "http://lorempixel.com/600/600/food/",
      href: "/#/apply/outside/temporary"
    },
    {
      name: "Stay permanently",
      imgSrc: "http://lorempixel.com/700/700/food/",
      href: "/#/apply/outside/permanent"
    }
  ];
});

app.controller('OutsideTemporaryController', function($scope) {
  $scope.sectionTitle = "What would you like to do in Canada?";

  $scope.categories = [
    {
      name: "Stay temporarily",
      imgSrc: "http://lorempixel.com/600/600/food/",
      href: "/#/apply/outside/temporary"
    },
    {
      name: "Stay permanently",
      imgSrc: "http://lorempixel.com/700/700/food/",
      href: "/#/apply/outside/permanent"
    }
  ];
});

app.controller('OutsidePermanentController', function($scope) {
  $scope.sectionTitle = "Here are your options to apply from outside Canada for permanent stay";

  $scope.categories = [
    {
      name: "Skilled Worker Class",
      disabled: true,
      href: ""
    },
    {
      name: "Skilled Trades Class",
      disabled: true,
      href: ""
    },
    {
      name: "Quebec Investors and Entrepreneurs",
      disabled: true,
      href: ""
    },
    {
      name: "Self-Employed Persons",
      disabled: true,
      href: ""
    },
    {
      name: "Start up Visa",
      disabled: true,
      href: ""
    },
    {
      name: "Canadian Experience Class",
      disabled: true,
      href: ""
    },
    {
      name: "Provincial Nominees",
      disabled: true,
      href: ""
    },
    {
      name: "Quebec-Selected Skilled Workers",
      disabled: true,
      href: ""
    },
    {
      name: "Family Class",
      disabled: true,
      href: ""
    },
    {
      name: "Family Class",
      disabled: true,
      href: ""
    },
    {
      name: "Convention Refugees Abroad and Humanitarian and Protected Persons Abroad",
      disabled: true,
      href: ""
    },
    {
      name: "Perons being sponsored under a Public Policy",
      disabled: true,
      href: ""
    },                   
  ];
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
      $scope.answers = answersModel.answers.question.evidencelist;
    }, function(error) {
      // console.log('error');
    });

  } else {
    $scope.answers = Array(answersModel.answers.question.answers[0]);
  }
});

app.controller('DemoController', function($scope, $mdDialog) {
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

  $scope.showPreview = function(ev) {$mdDialog.show({controller: DialogController,
      templateUrl: 'templates/previewdialog.html',
      targetEvent: ev,
    });
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

function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}

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
        // if (question.toLowerCase() === SAMPLE_Q1) {
        //   data.question.answers.unshift({
        //     confidence: 0.4954,
        //     id: 0,
        //     text: 'After you have lived in Canada for some time, you may have good English or French skills, the right kind of skilled work experience, and be used to Canadian society. The Canadian Experience Class (CEC) was created to help people like this take part in the Canadian economy.',
        //     source: 'http://www.cic.gc.ca/English/immigrate/cec/index.asp'
        //   });
        // } else if (question.toLowerCase() === SAMPLE_Q2) {
        //   data.question.answers.unshift({
        //     confidence: 0.544,
        //     id: 0,
        //     text: "To work in Canada after graduating, your best option is to apply for a post-graduation work permit. These permits may be valid for up to three years. To qualify for the CEC, remember that at least one year of your work experience must be in a skilled occupation. It is also important to note that work experience you may have acquired as part of your academic program, such as an internship or a co-op placement, does not qualify under the CEC. Part-time work you may have performed during your studies does not qualify either.",
        //     source: 'http://www.cic.gc.ca/english/resources/publications/cec.asp#requirements'
        //   });
        // } else if (question.toLowerCase() === SAMPLE_Q3) {
        //   data.question.answers.unshift({
        //     confidence: 0.6011,
        //     id: 0,
        //     text: "To qualify for the CEC, you must prove your proficiency in one of Canada's two official languages, which are English and French. The four linguistic abilities are speaking, reading, listening and writing. The required level of ability in English or French will vary according to your occupation. For example, the language requirements for managerial and professional positions are higher than the requirements for positions in technical occupations or skilled trades. To prove your language skills, you will need to take a language test approved by CIC and include those results with your application.",
        //     source: 'http://www.cic.gc.ca/english/resources/publications/cec.asp#requirements'
        //   });
        // }
        resolve(data);
      }).
      error(function(error, status, headers, config) {
        reject(error);
      });
    });
  }

  this.setData = function(data) {
    this.answers = data;
    angular.forEach(data.question.evidencelist, function(obj, i) {
      obj.value = obj.value * 100;
      obj.value = obj.value + '%';
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
              if (value === 'true') {
                element.slideUp(50);
              } else {
                element.slideDown(300);
              }
            });
        }
    };
});
