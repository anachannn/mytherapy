/* VARIABLES */
const btnAddDocument = document.getElementById("add-doc");
const inputEditTherapist = document.getElementById("input-edit-myTherapist");
const selectEditTherapist = document.getElementById("select-edit-myTherapist");



/* FUNCTIONS */
function testClick() {
  console.log("button clicked");
}

function toggleHidden(event, element) {
  console.log(event.target);
  event.target.classList.add("hidden");
  selectEditTherapist.classList.remove("hidden");
}




/* EVENT LISTENERS */
// btnAddDocument.onclick = testClick;
// inputEditTherapist.onclick = toggleHidden;
