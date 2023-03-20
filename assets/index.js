
var map = L.map('map').setView([ -3.71839,  -38.5434], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.marker([ -3.71839,   -38.5434]).addTo(map)
    .bindPopup('Fortaleza-ce')
    .openPopup();

const inputRua = document.querySelector('#street');
const inputCity = document.querySelector('#city');
const inputBairro = document.querySelector('#bairro');
const sendButton = document.querySelector('.button');
const input = document.querySelectorAll('input');
let valorRua= "",valorBairro= "",valorCidade = "";


sendButton.addEventListener('click', validateInput);
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

    validateValues()? makeRequisition():false;
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
async function makeRequisition(){
    const linkNominatim = ` https://nominatim.openstreetmap.org/search?street=${valorRua}&city=${valorCidade}&county=${valorBairro}&addressdetails=1&format=json`
    const data = await fetch(linkNominatim).then(response =>response.json()).catch(error => erroInRequisition)
    let response = await data;  

    let latitude = response[0].lat;
    let longitude = response[0].lon;

    
    let cep = response[0].address.postcode;
    let estado = response[0].address.state;
    let pais = response[0].address.country;

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
function copyInputValue(el) {
    
      
    
  }
function erroInRequisition(){
    console.log('erro')
}
    const inputS = document.querySelectorAll('.inputSaida');

    inputS.forEach(el =>{
        el.addEventListener('click', (e)=> {
            e.target.parentElement.classList.add("active")
            setTimeout(()=>{ e.target.parentElement.classList.remove("active")},1500)
            navigator.clipboard.writeText(e.target.value)
            .then(() => {
              console.log('Texto copiado para a área de transferência');
            })
            .catch((error) => {
              console.error('Erro ao copiar texto para a área de transferência:', error);
            });
        });
    })

    