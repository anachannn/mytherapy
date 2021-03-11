class APIHandler {
    constructor (baseUrl) {
      this.BASE_URL = baseUrl;
    }

getPatientInfo(id){
    return axios.get(this.BASE_URL + `/patient/${id}`)
}


}