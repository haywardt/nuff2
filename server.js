// Global variables, switches, data
var settings = new Object();
var userid = new String();
var state = new Object();
var clientState = new Object();
var groupState = new Object();
var clientStateFilename = new String();
var groupStateFilename = new String();

const belongsInGroup = new RegExp(/^g_.*$/g); // anything that starts with g_

// init project
const express = require("express");
const app = express();
const fs = require("fs");
const cookieParser = require("cookie-parser"); // change to const
const bodyParser = require("body-parser");

function deepCloneObj (obj){ 
  return JSON.parse(JSON.stringify(obj));
}

function diffStates(oldState, newState) {
  // returns any properties in newState that have a different value than the same property in oldstate
  let diffState = {};
  for (let prop in newState) {
    if (oldState[prop] !== newState[prop]) diffState[prop] = newState[prop];
  }
  return diffState;
}

function combineStates(obj1, obj2) {
  // returns an object with all the properties of both input objects
  let separator = ","
  let obj1str = JSON.stringify(obj1);
  let obj2str = JSON.stringify(obj2);
  if(obj1str.length===2||obj2str.length===2) separator = "";
  return JSON.parse(
    obj1str.substr(0, obj1str.length - 1) +
      separator +
      obj2str.substr(1, obj2str.length - 1)
  );
}

function loadStates(){  // updates globals !!
  var buff;
  clientStateFilename = __dirname + "/data/users/" + userid;
  try{
  buff = fs.readFileSync(clientStateFilename);
  }
  catch {buff = fs.readFileSync(__dirname + "/data/users/default")}
  state=JSON.parse(buff.toString())
  groupStateFilename = __dirname + "/data/groups/" +state["groupSecret"];
  try {buff =fs.readFileSync(groupStateFilename);}
  catch {buff=fs.readFileSync(__dirname + '/data/groups/default')}
  groupState = JSON.parse(buff.toString())
};
app.all("*", checkHttps);
app.use(cookieParser());
app.use(bodyParser.json());

// get the `user` cookie, or make one if they dont hove one.
app.use(function(req, res, next) {
  console.log("cookies!");
  // check if client sent cookie
  userid = req.cookies.userid;
  if (userid === undefined) {
    // no: set a new cookie
    var randomNumber = Math.random().toString();
    randomNumber = parseInt(
      randomNumber.substring(2, randomNumber.length)
    ).toString(36);
    res.cookie("userid", randomNumber, {
      maxAge: 2147483647,
      httpOnly: true,
      sameSite: "Strict"
    });
    console.log("cookie created successfully", randomNumber);
  } else {
    // yes, cookie was already present
    console.log("cookie exists", userid);
  }
  next();
});

app.all("*", function(req, resp, next) {
  console.log("requesting:", req.url);
  return next();
});

// http://expressjs.com/en/starter/static-files.html
app.use(express.static(__dirname));
// app.use(express.static("images"));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/index.html");
  console.log("sending index.html in response to /");
});

app.post("/api/", function(request, response) {
  console.log("posting...", userid);
  console.log("request body=");
  console.log(request.body);
  console.log('----------------------------------------');
  // state =  /data/user/myCookie.json or /data/user/default if no previous file
 

  // add in changes from httpPost
  let clientUpdates = request.body;
  loadStates();
  console.log(state)
  state = combineStates(state,clientUpdates)
  var clientState = combineStates(state,clientUpdates)
  
  // clientState = clone of state+clientUpdates (for use in next update)
  fs.writeFileSync(clientStateFilename,JSON.stringify(state));

  // apply clientUpdates to groupState (posting my changes)
  
  for (let prop in clientUpdates) {
    if (groupState[prop]) {
  //  if the property exists in groupState and clientUpdates then update groupState with this property
  //      so that things in the default groupState dont have to be included in the regex.
      groupState[prop] = clientUpdates[prop];

  //  if the property matches the publishing regex then add it to the groupState
      } else if (belongsInGroup.test(prop)) {
      groupState[prop] = clientUpdates[prop];
    }
  }
 // save the groupState    
    fs.writeFileSync(groupStateFilename, JSON.stringify(groupState));
  


  // serverUpdates = difference between clientState and state;
  var serverUpdates = diffStates(clientState,state);
  response.send(serverUpdates)
  // send back serverUpdates
});


// listen for requests :)
         
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});

function checkHttps(req, res, next) {
  // protocol check, if http, redirect to https

  if (req.get("X-Forwarded-Proto").indexOf("https") != -1) {
    return next();
  } else {
    res.redirect("https://" + req.hostname + req.url);
  }
}
