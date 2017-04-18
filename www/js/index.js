Number.prototype.padLeft = function(base, chr) {
    var len = (String(base || 10).length - String(this).length) + 1;
    return len > 0 ? new Array(len).join(chr || '0')+ this : this;
};

document.addEventListener('deviceready', function () {
    initAuth();
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
            var html = lastStudy === 1 ? 'the Intake' : 'day ' + (lastStudy - 1);
            $$(".userMistakeLastStudy").html(html);
        } else {
            $$(".userMistake").hide();
            $$("#initialMessage").hide();
            $$("#nextStudyQuestionMessage").attr('style', 'display: block');
            $$("#nextStudyMessage").hide();
            $$(".lastStudyMessageDay").each(function() {
                html = lastStudy === 1 ? 'the Intake' : 'day ' + (lastStudy - 1);
                $$(this).html(html);
            });
            var lastLinkClicked = getLastLinkClick();
            lastLinkClicked = formatDate(new Date(lastLinkClicked));
            $$("#lastStudyLinkClickTime").html(lastLinkClicked);

            $$("#nextStudyRedirect").click(function() {
                linkClicked(lastStudy);
                var url = $$("#day" + lastStudy).attr('data-link');
                try {
                    var inAppBrowserRef = cordova.InAppBrowser.open(url, '_blank', 'location=yes');
                    inAppBrowserRef.addEventListener('exit', render);
                } catch (e) {
                    window.open(url, '_system');
                }
            });
        }
        if (lastStudy < 8) {
            $$("#nextStudyMessage").html('Your next task is day <strong>' + lastStudy + '</strong> questionnaire.');
        } else {
            var completedText = "Thank you, you have completed the intervention! We will contact you via email in one month to check up, and show you a report of your progress. If you have any questions, please email us.";
            $$("#nextStudyMessage").html(completedText);
        }
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

        html = (day === 1 ? 'Intake' : 'Day ' + (day - 1));
        if (clicked === true && confirmed) {
            lastClicked = participantProgress.linksClicked[i].day;
            html = '<img src="img/white-check.png" style="height: 10px;"/> ' + html;
        }
        $$("#day" + day).html(html);
    }
    for (var j = 1; j <= 8; j++) {
        if (j !== lastClicked + 1) {
            $$("#day" + j).attr('disabled', true);
        }
    }
};

var initLinkClickEvents = function() {
    $$(".dayLink").click(function() {
        var allowed = isAllowedToAccessStudyAndAlertIfNot(false);
        if (allowed) {
            var currentLink = $$(this).attr('data-link');
            try {
                var inAppBrowserRef = cordova.InAppBrowser.open(currentLink, '_blank', 'location=yes');
                inAppBrowserRef.addEventListener('exit', render);
            } catch (e) {
                window.open(currentLink, '_system');
            }
        }

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
            {day: 7, clicked: false, dateClicked: null, dateConfirmed: null },
            {day: 8, clicked: false, dateClicked: null, dateConfirmed: null }
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



    for (var i = 1; i <= 8; i++) {
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
        id: (day - 1),
        title: "It's time!",
        text: "Please complete day " + (day - 1) + " of the consumption study ✍️",
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
    } catch (e) {

    }
};

var decrementStudyProgress = function() {
    var participantProgress = getParticipantProgress();
    var lastStudy = participantProgress.lastStudy;
    if (lastStudy > 0) {
        participantProgress.lastStudy = lastStudy - 1;
        for (var i = 0; i < participantProgress.linksClicked.length; i++) {
            if (lastStudy === participantProgress.linksClicked[i].day) {
                cancelNotification(participantProgress.linksClicked[i].day + 1);
                scheduleNotification(calculateNextNotificationTime(), participantProgress.linksClicked[i].day);
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

var cancelNotification = function(day) {
    try {
        cordova.plugins.notification.local.cancel(day);
    } catch (e) {
    }
};

var studyCompletionConfirmed = function(day) {
    try {
        if (typeof day === 'undefined' || day === null) {
            day = getParticipantProgress().lastStudy;
        }
        day = parseInt(day);
        cancelNotification(day);

        var notificationTime = calculateNextNotificationTime();
        if (day < 8) {
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
        render();
    }
};

// default values for study links:
var studyUrls = {
    day1: "https://unikoelnpsych.eu.qualtrics.com/jfe/form/SV_cAMr40YJFIe3hxX",
    day2: "https://unikoelnpsych.eu.qualtrics.com/jfe/form/SV_4UBP6WecP9VPa3b",
    day3: "https://unikoelnpsych.eu.qualtrics.com/jfe/form/SV_572nKcehQwuV3Zr",
    day4: "https://unikoelnpsych.eu.qualtrics.com/jfe/form/SV_b8E22ZB0x9a8uiN",
    day5: "https://unikoelnpsych.eu.qualtrics.com/jfe/form/SV_eK9hRscHUzV95NH",
    day6: "https://unikoelnpsych.eu.qualtrics.com/jfe/form/SV_emaqE9Udm70Yn7T",
    day7: "https://unikoelnpsych.eu.qualtrics.com/jfe/form/SV_25fZ2P2I9VAIjpH",
    day8: "https://unikoelnpsych.eu.qualtrics.com/jfe/form/SV_cTRdFzTGZLkePzf"
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
            appendStudyUrls(data);
        },
        function (xhr, status) {
            console.debug('got error', xhr, status);
            appendStudyUrls(studyUrls);
        });
    $$("#loading").hide();
    $$("#content").attr('style', 'display: block');
};

var permissionCheckCallback = function(exists) {
    if (!exists) {
        setTimeout(triggerAuthorizationPrompt, 1000);
    }
};

var triggerAuthorizationPrompt = function() {
    var message = 'Welcome to the Excessive Consumption Study app! Important: this app needs your permission to send notifications.';
    navigator.notification.alert(
        message,
        function() {
            cordova.plugins.notification.local.registerPermission(permissionRegistrationCallback);
        },
        'Welcome',
        'Confirm'
    );
};

var permissionRegistrationCallback = function(granted) {
    if (!granted) {
        mainView.router.loadPage({
            url: 'authorization.html',
            ignoreCache: true,
            reload: false
        });
    }
};

var initAuth = function() {
    cordova.plugins.notification.local.hasPermission(permissionCheckCallback);
};

var isAllowedToAccessStudyAndAlertIfNot = function(isRevisit) {
    var participantProgress = getParticipantProgress();
    if (participantProgress.lastStudy === 0 || isRevisit) {
        return true;
    }
    var i = participantProgress.linksClicked.length - 1;
    var lastDateClicked = null;

    do {
        lastDateClicked = participantProgress.linksClicked[i].dateClicked;
        i--;
    } while (i >= 0 && lastDateClicked === null);

    if (lastDateClicked === null) {
        return true;
    }

    var now = new Date();
    var then = new Date(lastDateClicked);
    var nowAndThenDiffHours = Math.abs(now - then) / 36e5;

    if (nowAndThenDiffHours < 12) {
        var timeLeft = 12 - nowAndThenDiffHours;
        var hours = parseInt(timeLeft);
        var minutes = Math.floor(timeLeft % parseInt(timeLeft) * 60);
        var message = 'You will be able to access the next questionnaire in ' + hours + ' hours and ' + minutes + ' minutes';
        showMessage(message, null, 'Too soon', 'OK');
        return false;
    }

    return true;
};

var showMessage = function(message, callback, title, buttonText) {
    navigator.notification.alert(
        message,
        callback,
        title,
        buttonText
    );
};