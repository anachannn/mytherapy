const patientsAPI = new APIHandler('http://localhost:3000/doctor/api');
let containerInfo = document.getElementById("doctor-main");

document.querySelectorAll('.select-one').forEach(selected => {
    selected.addEventListener('click', function (event) {
    const id = this.getAttribute("value")
   
    event.preventDefault()
  
    patientsAPI.getPatientInfo(id)
        .then((apiRes) => {
          printPatient(apiRes.data)
          printDocuments(apiRes.data.myTexts)
          printDocuments(apiRes.data.myLoops)
        })
        .catch(err => {
          console.log(err);
        })
    
  });

})

function printPatient(patient){
    
    containerInfo.innerHTML = `<p>${patient.name}</p>
    <p>${patient.lastname}</p>
    <p>${patient.email}</p>
    <p>${patient.myTexts}</p>`
}

function printDocuments(documentList){
  
    documentList.forEach(text => {
        containerInfo.innerHTML += `<table class="doctor-manage-table">
        <thead>
          <tr class="table-row">
            <th class="table-head-patient">Type</th>
            <th class="table-head-patient">Date</th>
            <th class="table-head-patient">Title</th>
            <th class="table-head-patient">Read</th>
      
          </tr>
        </thead>

        <tbody>
          <tr class="table-row">
            <td colspan="5">Texts</td>
          </tr>


         {{#each this}}
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
<a href="/patient/read-document/{{this.docType}}/{{this._id}}"><i class="fas fa-eye table-icon"></i></a>
</td>

</tr>
{{/each}}
{{#unless this}}
<tr>
<td colspan="6">Sorry no document yet</td>
</tr>
{{/unless}}



          <tr class="table-row">
            <td colspan="5">Loops</td>
          </tr>


        {{#each this}}
<tr class="table-row">
<td class="table-division">
<div>${loop.docType}</div>
</td>

<td class="table-division">
<div>${loop.date}</div>
</td>

<td class="table-division">
<div>${loop.title}</div>
</td>
<td class="table-division">
<a href="/patient/read-document/{{this.docType}}/{{this._id}}"><i class="fas fa-eye table-icon"></i></a>
</td>

</tr>
{{/each}}
{{#unless this}}
<tr>
<td colspan="6">Sorry no document yet</td>
</tr>
{{/unless}}

     
        </tbody> 
      </table>
        
        `
    });
}




