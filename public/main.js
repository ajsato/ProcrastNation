(function () {
    firebase.initializeApp(config);

    var app = angular.module('procrastNation', ['firebase', 'ngMaterial', 'googlechart']);

    app.controller('procrastNationController',
        ["$firebaseArray", "$firebaseAuth", "$firebaseObject", "$mdDialog", function ($firebaseArray, $firebaseAuth, $firebaseObject, $mdDialog) {

            var self = this;

            var firebaseUser = null;
            var auth = $firebaseAuth();
            auth.$signInWithPopup("google").then(function (result) {

                firebaseUser = $firebaseObject(firebase.database().ref().child(result.user.uid));
                console.log("Signed in as:", result.user.uid);

                firebaseUser.$loaded(function (data) {
                    if (!firebaseUser.username) {
                        var confirm = $mdDialog.prompt()
                            .title('Hey new user!')
                            .textContent('Please enter a username')
                            .placeholder('Username')
                            .ariaLabel('Username')
                            .ok('Okay!')
                            .cancel('Cancel');

                        $mdDialog.show(confirm).then(function (result) {
                            firebaseUser.username = result;
                            firebaseUser.$save();
                        }, function () {
                        });
                    }
                });
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

            this.dailyActivity = {};
            this.dailyActivity.type = "google.charts.Line";
            this.dailyActivity.displayed = false;
            this.dailyActivity.data = {
                "cols": [{
                    id: "month",
                    label: "Month",
                    type: "string"
                }, {
                    id: "poms",
                    label: "Poms",
                    type: "number"
                }],
                "rows": [{
                    c: [{
                        v: "January"
                    }, {
                        v: 2,
                        f: "23 items"
                    }]
                }, {
                    c: [{
                        v: "February"
                    }, {
                        v: 7
                    }]
                }, {
                    c: [{
                        v: "March"
                    }, {
                        v: 5
                    }
                    ]
                }]
            };
            this.dailyActivity.options = {
                "title": "Daily Activity",
                "isStacked": "true",
                "fill": 20,
                "displayExactValues": true,
                "vAxis": {
                    "title": "Pomodoros",
                    "gridlines": {
                        "count": 2
                    }
                },
                "hAxis": {
                    "title": "Date"
                }
            };
        }]
    );
})();