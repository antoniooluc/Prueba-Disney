var atras = null
var delante = null
var contador = 1;

$(document).ready(function(){
	$('.container-fluid').height($(window).height());
})

function printResults(results, pagTotales) {
  borrarTodo()
  let htmlResult = '<table class="table">' +
    '<thead class="thead-light"> <tr> <th scope="col">Nombre</th> <th scope="col">Id</th> <th scope="col">Imagen</th> </tr> </thead> <tbody>';
  for (element of results) {
    htmlResult += '<tr><th scope="row">' + element['Nombre'] + '</th>'
    htmlResult += '<td>' + element['Id'] + '</td>'
    htmlResult += '<td>' + '<img src="' + element['Imagen'] +
      '" alt="' + element['Imagen'].alt + '">' +
      '</td></tr>'
    //console.log(htmlResult)
  }
  htmlResult += '</tbody> </table>'
  document.querySelector('#data').insertAdjacentHTML('beforeend', htmlResult)

  let htmlPagTotales = '<p id="prueba" >Paginas Totales: '
  htmlPagTotales += contador
  htmlPagTotales += '/'
  htmlPagTotales += pagTotales
  htmlPagTotales += '</p>'

  document.querySelector('#pagTotales').insertAdjacentHTML('beforeend', htmlPagTotales)


  if (atras != null) {
    $('#atras').css("visibility", "visible");
  }
  else {
    $('#atras').css("visibility", "hidden");
  }

  if (delante != null) {
    $('#delante').css("visibility", "visible");
  } else {
    $('#delante').css("visibility", "hidden");
  }

  let containerFluid = document.querySelector('.container-fluid')

  containerFluid.style.height = $(window).height() + 200 + "px";
  containerFluid.style.display = "block";


}

function getFishWatchDataFETCH(disney) {
  fetch(disney,
    {
      method: 'GET',
      redirect: 'follow',
      headers: new Headers({ 'Content-Type': 'text/json' })
    })
    .then(resp => { return resp.json() })
    .then(respJSON => {
      let results = []
      console.log(respJSON)
      respJSON['data'].forEach(element => {
        if (element['imageUrl'] == undefined) {
          console.log("Es indefinidio")
          element['imageUrl'] = "-"
        }
        results.push({
          'Nombre': element['name'],
          'Id': element['_id'],
          'Imagen': element['imageUrl']
        })
      });
      document.querySelector('#data').innerHTML = ''
      atras = respJSON['info']['previousPage']
      delante = respJSON['info']['nextPage']
      printResults(results, respJSON['info']['totalPages'])
    })
    .catch(err => {
      console.log(err)
      printResults([
        {
          'Nombre': err.status,
          'Id': '-',
          'Imagen': { 'src': '', 'alt': '-' }
        }
      ]
      )
    })
}

window.onload = function () {

  fetch("footer.html").then(response => { return response.text() })
    .then(data => {
      document.querySelector("body").insertAdjacentHTML('beforeend', data)
    });


  fetch("navbar.html").then(response => { return response.text() })
    .then(data => {
      document.querySelector("body").insertAdjacentHTML('beforebegin', data)
    });

  let btn_search = document.querySelector('#search')
  if(btn_search != null){
    btn_search.addEventListener('click', function () {
      getFishWatchDataFETCH('https://api.disneyapi.dev/character');
    })
  }

  let btn_delante = document.querySelector('#delante')
  if(btn_delante != null){
    btn_delante.addEventListener('click', function () {
      console.log("Delante: " + delante)
      getFishWatchDataFETCH(delante);
      contador = contador + 1;
    })
  }

  let btn_atras = document.querySelector('#atras')
  if(btn_atras != null){
    btn_atras.addEventListener('click', function () {
      getFishWatchDataFETCH(atras);
      contador = contador - 1;
    })
  }

  //Empieza el LocalStorage
  let btn_registrar = document.querySelector('#usuarioBoton')
  if(btn_registrar != null){
    btn_registrar.addEventListener('click', insertarUsuario)
  }

  let btn_logout = document.querySelector('#logoutBoton')
  if(btn_logout != null){
    btn_logout.addEventListener('click', borrarUsuario)
  }


  setTimeout(comprobarStorage,50)

  //Termian el LocalStorage
}

//Funciones auxiliares

function borrarTodo() {
  $('#pagTotales').empty();
  $('#data').empty();
}

function borrarUsuario(){
  localStorage.removeItem("name");
  localStorage.removeItem("fotoPWA");
  location.reload();
}

function insertarUsuario(){
  let usuarioInput = document.querySelector("#usuario");
  if(usuarioInput.value == null || usuarioInput.value == undefined || usuarioInput.value == ''){
    document.querySelector("#emailHelp").style.display = "block";
  }
  else{
    localStorage.setItem("name", usuarioInput.value);
  }
}

function comprobarStorage(){

  let navRegistro = document.querySelector("#pruebaEnlace");
  let btn_logout = document.querySelector('#logoutBoton');
  let claseFoto = document.querySelector('#claseFoto');

  let formulario = document.querySelector("#formularioRegistro");
  let mensajeRegistrado = document.querySelector("#yaRegistrado");

  if(localStorage.getItem("name")){
    navRegistro.innerHTML = "Perfil";

    formulario.style.display = "none";
    mensajeRegistrado.textContent =  'Usted ya esta registrado como: ' + localStorage.getItem("name");

  } else{
    btn_logout.style.display = "none";
    claseFoto.style.display = "none";

  }

}