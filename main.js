(function () {
    firebase.initializeApp(config);

    var app = angular.module('procrastNation', ['firebase', 'ngMaterial', 'googlechart']);

    app.controller('procrastNationController',
        ["$firebaseArray", function ($firebaseArray) {

            var self = this;
            //Create the recent activities
            self.activities = [{
                what: "Activity 1",
                when: moment().format('MMMM Do YYYY, h:mm:ss a'),
                notes: "Description"
            }, {
                what: 'Activity 2',
                when: moment().format('MMMM Do YYYY, h:mm:ss a'),
                notes: "Description"
            }, {
                what: 'Activity 3',
                when: moment().format('MMMM Do YYYY, h:mm:ss a'),
                notes: "Description"
            }, {
                what: 'Activity 4',
                when: moment().format('MMMM Do YYYY, h:mm:ss a'),
                notes: "Description"
            }, {
                what: 'Activity 5',
                when: moment().format('MMMM Do YYYY, h:mm:ss a'),
                notes: "Description"
            }];

        }]);


})();