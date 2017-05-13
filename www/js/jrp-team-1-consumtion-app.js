// Initialize your app
var jrpTeam1ConsumptionApp = new Framework7({
    animateNavBackIcon: true,
    swipePanel: 'left'
});

// Export selectors engine
var $$ = Dom7;

// Add view
var mainView = jrpTeam1ConsumptionApp.addView('.view-main', {
    domCache: true,
    dynamicNavbar: true
});
