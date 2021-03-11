//const patientsAPI = new APIHandler('https://my-therapy-app.herokuapp.com/doctor/api');
const patientsAPI = new APIHandler('http://localhost:3000/doctor/api');  // FOR LOCAL TESTS

let containerInfo = document.getElementById("doctor-main");
const body = document.querySelector("#body");
    

document.querySelectorAll('.select-one').forEach(selected => {
    selected.addEventListener('click', function (event) {
    const id = this.getAttribute("value")
   
    event.preventDefault()
  
    patientsAPI.getPatientInfo(id)
        .then((apiRes) => {
          printPatient(apiRes.data)
          body.innerHTML ="";  
          printDocuments(apiRes.data.myTexts)
          printDocuments(apiRes.data.myLoops)
        })
        .catch(err => {
          console.log(err);
        })
    
  });

})

function printPatient(patient){
    
    containerInfo.innerHTML = `<h2 class="title-page-doctor">About your patient :</h2>
    <img class="img-patient" src="${patient.photo}" alt="patient-profile-picture">
    <p>Name : ${patient.name}</p>
    <p>Lastname : ${patient.lastname}</p>
    <p>Email : ${patient.email}</p>
    <p>Phone number : ${patient.phoneNumber}</p>
    
   
    <p>Email : ${patient.email}</p>
    <h3>Medical reccord</h3>
    <p>Therapy : ${patient.MyTherapy}</p>
    <p>Goal(s): ${patient.myGoals}</p>
    `
}

{/* <h3>Location</h3>
<p>Address : ${patient.location.adress}</p>
<p>${patient.location.zipcode}${patient.location.city}</p> */}


function printDocuments(documentList){
  
  
    documentList.forEach(text => {
        
        body.innerHTML += `<tbody id="body">
        <tr class="table-row">
        <td colspan="5">Texts</td>
        </tr>
        <tr class="table-row">
        <td class="table-division">
        <div>${text.docType}</div>
        </td>
        
        <td class="table-division">
        <div>${text.date}</div>
        </td>
        
        <td class="table-division">
        <div>${text.title}</div>
        </td>

        <td class="table-division">
        <a href="/doctor/read-document/${text.docType}/${text._id}"><i class="fas fa-eye table-icon"></i></a>
        </td>
        
        </tr>
       

        `
    });
}




