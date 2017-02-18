(function () {
    firebase.initializeApp(config);

    var app = angular.module('procrastNation', ['firebase', 'ngMaterial', 'googlechart']);

    app.controller('procrastNationController',
        ["$firebaseArray", "$firebaseAuth", function ($firebaseArray, $firebaseAuth) {

            var self = this;

            var firebaseUser = null;
            var auth = $firebaseAuth();

            auth.$signInWithPopup("google").then(function (result) {
                console.log("Signed in as:", result.user.uid);
            }).catch(function (error) {
                console.error("Authentication failed:", error);
            });


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