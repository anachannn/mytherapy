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


const docBtns = document.getElementById("doc-btns");
docBtns.addEventListener('click', () => {
  docBtns.innerHTML = `<button id="doc-btns" class="btn-patient">Journaling</button>
  <div class="doc-container">
  <h2 class="title-doc">Which type of document? </h2>
  <div id="doc-form">
    <a class="btn-patient" href="/patient/create-text">Text</a>
    <a class="btn-patient" href="/patient/create-loop">Loop</a>
  </div>
  </div>`
});


/* EVENT LISTENERS */
// btnAddDocument.onclick = testClick;
// inputEditTherapist.onclick = toggleHidden;
