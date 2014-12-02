var SAMPLE_Q1 = 'Can I work in Canada after I graduate?'
var SAMPLE_Q2 = 'What is PGWPP?'
var SAMPLE_Q3 = 'What are the requirements for the Canadian Experience class?'
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
      when('/apply/outside/temporary', {
        templateUrl: 'templates/programlist.html',
        controller: 'OutsideTemporaryController'
      }).
      when('/apply/inside/extend', {
        templateUrl: 'templates/programlist.html',
        controller: 'InsideExtendController'
      }).
      when('/apply/inside/permanent', {
        templateUrl: 'templates/programlist.html',
        controller: 'InsidePermanentController'
      }).      
      when('/apply/all', {
        templateUrl: 'templates/allprograms.html',
        controller: 'AllProgramsController'
      }).
      when('/overview/cec', {
        templateUrl: 'templates/overview.html',
        controller: 'CECOverviewController'
      }).
      when('/overview/new-study-permit', {
        templateUrl: 'templates/overview.html',
        controller: 'NewStudyOverviewController'
      }).
      when('/overview/extend-study-permit', {
        templateUrl: 'templates/overview.html',
        controller: 'ExtendStudyOverviewController'
      }).            
      otherwise({
        redirectTo: '/'
      });
  }])

app.controller('BodyController', function($scope) {

});

app.controller('MainController', function($scope, $location, $rootScope, AnswersModel, $window, $mdDialog) {
  var MAIN_THEME_CLASS = 'md-blue-theme';
  var hamburgerIconSrc = 'static/img/hamburger-icon.png';
  var backIconSrc = 'static/img/back-icon.png';
  var searchIconWSrc = 'static/img/search-icon.png';
  var searchIconBSrc = 'static/img/search-icon-b.png';

  $scope.isSearchContext = false;
  $scope.leftControlIconSrc = hamburgerIconSrc;
  $scope.leftControlTitle = 'EXPRESSWAY';
  $scope.searchIconSrc = searchIconWSrc;
  $rootScope.isLoading = false;
  $rootScope.inputIsFocused = false;
  $rootScope.toolbarIsShrunk = $location.path() === '/' ? false : true;
  $scope.isApply = $location.path() !== '/' ? true : false;
  $scope.imgHover = false;
  $scope.panelHidden = false;
  $scope.animatePeekRow = false;
  $scope.showMegaman = false;
  $rootScope.formProgress = 0;
  $rootScope.canSubmit = true;

  $scope.results = AnswersModel.answers ? AnswersModel.answers.question.answers : [];

  $scope.searchPlaceholder = "Ask your questions here";

  setTimeout(function($scope){
    document.getElementById('marketing-img').className += ' shrink-height';
    document.getElementById('md-opaque').className += ' shrink-height';
  }, 1000);


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
    $scope.panelHidden = false;
    $location.path('/');
  }

  $scope.resultsContext = function() {
    $rootScope.isLoading = true;
    AnswersModel.askWatson($scope.question).then(function(data) {
      AnswersModel.setData(data);
      $scope.results = AnswersModel.answers.question.evidencelist;
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

  $scope.goBack = function() {
    console.log('backing');
    $window.history.back();
  }

  $rootScope.routeMe = function(applicationRoute) {
    console.log("app route:" + applicationRoute);
    $location.path(applicationRoute);
  }

  $scope.hideThePanel = function() {
    $scope.panelHidden = true;
  }

  $rootScope.populateQuestions = function(qArray) {
    $rootScope.suggestedQuestions = qArray;
  }

  function switchContext(context) {
    console.log("context:" + context);
    if (context.indexOf('/search') >= 0) {
      $scope.leftControlTitle = 'Back';
      $scope.isSearchContext = true;
      $scope.searchPlaceholder = "Ask Watson...";
      $scope.leftControlIconSrc = backIconSrc;
      $scope.searchIconSrc = searchIconBSrc;
      $scope.isSearchContext = true;
      $scope.inputIsFocused = true;
      $rootScope.toolbarIsShrunk = true;
      $rootScope.selecedProgramRoute = ''
      $rootScope.selectedProgram = '';
      $rootScope.selectedForm = '';
    } else if (context === '/') {
      $scope.isApply = false;
      $scope.isSearchContext = false;
      $scope.leftControlTitle = 'ExpressWay';
      $rootScope.toolbarIsShrunk = false;
      $rootScope.selecedProgramRoute = ''
      $rootScope.selectedProgram = '';
      $rootScope.selectedForm = '';      
    } else if (context.indexOf('/apply') >= 0) {
      $scope.leftControlTitle = 'ExpressWay';
      $scope.isSearchContext = false;
      $scope.isApply = true;
      $rootScope.toolbarIsShrunk = true;
    } else {
      $scope.isApply = true;
      $scope.isSearchContext = false;
      $scope.searchPlaceholder = "Ask your questions here";
      $scope.leftControlIconSrc = hamburgerIconSrc
      $scope.searchIconSrc = searchIconWSrc;
      $rootScope.selecedProgramRoute = ''
      $rootScope.selectedProgram = '';
      $rootScope.selectedForm = '';      
    }
  }

  $scope.checkout = function(ev) {
    console.log('summon check out');
    $mdDialog.show({controller: DialogController,
      templateUrl: 'templates/overviewdialog.html',
      targetEvent: ev,
    });    
  }

  $rootScope.switchContext = switchContext;
 });

app.controller('ToastCtrl', function() {

});

app.controller('MarketingController', function($scope, AnswersModel, $rootScope) {
  $rootScope.populateQuestions([
    {
      question: 'Can I work in Canada after I graduate?'
    },
    {
      question: 'What are the processing times for extending a study permit?'
    },
    {
      question: 'What do I need to study in Canada?'
    }
  ]);
});

app.controller('ApplyController', function($scope, $location, $rootScope) {
  $scope.sectionTitle = "Tell us where you are.";
  $scope.bannerIconSrc = STATIC_IMG_ROUTE + '/inorout.png';
  $scope.bannerColor = '#78B4D2';

  $rootScope.populateQuestions([
    {
      question: 'Can I apply for status from inside Canada if I am an illegal immigrant?'
    },
    {
      question: 'What are some examples of successful applicants for CEC?'
    },
    {
      question: 'What are my options for immigrating to Canada as a refugee?'
    },
    {
      question: 'How long does it take for a Canadian Experience Class application to get approved?'
    },    
  ]);

  $scope.categories = [
    {
      name: "Inside Canada",
      imgSrc: STATIC_IMG_ROUTE + "/insidecanada.png",
      href:  $location.absUrl() + "/inside",
      description: "Extend your stay or bring your family over."
    },
    {
      name: "Outside Canada",
      imgSrc: STATIC_IMG_ROUTE + "/outsidecanada.png",
      href: $location.absUrl() + "/outside",
      description: "Find your way into Canada."
    }
  ];
});

app.controller('InsideController', function($scope, $location, $rootScope) {
  $scope.sectionTitle = "Apply from inside Canada.";
  $scope.bannerColor = '#C55C5E';
  $scope.bannerIconSrc = STATIC_IMG_ROUTE + '/insidecanada.png';

  $rootScope.populateQuestions([
    {
      question: 'What can I do to extend my stay in Canada?'
    },
    {
      question: 'What are the requirements to sponsor my spouse to Canada?'
    },
    {
      question: 'What languages do I need to speak to apply for citizenship?'
    },
  ]);

  $scope.categories = [
    {
      name: "Extend stay",
      imgSrc: STATIC_IMG_ROUTE + "/insideextend.png",
      description: 'Stay longer in Canada.',
      href: $location.absUrl() + "/extend",
      disabled: false
    },
    {
      name: "Stay permanently",
      imgSrc: STATIC_IMG_ROUTE + "/insidepermanent.png",
      description: 'Live here. Forever.',      
      href: $location.absUrl() + "/permanent",
      disabled: false
    },    
    {
      name: "Sponsor someone",
      imgSrc: STATIC_IMG_ROUTE + "/insidesponsor.png",
      description: 'Bring over someone you care about.',      
      href: $location.absUrl() + "/sponsor",
      disabled: true
    },
    {
      name: "Obtain citizenship",
      imgSrc: STATIC_IMG_ROUTE + "/citizenship.png",
      description: 'Become a new citizen of Canada.',      
      href: $location.absUrl() + "/citizenship",
      disabled: true
    }        
  ];
});

app.controller('OutsideController', function($scope, $location) {
  $scope.sectionTitle = 'Apply from outside Canada.';
  $scope.bannerColor = '#79C2AF';
  $scope.bannerIconSrc = STATIC_IMG_ROUTE + '/outsidecanada.png';


  $rootScope.populateQuestions([
    {
      question: 'How does a temporary worker become a permanent resident?'
    }
  ]);

  $scope.categories = [
    {
      name: "Stay temporarily",
      imgSrc: STATIC_IMG_ROUTE + '/outsidetemp.png',
      description: 'Come see Canada. You might want to stay.',
      href: $location.absUrl() + "/temporary"
    },
    {
      name: "Stay permanently",
      imgSrc: STATIC_IMG_ROUTE + '/outsidepermanent.png',
      description: 'Move to Canada and join the workforce.',
      href: $location.absUrl() + "/permanent"
    }
  ];
});

app.controller('OutsideTemporaryController', function($scope, $location) {
  $scope.sectionTitle = "Apply from outside Canada for a temporary stay.";
  $scope.bannerColor = '#C55C5E';
  $scope.bannerIconSrc = STATIC_IMG_ROUTE + '/outsidetemp.png';

  $scope.available = [
    {
      name: "Study",
      imgSrc: "http://lorempixel.com/700/700/food/",
      href: "/overview/new-study-permit",
      description: 'Apply for a study permit.',
      disabled: false
    }  
  ];

  $scope.notAvailable = [
    {
      name: "Work",
      imgSrc: "http://lorempixel.com/600/600/food/",
      href: $location.absUrl() + "/temporary",
      description: 'Coming soon',
      disabled: true
    },
    {
      name: "Visit",
      imgSrc: "http://lorempixel.com/700/700/food/",
      href: $location.absUrl() + "/permanent",
      description: 'Coming soon',
      disabled: true
    }  
  ];
});

app.controller('InsideExtendController', function($scope, $location, $rootScope) {
  $scope.sectionTitle = 'Apply from inside Canada to extend your stay.';
  $scope.bannerColor = '#505D73';
  $scope.bannerIconSrc = STATIC_IMG_ROUTE + '/insideextend.png';

  $rootScope.populateQuestions([
    {
      question: 'What do I need to renew my study permit?'
    },
    {
      question: 'Are study permits tied to the university I attend?'
    }
  ])
  $scope.available = [
    {
      name: "Study",
      href: "/overview/extend-study-permit",
      description: 'Renew your study permit.',
      disabled: false
    }
  ];
  
    $scope.notAvailable = [
    {
      name: "Work",
      href: $location.absUrl() + "/temporary",
      description: 'Ex vel primis voluptua consequat, vis viderer menandri argumentum at.',
      disabled: true
    },
    {
      name: "Visit",
      href: $location.absUrl() + "/permanent",
      description: 'Iudico omnium sententiae at his, audire intellegam vel ut fabellas.',
      disabled: true
    },
    {
      name: "New Temporary Resident Visa",
      href: $location.absUrl() + "/permanent",
      description: 'Lorem ipsum dolor sit amet, sale sonet eum ne, in.',
      disabled: true
    },
    {
      name: "Temporary Resident Permit",
      href: $location.absUrl() + "/permanent",
      description: 'Ne qui latine sanctus scribentur, cu mei dico detraxit mei.',
      disabled: true
    }         
  ];
});

app.controller('InsidePermanentController', function($scope, $location) {
  $scope.sectionTitle = 'Apply from inside Canada to stay permanently.';
  $scope.bannerColor = '#78B4D2';
  $scope.bannerIconSrc = STATIC_IMG_ROUTE + '/insidepermanent.png';

  $scope.available = [
    {
      name: "Canadian Experience Class",
      description: 'The Canadian Experience Class (CEC) was created to help people take part in the Canadian economy.',
      href: "/overview/cec",
      disabled: false
    }];
    
    $scope.notAvailable = [{
      name: "Skilled Worker Class",
      description: 'Lorem ipsum dolor sit amet, mel postulant constituto ut, ex. diam commodo at nec mea.',
      href: "",
      disabled: true
    },
    {
      name: "Skilled Trades Class",
      description: 'Integre minimum adipiscing no nec, diam commodo at nec mea.',
      href: "",
      disabled: true
    },
    {
      name: "Quebec Investors and Entrepreneurs",
      description: 'Lorem ipsum dolor sit amet, nec ei alii volumus nec.',
      href: "",
      disabled: true
    },
    {
      name: "Self-Employed Persons",
      description: 'Lorem ipsum dolor sit amet, sea cu odio dicit atomorum.',
      href: "",
      disabled: true
    },
    {
      name: "Start up Visa",
      description: 'At solum atomorum sed. Mollis dolores offendit no nec, te.',
      href: "",
      disabled: true
    },
    {
      name: "Provincial Nominees",
      description: 'An probo solum zril vim, ad per mundi partiendo complectitur.',
      href: "",
      disabled: true
    },
    {
      name: "Quebec-Selected Skilled Workers",
      description: 'Lorem ipsum dolor sit amet, id odio suscipiantur vel ex.',
      href: "",
      disabled: true
    },
    {
      name: "Family Class",
      description: 'Et sit soluta accumsan voluptaria, usu sonet feugiat ex persius.',
      href: "",
      disabled: true
    },
    {
      name: "Family Class",
      description: 'Ne veri primis expetendis mel, fastidii accusata has ad intellegat.',
      href: "",
      disabled: true
    },
    {
      name: "Refugees, Humanitarians and Protected Persons from Abroad",
      description: 'Evertitur sententiae inciderint et pro, noster pertinax sapientem ad mea.',
      href: "",
      disabled: true
    },
    {
      name: "Persons being sponsored under a Public Policy",
      description: 'Et eam paulo aliquid, modus ipsum quo te. Id vix.',
      href: "",
      disabled: true
    }]
});

app.controller('OutsidePermanentController', function($scope, $location) {
  $scope.sectionTitle = 'Apply from outside Canada to stay permanently.';
  $scope.bannerColor = '#505D73';
  $scope.bannerIconSrc = STATIC_IMG_ROUTE + '/outsidepermanent.png';

  $scope.available = [
    {
      name: "Canadian Experience Class",
      description: 'The Canadian Experience Class (CEC) was created to help people take part in the Canadian economy.',
      href: "/overview/cec",
      disabled: false
    }];
    
    $scope.notAvailable = [{
      name: "Skilled Worker Class",
      description: 'Lorem ipsum dolor sit amet, mel postulant constituto ut, ex. diam commodo at nec mea.',
      href: "",
      disabled: true
    },
    {
      name: "Skilled Trades Class",
      description: 'Integre minimum adipiscing no nec, diam commodo at nec mea.',
      href: "",
      disabled: true
    },
    {
      name: "Quebec Investors and Entrepreneurs",
      description: 'Lorem ipsum dolor sit amet, nec ei alii volumus nec.',
      href: "",
      disabled: true
    },
    {
      name: "Self-Employed Persons",
      description: 'Lorem ipsum dolor sit amet, sea cu odio dicit atomorum.',
      href: "",
      disabled: true
    },
    {
      name: "Start up Visa",
      description: 'At solum atomorum sed. Mollis dolores offendit no nec, te.',
      href: "",
      disabled: true
    },
    {
      name: "Provincial Nominees",
      description: 'An probo solum zril vim, ad per mundi partiendo complectitur.',
      href: "",
      disabled: true
    },
    {
      name: "Quebec-Selected Skilled Workers",
      description: 'Lorem ipsum dolor sit amet, id odio suscipiantur vel ex.',
      href: "",
      disabled: true
    },
    {
      name: "Family Class",
      description: 'Et sit soluta accumsan voluptaria, usu sonet feugiat ex persius.',
      href: "",
      disabled: true
    },
    {
      name: "Family Class",
      description: 'Ne veri primis expetendis mel, fastidii accusata has ad intellegat.',
      href: "",
      disabled: true
    },
    {
      name: "Refugees, Humanitarians and Protected Persons from Abroad",
      description: 'Evertitur sententiae inciderint et pro, noster pertinax sapientem ad mea.',
      href: "",
      disabled: true
    },
    {
      name: "Persons being sponsored under a Public Policy",
      description: 'Et eam paulo aliquid, modus ipsum quo te. Id vix.',
      href: "",
      disabled: true
    }]
});

app.controller('AllProgramsController', function($scope, $location) {
  $scope.sectionTitle = 'All of our programs laid out for you.';
  $scope.bannerColor = '#DF9864';
  $scope.bannerIconSrc = STATIC_IMG_ROUTE + '/allprograms.png';

  $scope.available = [
    {
      name: "Canadian Experience Class",
      description: 'The Canadian Experience Class (CEC) was created to help people take part in the Canadian economy.',
      href: "/overview/cec",
      disabled: false
    },
    {
      name: "New study permit",
      description: 'Incoming international students must acquire a study permit to initiate their studies in Canada.',
      href: "/overview/new-study-permit",
      disabled: false
    },
    {
      name: "Extend study permit",
      description: 'International students must renew their study permits regularly to ensure their status in Canada.',
      href: "/overview/extend-study-permit",
      disabled: false
    },     
  ];

  $scope.notAvailable = [
    {
      name: "Skilled Worker Class",
      description: 'Lorem ipsum dolor sit amet, mel postulant constituto ut, ex.',
      href: "",
      disabled: true
    },
    {
      name: "Skilled Trades Class",
      description: 'Integre minimum adipiscing no nec, diam commodo at nec mea.',
      href: "",
      disabled: true
    },
    {
      name: "Quebec Investors and Entrepreneurs",
      description: 'Lorem ipsum dolor sit amet, nec ei alii volumus nec.',
      href: "",
      disabled: true
    },
    {
      name: "Self-Employed Persons",
      description: 'Lorem ipsum dolor sit amet, sea cu odio dicit atomorum.',
      href: "",
      disabled: true
    },
    {
      name: "Start up Visa",
      description: 'At solum atomorum sed. Mollis dolores offendit no nec, te.',
      href: "",
      disabled: true
    },
    {
      name: "Provincial Nominees",
      description: 'An probo solum zril vim, ad per mundi partiendo complectitur.',
      href: "",
      disabled: true
    },
    {
      name: "Quebec-Selected Skilled Workers",
      description: 'Lorem ipsum dolor sit amet, id odio suscipiantur vel ex.',
      href: "",
      disabled: true
    },
    {
      name: "Family Class",
      description: 'Et sit soluta accumsan voluptaria, usu sonet feugiat ex persius.',
      href: "",
      disabled: true
    },
    {
      name: "Family Class",
      description: 'Ne veri primis expetendis mel, fastidii accusata has ad intellegat.',
      href: "",
      disabled: true
    },
    {
      name: "Refugees, Humanitarians and Protected Persons from Abroad",
      description: 'Evertitur sententiae inciderint et pro, noster pertinax sapientem ad mea.',
      href: "",
      disabled: true
    },
    {
      name: "Persons being sponsored under a Public Policy",
      description: 'Et eam paulo aliquid, modus ipsum quo te. Id vix.',
      href: "",
      disabled: true
    },
    {
      name: "New work permit",
      href: '',
      description: 'Ex vel primis voluptua consequat, vis viderer menandri argumentum at.',
      disabled: true
    },
    {
      name: "New visitor permit",
      href: '',
      description: 'Iudico omnium sententiae at his, audire intellegam vel ut fabellas.',
      disabled: true
    },    
    {
      name: "Extend work permit",
      href: '',
      description: 'Ex vel primis voluptua consequat, vis viderer menandri argumentum at.',
      disabled: true
    },
    {
      name: "Extend visitor permit",
      href: $location.absUrl() + "/permanent",
      description: 'Iudico omnium sententiae at his, audire intellegam vel ut fabellas.',
      disabled: true
    },
    {
      name: "New Temporary Resident Visa",
      href: $location.absUrl() + "/permanent",
      description: 'Lorem ipsum dolor sit amet, sale sonet eum ne, in.',
      disabled: true
    },
    {
      name: "Temporary Resident Permit",
      href: $location.absUrl() + "/permanent",
      description: 'Ne qui latine sanctus scribentur, cu mei dico detraxit mei.',
      disabled: true
    }                   
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
});

app.controller('ResultsController', function($scope, $routeParams, AnswersModel) {
  // console.log(AnswersModel.answers);
  if (!AnswersModel.answers) {
    AnswersModel.askWatson($routeParams.question).then(function(data) {
      AnswersModel.setData(data);
      $scope.answers = AnswersModel.answers.question.evidencelist;
    }, function(error) {
      // console.log('error');
    });

  } else {
    $scope.answers = Array(AnswersModel.answers.question.answers[0]);
  }
});

app.controller('DemoController', function($scope, $mdDialog, $rootScope) {
  $rootScope.selecedProgramRoute = '/overview/cec'
  $rootScope.selectedProgram = ' / Canadian Experience Class';
  $rootScope.selectedForm = ' / Demo Form';
  $scope.formTabIndex = 0;
  // $scope.nexting = true;
  // $scope.tabIndex = 0;
  // $scope.personalQResponses = {
  //   age: '',
  //   hasFamilyInCanada: false,
  //   hasAccreditedCanadianDegree: false,
  //   currentStatus: '',
  //   inCanada: false,
  //   yearsInCanada: '',
  //   occupation: '',
  //   reason: '',
  //   fluent: '',
  //   armedForces: ''
  // }

  $rootScope.populateQuestions([
    {
      question: 'What are the language requirements for immigrating to Canada?'
    },
    {
      question: 'What is an alias?'
    }
  ]);
  $scope.showPreview = function(ev) {
    $mdDialog.show({controller: DialogController,
      templateUrl: 'templates/previewdialog.html',
      targetEvent: ev,
    });
  }

  $scope.nextPage = function() {
    $scope.formTabIndex += 1;
    $scope.nexting = true;
    $scope.cycleSuggestedQuestions();
  }

  $scope.previousPage = function() {
    $scope.formTabIndex -= 1;
    $scope.nexting = false;
  }

  $scope.finishForm = function() {
    $rootScope.canSubmit = true;
    $rootScope.formProgress = 100;
    $rootScope.routeMe('/overview/cec');
  }

  $scope.cycleSuggestedQuestions = function() {
    if ($scope.formTabIndex === 1) {
      $rootScope.populateQuestions([
        {
          question: 'What is a common-law relationship?'
        }
      ]);      
    } else if ($scope.formTabIndex === 4) {
      $rootScope.populateQuestions([
        {
          question: 'What is a national identity document?'
        }
      ]);         
    } else if ($scope.formTabIndex === 5) {
      $rootScope.populateQuestions([
        {
          question: 'What is a designated testing agency?'
        }
      ]);       
    }
  }
});

function DialogController($scope, $mdDialog, $location) {
  $scope.hide = function() {
    $mdDialog.hide();
  };

  $scope.cancel = function() {
    $mdDialog.cancel();
  };

  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };

  $scope.finish = function() {
    $mdDialog.hide();
    $location.path('/');
  }
}

app.controller('WatsonController', function($scope, AnswersModel, $rootScope, $mdToast, $location) {
  $scope.tabIndex = 0;
  $scope.questionForWatson = '';
  $scope.showRecommendation = false;
  $scope.recommendedProgram = '';
  $scope.recommendedRoute = '';

  $scope.doTheAsk = function(question) {
    $scope.showRecommendation = false;
    $scope.theAnswer = '';
    $scope.tabIndex = 1;
    $rootScope.isLoading = true;
    $scope.questionText = question;
    $scope.questionForWatson = '';
    AnswersModel.askWatson(question).then(function(data) {
      AnswersModel.setData(data);
      $scope.results = AnswersModel.answers.question.evidencelist;
      $scope.theAnswer = $scope.results[0];
      console.log($scope.results);
    }, function(error) {
      // console.log('error');
    }).finally(function() {
      $rootScope.isLoading = false;
      showRecommendationRow(question);
    });
  }

  function showRecommendationRow(question) {
    var blob = question.toLowerCase() + ' ' + $scope.theAnswer.text.toLowerCase();
    if ((blob.indexOf('cec') >= 0 ) || (blob.indexOf('canadian experience') >= 0)) {
      $scope.showRecommendation = true;
      $scope.recommendedProgram = 'Canadian Experience Class';
      $scope.recommendedRoute = 'cec';      
    } else if ((blob.indexOf('extend') >= 0 ) || (blob.indexOf('renew') >= 0)) {
      $scope.showRecommendation = true;
      $scope.recommendedProgram = 'Extend a study permit';
      $scope.recommendedRoute = 'extend-study-permit';
    } else if (blob.indexOf('study') >= 0 ) {
      $scope.showRecommendation = true;
      $scope.recommendedProgram = 'study';
      $scope.recommendedRoute = 'new-study-permit';      
    }
  }

  $scope.routeMeRecommended = function() {
    $location.path('/overview/' + $scope.recommendedRoute);
  }

  $scope.toggleAndAsk = function() {
    $scope.doTheAsk($scope.questionForWatson);
  }

  $scope.askSuggested = function(ev) {
    $scope.doTheAsk(ev.currentTarget.innerText);
  }

  $scope.backToSuggestions = function() {
    $scope.tabIndex = 0;
    $scope.showRecommendation = false;
  }  
});

app.controller('OverviewController', function($scope) {
  $scope.applicationCompleted = false;
});

app.controller('CECOverviewController', function($scope) {
  $scope.sectionTitle = 'Canadian Experience Class';
  $scope.compeletedProgram = false;

  $scope.requiredForms = [
    [{
        code: "IMM 5610",
        name: "Document Checklist",
        progress: 0
    }, {
        code: "IMM 0008",
        name: "Generic Application Form for Canada",
        progress: 0
    }, {
        code: "IMM 5669",
        name: "Schedule A - Background/Declaration",
        progress: 0
    }, {
        code: "Schedule 8",
        name: "Economic Classes - Canadian Experience Class",
        progress: 0
    }],
    [{
        code: "IMM 5620",
        name: "Fee Payment Form - Application for Permanent Residence",
        progress: 0
    }, {
        code: "IMM 5476",
        name: "Fee Payment Form - Application for Permanent Residence",
        progress: 0
    }, {
        code: "IMM 5609",
        name: "Instruction Guide",
        progress: 0
    }]
  ];

  $scope.optionalForms = [
    [{
        code: "IMM 0008DEP",
        name: "Additional Dependants/Declaration",
        progress: 0
    }, {
        code: "IMM 5406",
        name: "Additional Family Information",
        progress: 0
    }, {
        code: "IMM 5409",
        name: "Statutory Declaration of Common-law Union",
        progress: 0
    }, {
        code: "IMM 5604",
        name: "Separation Declaration for Minors Travelling to Canada",
        progress: 0
    }
    ]
  ];

  $scope.supplementary = [
    [{
        code: "IMM 5562",
        name: "Supplementary Information - Your Travels",
        progress: 0
    }
    ]
  ]
});

app.controller('NewStudyOverviewController', function($scope) {
  $scope.sectionTitle = 'New Study Permit';
  $scope.compeletedProgram = false;

  $scope.requiredForms = [
      [{
          code: "IMM 5483",
          name: "Document Checklist",
          progress: 0
      }, {
          code: "IMM 1294",
          name: "Application for a Study Permit Made Outside of Canada",
          progress: 0
      }, {
          code: "IMM 5645",
          name: "Family Information",
          progress: 0
      }, {
          code: "Schedule - 1",
          name: "Application for Temporary Resident Visa",
          progress: 0
      }], 
      [{
          code: "IMM 5269",
          name: "Instruction Guide",
          progress: 0
      }]
    ];

      $scope.optionalForms = [[{
          code: "IMM 5409",
          name: "Statutory Declaration of Common-Law Union",
          progress: 0
      }, {
          code: "IMM 5646",
          name: "Custodian Declaration",
          progress: 0
      }, {
          code: "IMM 5476",
          name: "Use of a Representative",
          progress: 0
      }]
    ];
      
    $scope.supplementary = [
      [{
          code: "N/A",
          name: "Visa application photograph specifications",
          progress: 0
      }]
    ]

});

app.controller('ExtendStudyOverviewController', function($scope) {
  $scope.sectionTitle = 'Extend Study Permit';
  $scope.compeletedProgram = false;

  $scope.requiredForms = [
      [{
          code: "IMM 5555",
          name: "Document Checklist",
          progress: 0
      }, {
          code: "IMM 5709",
          name: "Application to Change Conditions, Extend my Stay or Remain in Canada as a Student ",
          progress: 0
      }, {
          code: "IMM 5552",
          name: "Instruction Guide",
          progress: 0
      }]
    ];

    $scope.optionalForms = [[{
            code: "IMM 5646",
            name: "Custodianship Declaration - Custodian for Minors Studying in Canada",
            progress: 0
        },{
            code: "IMM 5476",
            name: "Use of a Representative",
            progress: 0
        }, {
            code: "IMM 5409",
            name: "Statutory Declaration of Common-law Union",
            progress: 0
      }]
    ];

    $scope.supplementary = [];

});

app.run( function($rootScope, $location) {
   $rootScope.$watch(function() {
      return $location.path();
    },
    function(a){
      console.log(a);
      $rootScope.switchContext(a);
    });
});

app.service('SuggestedQuestionsService', function() {
  var questions = [];

  this.setQuestions = function(qArray) {
    questions = qArray;
  }

  this.getQuestions = function() {
    return questions;
  }

  this.clearQuestions = function() {
    questions = [];
  }
});

app.service('AnswersModel', function($http, $q) {
  var watsonRoute = 'http://54.69.43.163/ask';

  this.askWatson = function(question) {
    return $q(function(resolve, reject) {
      $http.get(watsonRoute, {params: {q: question}}).
      success(function(data, status, headers, config) {
        console.log(data);
        // hard code answer
        if (question.toLowerCase() === SAMPLE_Q1.toLowerCase()) {
          data.question.evidencelist.unshift({
            confidence: 0.4954,
            id: 0,
            text: 'To work in Canada after you graduate, you must apply for a work permit under the Post-Graduation Work Permit Program (PGWPP). If you want to stay in Canada as a permanent resident after you graduate, there are a number of programs available, each with its own requirements.',
            source: 'http://www.cic.gc.ca/English/immigrate/cec/index.asp'
          });
        } else if (question.toLowerCase() === SAMPLE_Q2.toLowerCase()) {
          data.question.evidencelist.unshift({
            confidence: 0.544,
            id: 0,
            text: "The PGWPP allows students who have graduated from a participating Canadian post-secondary institution to gain valuable Canadian work experience. Skilled Canadian work experience gained through the PGWPP helps graduates qualify for permanent residence in Canada through the Canadian Experience Class (CEC).",
            source: 'http://www.cic.gc.ca/english/resources/publications/cec.asp#requirements'
          });
        } else if (question.toLowerCase() === SAMPLE_Q3.toLowerCase()) {
          data.question.evidencelist.unshift({
            confidence: 0.6011,
            id: 0,
            text: "Canadian Experience Class requirements The CEC is prescribed as a class of persons who may become permanent residents on the basis of their Canadian experience and who: maintained temporary resident status during their qualifying period of work intend to reside in a province or territory other than Quebec; experience as well as during any period of full-time study or training in Canada.",
            source: 'http://www.cic.gc.ca/english/resources/publications/cec.asp#requirements'
          });
        }
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

  this.clearData = function() {
    this.answers = [];
  }
});

app.directive('toolbarAnimate', function($window){
    return {
        link: function($scope, $element, $attributes){
            $attributes.$observe('hidePanel', function(value){
              if (value === 'true') {
                $element.slideUp(750);
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

app.directive('watsonPanel', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/watson.html'
  }
});

app.directive('homepagePanel', function() {
  return {
    restrict: 'E',
    templateUrl: 'templates/homepagepanel.html'
  }
});