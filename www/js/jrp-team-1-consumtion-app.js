// Initialize your app
var jrpTeam1ConsumptionApp = new Framework7({
    animateNavBackIcon: true
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = jrpTeam1ConsumptionApp.addView('.view-main', {
    domCache: true,
    dynamicNavbar: true
});
