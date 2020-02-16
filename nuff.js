var hiddenState = {};

const stateHandler = {
  set: function(obj, prop, value) {
    serverChanged(obj, prop, value);
  }
};
function clientChanged() {
  console.log("client changed");
  if(event.target.type=="checkbox" && event.target.checked==false){
    state[event.target.name]=null;}
  else {
    state[event.target.name] = event.target.value;
  }
}
function serverChanged(obj, prop, value) {
  console.log("server changed");
  obj[prop] = value;
  
  var dataFields = document.querySelectorAll(
    'input[name="' + prop + '"]:not([type=radio]):not([type=checkbox])'
  );
  for (let field of dataFields) {
    field.value = value;
  }
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
  var htmlContent = document.querySelectorAll(
    '[name="' + prop + '"]:not(input):not(button)'
  );
  for (let content of htmlContent) {
    content.innerHTML = value;
  }
  return true;
}
var state = new Proxy(hiddenState, stateHandler);
document.addEventListener("DOMContentLoaded", function() {
  document.querySelector("body").addEventListener("change", clientChanged);
});
