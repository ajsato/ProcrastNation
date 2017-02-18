(function () {
    firebase.initializeApp(config);

    var app = angular.module('procrastNation', ['firebase', 'ngMaterial', 'googlechart']);

    app.controller('procrastNationController',
        ["$firebaseArray", function ($firebaseArray) {

            var self = this;

        }]);


})();