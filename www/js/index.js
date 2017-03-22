Number.prototype.padLeft = function(base, chr) {
    var  len = (String(base || 10).length - String(this).length)+1;
    return len > 0? new Array(len).join(chr || '0')+this : this;
};

window.addEventListener("storage", function () {
    render();
}, false);

document.addEventListener('deviceready', function () {
    var permissionGranted = false;

    cordova.plugins.notification.local.hasPermission(function (granted) {
        if (granted == true) {
            permissionGranted = true;
        }
        else {
            cordova.plugins.notification.local.registerPermission(function (granted) {
                if (granted === false) {

                } else {
                    permissionGranted = true;
                }
            });
        }
    });

    try {
        initProgress();
    } catch(e) {
        alert(e.toString());
    }

}, false);

var getParticipantProgress = function() {
    return JSON.parse(localStorage.getItem('participantProgress'));
};

var setParticipantProgress = function(participantProgress) {
    return localStorage.setItem('participantProgress', JSON.stringify(participantProgress));
};

var getLastLinkClick = function() {
    var participantProgress = getParticipantProgress();
    var lastLinkClick = null;
    for (var i = 0; i < participantProgress.linksClicked.length; i++) {
        if (participantProgress.linksClicked[i].dateClicked === null) {
            return lastLinkClick;
        }
        lastLinkClick = participantProgress.linksClicked[i].dateClicked;
    }
    return lastLinkClick;
};

var render = function() {
    var participantProgress = getParticipantProgress();
    var lastStudy = participantProgress.lastStudy;
    var confirmedState = participantProgress.confirmedState;
    if (lastStudy > 0) {
        if (confirmedState === true) {
            $$("#initialMessage").hide();
            $$("#nextStudyQuestionMessage").hide();
            $$("#nextStudyMessage").attr('style', 'display: block');
            $$(".userMistake").attr('style', 'display: block');
            $$(".userMistakeLastStudy").html(lastStudy);
        } else {
            $$(".userMistake").hide();
            $$("#initialMessage").hide();
            $$("#nextStudyQuestionMessage").attr('style', 'display: block');
            $$("#nextStudyMessage").hide();
            $$(".lastStudyMessageDay").each(function() {
               $$(this).html(lastStudy);
            });
            var lastLinkClicked = getLastLinkClick();
            lastLinkClicked = formatDate(new Date(lastLinkClicked));
            $$("#lastStudyLinkClickTime").html(lastLinkClicked);

            $$("#nextStudyRedirect").click(function() {
                linkClicked(lastStudy);
                var url = $$("#day" + lastStudy).attr('data-link');
                window.open(url, '_system');
            });
        }
        $$(".nextStudyMessageDay").each(function() {
            $$(this).html(lastStudy + 1);
        });
    } else {
        $$("#initialMessage").attr('style', 'display: block');
        $$("#nextStudyQuestionMessage").hide();
        $$("#nextStudyMessage").hide();
        $$(".userMistake").hide();
    }

    var lastClicked = 0;
    for (var i = 0; i < participantProgress.linksClicked.length; i++) {
        $$("#day" + (i + 1)).removeAttr('disabled');
        var clicked = participantProgress.linksClicked[i].clicked;
        var confirmed = participantProgress.linksClicked[i].dateConfirmed !== null;
        var day = participantProgress.linksClicked[i].day;
        var html = 'Day ' + day;
        if (clicked === true && confirmed) {
            lastClicked = participantProgress.linksClicked[i].day;
            html += ' <img src="img/notification_done.png" style="height: 15px; vertical-align:text-top"/>';
        }
        $$("#day" + day).html(html);
    }
    for (var j = 1; j <= 7; j++) {
        if (j !== lastClicked + 1) {
            $$("#day" + j).attr('disabled', true);
        }
    }
};

var initLinkClickEvents = function() {
    $$(".dayLink").click(function() {
        window.open($$(this).attr('data-link'), '_system');
        console.log()
    });
};

var initProgress = function() {
    getStudyUrls();
    initLinkClickEvents();
    var initialParticipantProgress = {
        linksClicked: [
            {day: 1, clicked: false, dateClicked: null, dateConfirmed: null},
            {day: 2, clicked: false, dateClicked: null, dateConfirmed: null },
            {day: 3, clicked: false, dateClicked: null, dateConfirmed: null },
            {day: 4, clicked: false, dateClicked: null, dateConfirmed: null },
            {day: 5, clicked: false, dateClicked: null, dateConfirmed: null },
            {day: 6, clicked: false, dateClicked: null, dateConfirmed: null },
            {day: 7, clicked: false, dateClicked: null, dateConfirmed: null }
        ],
        lastStudy: 0,
        confirmedState: false
    };
    if (localStorage.getItem('participantProgress') === null) {
        // first time the application is opened, initialize progress tracking:
        setParticipantProgress(initialParticipantProgress);
        var participantProgress = getParticipantProgress();
        // initialize first notification:
        var lastStudy = typeof participantProgress.lastStudy !== 'undefined' ? participantProgress.lastStudy : 0;
        if (lastStudy === 0) {
            var notificationTime = calculateNextNotificationTime();
            var day = lastStudy + 1;
            scheduleNotification(notificationTime, day);

        }
    }



    for (var i = 1; i <= 7; i++) {
        if (localStorage.getItem("linkClickProgressDay" + i) === null) {
            // first time the app is opened:
            localStorage.setItem("linkClickProgressDay" + i, false);
        } else {
            var clicked = localStorage.getItem("linkClickProgressDay" + i);
            var html = 'Day ' + i;
            if (clicked === 'true') {
                 html += ' <img src="img/notification_done.png" style="height: 15px; vertical-align:text-top"/>';

            }
            $$("#day" + i).html(html);
        }
    }

    render();
};
var calculateNextNotificationTime = function() {
    var time = new Date();
    time.setHours(17);
    time.setMinutes(0);
    time.setDate(time.getDate() + 1);
    return time;
};

var scheduleNotification = function(notificationTime, day) {
    cordova.plugins.notification.local.schedule({
        id: day,
        title: "It's time!",
        text: "Please complete day " + day + " of the consumption study ✍️",
        at: notificationTime,
        every: "day"
    });
};

var linkClicked = function(day) {
    try {
        var participantProgress = getParticipantProgress();
        participantProgress.lastStudy = day;
        participantProgress.confirmedState = false;

        for (var i = 0; i < participantProgress.linksClicked.length; i++) {
            if (participantProgress.linksClicked[i].day === parseInt(day)) {
                participantProgress.linksClicked[i].clicked = true;
                participantProgress.linksClicked[i].dateClicked = new Date();
            }
        }
        setParticipantProgress(participantProgress);
        render();
    } catch (e) {
        console.debug(e.toString());
    }
};

var decrementStudyProgress = function() {
    var participantProgress = getParticipantProgress();
    var lastStudy = participantProgress.lastStudy;
    if (lastStudy > 0) {
        participantProgress.lastStudy = lastStudy - 1;
        for (var i = 0; i < participantProgress.linksClicked.length; i++) {
            if (lastStudy === participantProgress.linksClicked[i].day) {
                participantProgress.linksClicked[i].dateClicked = null;
                participantProgress.linksClicked[i].dateConfirmed = null;
                participantProgress.linksClicked[i].clicked = false;
                break;
            }
        }
        setParticipantProgress(participantProgress);
    }
    render();
};

var formatDate = function(d) {
    return  [d.getDate().padLeft(), (d.getMonth() + 1).padLeft(), d.getFullYear()].join('/')
        + ' ' +
        [d.getHours().padLeft(), d.getMinutes().padLeft()].join(':');
};

var studyCompletionConfirmed = function(day) {
    try {
        if (typeof day === 'undefined' || day === null) {
            day = getParticipantProgress().lastStudy;
        }
        day = parseInt(day);
        cordova.plugins.notification.local.cancel(day);

        var notificationTime = calculateNextNotificationTime();
        if (day < 7) {
            var nextDay = day + 1;
            scheduleNotification(notificationTime, nextDay);
        } else {
            cordova.plugins.notification.local.cancelAll();
        }
        var participantProgress = getParticipantProgress();
        participantProgress.lastStudy = day;
        for (var i = 0; i < participantProgress.linksClicked.length; i++) {
            if (participantProgress.linksClicked[i].day === day) {
                participantProgress.linksClicked[i].dateConfirmed = new Date();
            }
        }
        participantProgress.confirmedState = true;
        setParticipantProgress(participantProgress);
        render();
    } catch (e) {
        console.debug(e.toString());
        render();
    }
};

// default values for study links:
var studyUrls = {
    day1: "https://www.google.com/?day1",
    day2: "https://www.google.com/?day2",
    day3: "https://www.google.com/?day3",
    day4: "https://www.google.com/?day4",
    day5: "https://www.google.com/?day5",
    day6: "https://www.google.com/?day6",
    day7: "https://www.google.com/?day7"
};

var appendStudyUrls = function(studyUrls) {
    for (var property in studyUrls) {
        if (studyUrls.hasOwnProperty(property)) {
            $$("#" + property).attr("data-link", studyUrls[property]);
        }
    }

};

var getStudyUrls = function() {
    $$("#loading").attr('style', 'display: block');
    $$("#content").hide();
    var url = "https://s3-eu-west-1.amazonaws.com/jrp-team-1-consumption/study-paths";
    var data = {};
    $$.getJSON(
        url,
        data,
        function (data, status, xhr) {
            console.log('got the data successfully');
            appendStudyUrls(data);
        },
        function (xhr, status) {
            console.log('got error', xhr, status);
            appendStudyUrls(studyUrls);
        });
    $$("#loading").hide();
    $$("#content").attr('style', 'display: block');
    render();
};
