var app = angular.module('myApp', ['ngRoute']);

app.config(function($routeProvider){
    $routeProvider
    .when('/', {
        templateUrl: 'home.html',
        controller: 'subjectCtrl'
    })
    .when('/subjects', {
        templateUrl: 'subjects.html',
        controller: 'subjectCtrl'
    })
    .when('/quiz/:id/:name', {
        templateUrl: 'quiz-app.html',
        controller: 'quizsCtrl'
    })
    .when('/register', {
        templateUrl: 'register.html',
    })
    .when('/login', {
        templateUrl: 'login.html',
        controller: 'loginCtrl'
    })
    .when('/change-password', {
        templateUrl: 'change-password.html',
    })
    .when('/forgot-password', {
        templateUrl: 'forgot-password.html',
    })
    .when('/info-account', {
        templateUrl: 'info-account.html',
        controller: 'studentCtrl'
    })
    .when('/edit-account', {
        templateUrl: 'edit-account.html',
    })
    .when('/about', {
        templateUrl: 'about.html',
        controller: 'subjectCtrl'
    })
    .when('/contact', {
        templateUrl: 'contact.html',
        controller: 'subjectCtrl'
    })
    .when('/feedback', {
        templateUrl: 'feedback.html',
        controller: 'subjectCtrl'
    })
    .when('/faq', {
        templateUrl: 'faq.html',
        controller: 'subjectCtrl'
    })
});

app.controller('quizsCtrl',function($scope, $http, $routeParams, quizFactory){
    $http.get('../db/Quizs/'+ $routeParams.id +'.js').then(function(res){
        quizFactory.questions = res.data;
    })
});

app.controller('subjectCtrl',function($scope, $http){
    $scope.list_subject = [];
    $http.get('../db/Subjects.js').then(function(res){
        $scope.list_subject = res.data;
        //---phân trang---//
        $scope.begin = 0;
        $scope.pageCount = Math.ceil($scope.list_subject.length / 6);
    });
    $scope.first = function() {
        $scope.begin = 0;
    }

    $scope.prev = function() {
        if ($scope.begin > 0) {
            $scope.begin -= 6;
        }
    }

    $scope.next = function() {
        if ($scope.begin < ($scope.pageCount - 1) * 6) {
            $scope.begin += 6;
        }
    }

    $scope.last = function() {
            $scope.begin = ($scope.pageCount - 1) * 6;
        }

        
});


app.directive('quizfpoly',function(quizFactory,$routeParams){
    return{
        restrict : "AE",
        scope:{},
        templateUrl:'template-quiz.html',
        link: function(scope, elem, attrs){
            scope.start = function(){
                
                quizFactory.getQuestions().then(function(){
                    
                    scope.objName = $routeParams.name;
                    scope.id = 1;
                    scope.quizOver = false; //chua hoan thanh
                    scope.inProgess = true;
                    scope.getQuestion();
                });
                
            };
            scope.reset = function(){
                scope.inProgess = false;
                scope.score = 0;
                scope.startCountdown();
            };
            scope.getQuestion = function(){
                var quiz = quizFactory.getQuestion(scope.id);
                if(quiz){
                    scope.question = quiz.Text;
                    scope.options = quiz.Answers;
                    scope.answer = quiz.AnswerId;
                    scope.answerMode = true;
                }else{
                    scope.quizOver = true;
                }
            };
            scope.checkAnswer = function(){
                if(!$('input[name=answer]:checked').length) return;
                var ans = $('input[name=answer]:checked').val();
                if(ans == scope.answer){
                    // alert('dung');
                    scope.score++;
                    scope.correctAns = true;
                }else{
                    // alert('sai');
                    scope.correctAns = false;
                }
                scope.answerMode = false;
            };
            scope.nextQuestion = function(){
                scope.id++;
                scope.getQuestion();
            }
            scope.reset();
        }
    }
});
app.factory('quizFactory',function($http, $routeParams){
    
    return{
        getQuestions:function(){
            return $http.get('../db/Quizs/'+ $routeParams.id +'.js').then(function(res){
                questions = res.data;
            });
        },
        getQuestion:function(id){
            var randomItem = questions[Math.floor(Math.random() * questions.length)];
            var count = questions.length;
            if(count > 10){
                count = 10;
            }
            
            if(id < count){
                return randomItem;
            }else{
                return false;
            }
            
        }
    }
});

//dong ho dem nguoc
app.controller('countDown', function($scope, $interval) {
    var decreamentCountdown = function() {
        $scope.countdown -= 1;
        if ($scope.countdown < 1) {
            $scope.reset();
        }
    };
    var startCountdown = function() {
        $interval(decreamentCountdown, 1000, $scope.countdown)
    };
    $scope.countdown = 600;
    startCountdown();
});




app.controller("form", function($scope) {
    $scope.student = {};
    $scope.index = -1;

    $scope.clear = function() {
        $scope.student = {};
    }
    $scope.cancel = function(index) {
        if ($scope.index == -1) {
            $scope.clear();
        } else {
            $scope.edit($scope.index);
        }
        $scope.clear();
    }
});

