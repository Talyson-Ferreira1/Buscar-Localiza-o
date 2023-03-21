
var map = L.map('map').setView([ -3.71839,  -38.5434], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([ -3.71839,   -38.5434]).addTo(map)
    .bindPopup('Fortaleza-ce')
    .openPopup();

map.on("click",function(e){
    var marker = new L.marker([e.latlng.lat, e.latlng.lng]).addTo(map);
})
const btnGetUserLocation = document.querySelector(".buttonGetUserLocation")
const inputsInformation = document.querySelectorAll('.inputSaida');
const inputRua = document.querySelector('#street');
const inputCity = document.querySelector('#city');
const inputBairro = document.querySelector('#bairro');
const sendButton = document.querySelector('.button');
const input = document.querySelectorAll('input');
let valorRua= "",valorBairro= "",valorCidade = "";
let latitude, longitude, requisicao, cep, estado, pais, rua, bairro, cidade;


sendButton.addEventListener('click', validateInput);
btnGetUserLocation.addEventListener("click",getLocation );
input.forEach(e => { e.addEventListener('focus', removeWarning) });



function validateInput(){

    inputRua.value !== ""?validRua():addWarning(inputRua) ;
    inputBairro.value !== ""?validBairro():addWarning(inputBairro) ;
    inputCity.value !== ""?validcity():addWarning(inputCity) ; 

   function validRua(){
        if( inputRua.value !== ""){
            valorRua = inputRua.value
        }else return     
   } 
   function validBairro(){
        if(  inputBairro.value !== ""){
                valorBairro = inputBairro.value
            }else return         
   }
   function validcity(){
        if(  inputCity.value !== ""){
                valorCidade = inputCity.value
            }else return
   }
    requisicao = "inputValues"
    validateValues()? makeRequisition(requisicao):false;
    validateValues()? showOurInformation():false;

   
    valorRua = ""
    valorBairro = ""
    valorCidade = ""

}
function validateValues(){
    if(valorRua && valorBairro && valorCidade !== "" ){
        return true
    } return false
}

async function makeRequisition(requisicao){
    let link = ""
    if(requisicao == "inputValues"){
        link = ` https://nominatim.openstreetmap.org/search?street=${valorRua}&city=${valorCidade}&county=${valorBairro}&addressdetails=1&format=json`
    }else if(requisicao == "userLocation"){
        link = `https://nominatim.openstreetmap.org/reverse?addressdetails=1&format=json&lat=${latitude}&lon=${longitude}`          
    }

    const data = await fetch(link)
                        .then(response =>response.json())
                        .catch((error) => console.log("deu errado"))
    const resposta = await data;
    
    if(requisicao == "inputValues"){
        dataProcessingInputValue(resposta)
    }else if(requisicao == "userLocation"){
        dataProcessingUserLocation(resposta)
    }


    
}
function dataProcessingUserLocation(response){

    console.log(response)
    latitude = response.lat;
    longitude = response.lon;
    cep = response.address.postcode;
    estado = response.address.state;
    pais = response.address.country;
    rua = response.address.road;
    bairro = response.address.suburb;
    cidade = response.address.city;  

    showOurInformation(cep, estado, pais);
    updateMap(latitude, longitude)
    changeInputInformation(rua,bairro,cidade)
}
function dataProcessingInputValue(response){
    
    latitude = response[0].lat;
    longitude = response[0].lon;
    cep = response[0].address.postcode;
    estado = response[0].address.state;
    pais = response[0].address.country;

    showOurInformation(cep,estado,pais);
    updateMap(latitude,longitude)
}
function updateMap(latitude,longitude){

    map.setView([latitude,longitude],20)
    L.marker([latitude, longitude]).addTo(map)
}
function showOurInformation(cep,estado,pais){

    let containerOursInformations = document.querySelector(".contentCards");

    if(cep || pais || estado !== undefined){

        containerOursInformations.children[1].children[0].value = cep;
        containerOursInformations.children[2].children[0].value = pais;
        containerOursInformations.children[3].children[0].value = estado;

    }else{

        containerOursInformations.children[1].children[0].value = "Não encontrado"
        containerOursInformations.children[2].children[0].value = "Não encontrado"
        containerOursInformations.children[3].children[0].value = "Não encontrado"
        
    }
    

    setTimeout(()=>{
       
        containerOursInformations.style.opacity= 1;
        toggleTextwarning()

    },1500)

}
function changeInputInformation(rua,bairro,cidade){
    inputRua.value = rua;
    inputBairro.value = bairro;
    inputCity.value = cidade

}
function toggleTextwarning(){
    let warning = document.querySelector("#warningErrorUndefined");
    let container = document.querySelector(".contentCards");
   
    if( container.children[1].children[0].value &&
        container.children[2].children[0].value && 
        container.children[3].children[0].value === "Não encontrado"){

        warning.classList.add("warning");
    }else{
        warning.classList.remove("warning");
    }
}
function addWarning(input){
    input.parentElement.classList.add("warning");
    
    const warningText = document.createElement('div');
    warningText.classList.add('warningText');
    warningText.innerText="* Campo obrigatório"
    input.parentElement.appendChild(warningText);
}
function removeWarning(){
    parentElement = document.querySelector('#info').children;

    for(const input of parentElement) {
        if(input.classList.contains("warning")){
            input.classList.remove("warning")
        }

        for(const childElement of input.children){
            if(childElement.classList.contains("warningText")){
                childElement.remove()
            }
            
        }
        
    
    }
}
function erroInRequisition(){
    console.log('erro')
}
inputsInformation.forEach(el =>{

    el.addEventListener('click', (e)=>{copyInformation(e)})
})
function copyInformation(e) {

    e.target.parentElement.classList.add("active")

    setTimeout(()=>{ 
        e.target.parentElement.classList.remove("active")},1500)

        navigator.clipboard.writeText(e.target.value)

        .then(() => {

            console.log('Texto copiado para a área de transferência');
            })
        .catch((error) => {

        console.error('Erro ao copiar texto para a área de transferência:', error);
        }
    );
}
function getLocation(){
    navigator.geolocation.getCurrentPosition(definingPos);
    function  definingPos(pos){

        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;

        requisicao = "userLocation"
        makeRequisition(requisicao)
    }
} 




