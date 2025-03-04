/*******************************************************************************
 * (C) Copyright IBM Corp. 2013, 2023
 *
 * SPDX-License-Identifier: Apache-2.0
*******************************************************************************/
function showLoginDialog() {
	dijit.byId('loginDialog').show();
}

function hideLoginDialog() {
	dijit.byId('loginDialog').hide();
}

function showLoginWaitDialog() {
	dijit.byId('loginWaitDialog').show();
}

function hideLoginWaitDialog() {
	dijit.byId('loginWaitDialog').hide();
}

function showWaitDialog() {
	dijit.byId('waitDialog').show();
}

function hideWaitDialog() {
	dijit.byId('waitDialog').hide();
}


function updateLoggedInUserWelcome() {
	var loggedinuser = dojo.cookie("loggedinuser");
	if (loggedinuser == null) {
		dojo.byId("loggedinwelcome").innerHTML = '';
	}
	else {
		dojo.byId("loggedinwelcome").innerHTML = 'Welcome Back ' + loggedinuser;
	}
}

function login() {
	hideLoginDialog();
	showLoginWaitDialog();
	
	var userString = document.getElementById('userId').value;
	dojo.xhrPost({
		content : {
			login: userString,
			password: document.getElementById('password').value
		},
		url: 'rest/api/login',
		load: function(response, ioArgs) {
			hideLoginWaitDialog();
			if (response != 'logged in') {
				// TODO: why isn't error function being called in this case
				alert('error logging in, response: ' + response);
				return;
			}
			dojo.cookie("loggedinuser", userString, {expires: 5, path: '/'});
			updateLoggedInUserWelcome();
		},
		error: function(response, ioArgs) {
			hideLoginWaitDialog();
			alert('error logging in, response: ' + response);
		}
	});
}

function logout() {
	updateLoggedInUserWelcome();
	var loggedinuser = dojo.cookie("loggedinuser");
	if (loggedinuser == null) {
		return;
	}
	
	dojo.xhrGet({
		content : {
			login: loggedinuser
		},
		url: 'rest/api/login/logout',
		load: function(response, ioArgs) {
			if (response != 'logged out') {
				// TODO: why isn't error function being called in this case
				alert('error logging out, response: ' + response);
				return;
			}
			dojo.cookie("loggedinuser", null, {expires: -1, path: '/'});
			dojo.cookie("acmeair_sessionid", null, {expires: -1, path: '/'});
			updateLoggedInUserWelcome();
		},
		error: function(response, ioArgs) {
			alert('error logging out, response: ' + response);
		}
	});
}

function dateFormatter(data) {
	var d = new Date(data);
	return dojo.date.locale.format(d, {selector: 'date', datePattern: 'MMMM d, yyyy - hh:mm a'});
}

function currencyFormatter(data) {
	return dojo.currency.format(data, {currency: "USD"});
}

// genned from mongo by:  db.airportcodes.find({}, {airportCode:1, airportName:1}).forEach(function(f){print(tojson(f, '', true));});
// switch airportCode to id
var airportCodes = [
	{ airportName : "Brussels", id : "BRU" },
	{ airportName : "Cairo", id : "CAI" },
	{ airportName : "Dubai", id : "DXB" },
	{ airportName : "Geneva", id : "GVA" },
	{ airportName : "Istanbul", id : "IST" },
	{ airportName : "Karachi", id : "KHI" },
	{ airportName : "Kuwait", id : "KWI" },
	{ airportName : "Lagos", id : "LOS" },
	{ airportName : "Manila", id : "MNL" },
	{ airportName : "Mexico City", id : "MEX" },
	{ airportName : "Nairobi", id : "NBO" },
	{ airportName : "Prague", id : "PRG" },
	{ airportName : "Rio de Janeir", id : "GIG" },
	{ airportName : "Stockholm", id : "ARN" },
	{ airportName : "Mumbai", id : "BOM" },
	{ airportName : "Delhi", id : "DEL" },
	{ airportName : "Frankfurt", id : "FRA" },
	{ airportName : "Hong Kong", id : "HKG" },
	{ airportName : "London", id : "LHR" },
	{ airportName : "Montreal", id : "YUL" },
	{ airportName : "Moscow", id : "SVO" },
	{ airportName : "New York", id : "JFK" },
	{ airportName : "Paris", id : "CDG" },
	{ airportName : "Rome", id : "FCO" },
	{ airportName : "Singapore", id : "SIN" },
	{ airportName : "Sydney", id : "SYD" },
	{ airportName : "Tehran", id : "IKA" },
	{ airportName : "Tokyo", id : "NRT" },
	{ airportName : "Amsterdam", id : "AMS" },
	{ airportName : "Aukland", id : "AKL" },
	{ airportName : "Bangkok", id : "BKK" }
];

function airportCodeToAirportName(airportCode) {
	var airports = dojo.filter(airportCodes, function (item) { return item.id == airportCode; } );
	if (airports.length > 0) {
		return airports[0].airportName;
	}
	return airportCode;
}