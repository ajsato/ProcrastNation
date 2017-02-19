(function () {
    firebase.initializeApp(config);

    var app = angular.module('procrastNation', ['firebase', 'ngMaterial', 'googlechart']);

    function Activity(title, message, timestamp, rating, duration) {
        this.title = title;
        this.message = message;
        this.timestamp = timestamp;
        this.rating = rating;
        this.duration = duration;
    }

    //
    app.filter('fromNow', function () {
        return function (input) {
            return moment(parseInt(input)).fromNow();
        };
    });


    app.controller('procrastNationController',
        ["$firebaseArray", "$firebaseAuth", "$firebaseObject", "$mdDialog",
            function ($firebaseArray, $firebaseAuth, $firebaseObject, $mdDialog) {

                var self = this;

                self.firebaseUser = null;
                var auth = $firebaseAuth();
                self.activity = {};
                self.activities = [];

                auth.$signInWithPopup("google").then(function (result) {

                    self.firebaseUser = $firebaseObject(firebase.database().ref().child(result.user.uid));


                    console.log("Signed in as:", result.user.uid);

                    self.firebaseUser.$loaded(function (data) {
                        if (!self.firebaseUser.username) {
                            var confirm = $mdDialog.prompt()
                                .title('Hey new user!')
                                .textContent('Please enter a username')
                                .placeholder('Username')
                                .ariaLabel('Username')
                                .ok('Okay!')
                                .cancel('Cancel');

                            $mdDialog.show(confirm).then(function (result) {
                                self.firebaseUser.username = result;
                                self.firebaseUser.points = 0;
                                self.firebaseUser.defaultTimer = 20;
                                self.firebaseUser.$save();
                            }, function () {
                            });
                        } else {
                            var days = [];
                            var startDate = Date.now();
                            var endDate = startDate.subtract(7, 'days');
                            for (var h = 0; h < 7; h++){
                                days[moment(startDate.add(h, 'days')).format()] = 0;
                            }
                            for (var i = 0; i < self.firebaseUser.activities.length; i++) {
                                if ((startDate < days[moment(self.firebaseUser.activities[i])]) &&
                                    (endDate > days[moment(self.firebaseUser.activities[i])])) {
                                    days[moment(self.firebaseUser.activities[i]).format()]++;
                                }
                            }
                            self.activities = self.firebaseUser.activities;
                        }
                    });
                }).catch(function (error) {
                    console.error("Authentication failed:", error);
                });

                self.addActivity = function () {
                    if (!self.firebaseUser.activities) {
                        self.firebaseUser.activities = [];
                    }
                    self.firebaseUser.activities.push(new Activity(self.activity.title, self.activity.message, Date.now(),
                        self.activity.rating, 20));
                    self.firebaseUser.$save();
                    self.activity.title = "";
                    self.activity.message = "";
                    self.activity.rating = "";
                };

                this.dailyActivity = {};
                this.dailyActivity.type = "google.charts.Bar";
                this.dailyActivity.displayed = false;
                this.dailyActivity.data = {
                    "cols": [{
                        id: "month",
                        label: "Month",
                        type: "string"
                    }, {
                        id: "poms",
                        label: "Pomodoros",
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