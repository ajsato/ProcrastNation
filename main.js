(function () {
    firebase.initializeApp(config);

    var app = angular.module('procrastNation', ['firebase', 'ngMaterial', 'nvd3']);

    app.controller('procrastNationController',
        ["$firebaseArray", function ($firebaseArray) {

            var self = this;

        }]);


})();