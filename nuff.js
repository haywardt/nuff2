var hiddenState = {};

const stateHandler = {
  set: function(obj, prop, value) {
    serverChanged(obj, prop, value);
  }
};

function clientChanged() {
  console.log("client changed");
  if (event.target.type == "checkbox" && event.target.checked == false) {
    state[event.target.name] = null;
  } else {
    state[event.target.name] = event.target.value;
  }
}
function serverChanged(obj, prop, value) {
  console.log("server changed");
  obj[prop] = value;
  // check to see if this data needs to create a new element because an array item has grown

  var propertyIsArray = /(([-_\w\d\s]+)\[(\d)\].)\w*/;
  var match = prop.match(propertyIsArray); // see if this property is formatted like an array
  if (match) {
    // check to see if any existing DOM elements match this array index, and if not clone a new one from the template.
    let elem = document.querySelector(`[name^="${match[1]}"]:not(template)`);
    if (!elem) {
      // this prop[index] does not exist so clone it from the template
      // Get the last <li> element ("Milk") of <ul> with id="myList2"

      let temp = document.querySelector(`template[name="${match[2]}"]`);
      let elemPosition = temp.parentElement;

      // Copy the template element and its child nodes
      var cln = temp.content.firstElementChild.cloneNode(true);
      //put the index in the name
      let arrayRef = new RegExp(match[2] + "\\[\\]\\.", "g");
      cln.innerHTML = cln.innerHTML.replace(arrayRef, match[1]);
      // Append the template element clone to end of the template container
      elemPosition.appendChild(cln);

      // Now change all the [] in the element names of the cloned element to [index]
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
  var checkRadios = document.querySelectorAll(
    'input[name="' + prop + '"][value="' + value + '"][type=radio]'
  );
  for (let radio of checkRadios) {
    radio.checked = "true";
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
});
