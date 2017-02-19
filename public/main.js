(function () {
    firebase.initializeApp(config);

    var app = angular.module('procrastNation', ['firebase', 'ngMaterial', 'googlechart', 'timer']);

    function Activity(title, message, timestamp, rating, duration) {
        this.title = title;
        this.message = message;
        this.timestamp = timestamp;
        this.rating = rating;
        this.duration = duration;
    }

    app.filter('fromNow', function () {
        return function (input) {
            return moment(parseInt(input)).fromNow();
        };
    });

    app.controller('procrastNationController',
        ["$firebaseArray", "$firebaseAuth", "$firebaseObject", "$mdDialog", '$scope',
            function ($firebaseArray, $firebaseAuth, $firebaseObject, $mdDialog, $scope) {

                var self = this;

                self.firebaseUser = null;
                var auth = $firebaseAuth();
                self.activity = {};
                self.activities = [];
                self.currentTimer = 20;
                self.currentTimerSec = 0;
                self.currentSeconds = 0;
                self.timerRunning = false;


                self.startTimer = function () {
                    self.timerRunning = true;
                    $scope.$broadcast('timer-start');
                };

                self.stopTimer = function () {
                    self.timerRunning = false;
                    $scope.$broadcast('timer-stop');
                };

                self.allUsers = $firebaseArray(firebase.database().ref());

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
                            var endDate = Date.now();
                            var startDate = moment(startDate).subtract(7, 'days');
                            // for (var h = 0; h < 7; h++){
                            //     //days[moment(startDate.add(h, 'days')).format()] = 0;
                            //     days.push({ c: [{v: moment(startDate).add(h,'days').format()},
                            //         {v: 0}]});
                            // }
                            for (var i = 0; i < 7; i++) {
                                days[moment(startDate).add(i, 'days').format()] = 0;
                            }
                            for (var i = 0; i < self.firebaseUser.activities.length; i++) {
                                if ((startDate < days[moment(self.firebaseUser.activities[i])]) &&
                                    (endDate > days[moment(self.firebaseUser.activities[i])])) {
                                    days[moment(self.firebaseUser.activities[i]).format()]++;
                                }
                            }
                            var daysFormatted = [];
                            for (var x in days) {
                                daysFormatted.push({
                                    c: [{v: x},
                                        {v: days[x]}]
                                });
                            }
                            self.daysFormatted = daysFormatted;
                            /*
                             { c: [{v: "January"},
                             {v: 2
                             //,f: "23 items"
                             }]}
                             */
                            self.activities = self.firebaseUser.activities;
                        }
                    });
                }).catch(function (error) {
                    console.error("Authentication failed:", error);
                });

                self.updateSeconds = function () {
                    self.currentSeconds = self.currentTimer * 60 + self.currentTimerSec;
                };

                self.addActivity = function () {
                    if (!self.firebaseUser.activities) {
                        self.firebaseUser.activities = [];
                    }
                    self.firebaseUser.activities.push(new Activity(self.activity.title, self.activity.message, Date.now(),
                        self.activity.rating, self.currentTimer));
                    self.firebaseUser.points = self.firebaseUser.points + 10;
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
                        id: "days",
                        label: "Days",
                        type: "string"
                    }, {
                        id: "poms",
                        label: "Pomodoros",
                        type: "number"
                    }],
                    "rows": //self.daysFormatted/*
                        [
                            {
                                c: [{v: "Saturday"},
                                    {
                                        v: 3
                                        //,f: "23 items"
                                    }]
                            }
                        ]//*/
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