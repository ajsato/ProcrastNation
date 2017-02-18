(function () {
    firebase.initializeApp(config);

    var app = angular.module('procrastNation', ['firebase', 'ngMaterial']);

    app.controller('procrastNationController',
        ["$firebaseArray", function ($firebaseArray) {

            var self = this;

        }]);


})();