/* globals state */
const url = "/api/";
var hiddenState = {};
var serverState = {};

const stateHandler = {
  set: function(obj, prop, value) {
    serverChanged(obj, prop, value);
  }
};

const deepCloneObj = obj => JSON.parse(JSON.stringify(obj));

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
  let separator = ",";
  let obj1str = JSON.stringify(obj1);
  let obj2str = JSON.stringify(obj2);
  if (obj1str.length === 2 || obj2str.length === 2) separator = "";
  return JSON.parse(
    obj1str.substr(0, obj1str.length - 1) +
      separator +
      obj2str.substr(1, obj2str.length - 1)
  );
}
function getServerState() {
  fetch(url)
    .then(res => res.json())
    .then(function(res) {
      serverState = combineStates(res, serverState);
      for (let prop in res) {
        state[prop] = res[prop];
      }
    });
}
// send POST request
function updateServer() {
  // send what has changed on the serverState
  let changes = diffStates(serverState, state);
  let options = {
    method: "POST",
    body: JSON.stringify(changes),
    headers: {
      "Content-Type": "application/json"
    }
  };

  fetch(url, options)
    .then(res => res.json())
    .then(function(res) {
      serverState = combineStates(res, serverState);
      for (let prop in res) {
        state[prop] = res[prop];
      }
    });
}

function clientChanged() {
  console.log("client changed");
  console.log(this);
  if (event.target.type == "checkbox" && event.target.checked == false) {
    state[event.target.name] = null;
  } else {
    if (event.target.isContentEditable)
      state[this.getAttribute("name")] = event.target.innerText;
    else state[event.target.name] = event.target.value;
  }
updateServer();}

function addBlurListener(elem) {
  var fields = elem.querySelectorAll("[contenteditable]");
  for (let field of fields) {
    field.addEventListener("blur", clientChanged);
  }
}

function serverChanged(obj, prop, value) {
  console.log("server changed");
  if (value) {
    hiddenState[prop] = value.toString();
  } else {
    hiddenState[prop] = "";
  }
  console.log(prop);
  // psuedo arrays are handled here.
  // check to see if this data needs to create a new element because an array item has grown

  var propertyIsArray = /(([-_\w\d\s]+)\[(\d)\].)\w*/;
  var match = prop.match(propertyIsArray); // see if this property is formatted like an array

  if (match) {
    // its got an array looking set of names

    // check to see if any existing DOM elements match this array index, and if not clone a new one from the template
    // and append it to the template's container. Once it is created it is processed just like any other element.

    let elem = document.querySelector(`[name^="${match[1]}"]:not(template)`);
    if (!elem) {
      // this prop[index] does not exist so clone it from the template
      // Get the last <li> element ("Milk") of <ul> with id="myList2"

      let temp = document.querySelector(`template[name="${match[2]}"]`);
      let elemPosition = temp.parentElement;

      // Copy the template element and its child nodes
      var cln = temp.content.firstElementChild.cloneNode(true);
      // This regex changes the `[]` in the new element to the proper index number (ie [8])
      let arrayRef = new RegExp(match[2] + "\\[\\]\\.", "g");
      //
      cln.innerHTML = cln.innerHTML.replace(arrayRef, match[1]);

      addBlurListener(cln);

      elemPosition.appendChild(cln);
    }
  }

  // peruse the document to see what elements need this new data
  // handle things that need their value updated
  var dataFields = document.querySelectorAll(
    'input[name="' + prop + '"]:not([type=radio]):not([type=checkbox])'
  );
  for (let field of dataFields) {
    field.value = value;
  }
  // handle things that need their checked property updated
  var uncheckRadios = document.querySelectorAll(
    'input[name="' + prop + '"][type=radio]'
  );
  for (let button of uncheckRadios) {
    button.checked = null;
  }
  if (value === null) {
    var uncheckCheckboxes = document.querySelectorAll(
      'input[name="' + prop + '"][type=checkbox]'
    );
    for (let checkbox of uncheckCheckboxes) {
      checkbox.checked = null;
    }
  }
  var checkCheckboxes = document.querySelectorAll(
    'input[name="' + prop + '"][type=checkbox]'
  );
  for (let checkbox of checkCheckboxes) {
    checkbox.checked = value;
  }
  if (value) {
    var checkRadios = document.querySelectorAll(
      'input[name="' +
        prop +
        '"][value="' +
        value.substr(0, 12) +
        '"][type=radio]'
    );
    for (let radio of checkRadios) {
      radio.checked = "true";
    }
  }
  // update things that need their innerText updated. (innerHTML might be a security risk)
  var htmlContent = document.querySelectorAll(
    '[name="' + prop + '"]:not(input):not(button)'
  );
  for (let content of htmlContent) {
    content.innerText = value;
  }
  return true;
}

var state = new Proxy(hiddenState, stateHandler);

document.addEventListener("DOMContentLoaded", function() {
  document.querySelector("body").addEventListener("change", clientChanged);

  addBlurListener(document.querySelector("body"));
  getServerState();
});
