const patientsAPI = new APIHandler('http://localhost:3000/doctor/api');

document.querySelector('.select-one').addEventListener('click', function (event) {
    const id = this.getAttribute("value")
   
    event.preventDefault()
  
      patientsAPI.getPatientInfo(id)
        .then((apiRes) => {
          printPatient(apiRes.data)
        })
        .catch(err => {
          console.log(err);
        })
  });

function printPatient(patient){
    let containerInfo = document.getElementById("doctor-main");
    containerInfo.innerHTML = `<p>${patient.name}</p>
    <p>${patient.lastname}</p>
    <p>${patient.email}</p>`
console.log(patient.myTexts)
    patient.myTexts.forEach(text => {
        containerInfo.innerHTML += `<p>${text.date}</p>
        <p id="print-doc/${text._id}">${text.title}</p>
        `
    });

}

