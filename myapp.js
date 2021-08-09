var app = angular.module("myApp",[]);
app.controller("subjectCtrl",function($scope, $http){
    $scope.list_subject = [];
    $http.get('db/Subject.js').then(function(response){
        $scope.list_subject = response.data;
    })
});