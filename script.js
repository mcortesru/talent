let fotoSeleccionada;

document.getElementById("submit-btn").addEventListener("click", function(e){
  event.preventDefault(e);

  const form = document.getElementById("form");

  // Obtener los valores de los campos del formulario
  const evento = form.evento.value;
  const fecha = form.fecha.value;
  const lugar = form.lugar.value;
  const personas = form.personas.value;
  const observaciones = form.observaciones.value;


  // Verificar si al menos un campo tiene contenido
  if (evento || fecha || lugar || personas || observaciones) {
    // Crear un objeto con los valores del formulario
    const formData = {
    evento: evento,
    fecha: fecha,
    lugar: lugar,
    personas: personas,
    observaciones: observaciones,
    id: fotoSeleccionada
  };

  var xhr = new XMLHttpRequest();
  xhr.open("POST","http://localhost:3000/insert/",true);
  xhr.setRequestHeader("Content-Type","application/json");
  xhr.send(JSON.stringify(formData));


  form.reset();
}});

document.getElementById("prev").addEventListener("click", function(){
  pasarFotos(1);
  document.getElementById("form").reset(); 
  recargarRespuesta();

});

document.getElementById("next").addEventListener("click", function(){
  pasarFotos(-1);
  document.getElementById("form").reset(); 
  recargarRespuesta();

});

fetch('http://localhost:3000/fotos')
  .then(response => response.json())
  .then(jsonData => {
    // Hacer algo con el JSON obtenido, por ejemplo:
    const modifiedData = jsonData.ids.map(id => {
      return id.map(innerId => `./fotos/${innerId}.jpeg`);
    });
    
    jsonFinal = colocarFotos(modifiedData, 1);
  });


function pasarFotos(movimiento){
  guardarRestpuesta()
  console.log("reset");
  document.getElementById("form").reset(); 
  if (movimiento == 1){
    let fotoMainAntigua = jsonFinal[1];
    let fotoMainNueva = jsonFinal[0][jsonFinal[0].length - 1];
    let fotoAmeterEnLaIzquierdaPrincipio = jsonFinal[2][jsonFinal[2].length - 1];;
    let fotoAmeterEnLaDerechaPrincipio = fotoMainAntigua;


    jsonFinal[0].unshift(fotoAmeterEnLaIzquierdaPrincipio);
    jsonFinal[2].splice(jsonFinal[2].length - 1, 1);
    jsonFinal[1] = fotoMainNueva;
    jsonFinal[0].splice(jsonFinal[0].length - 1, 1);
    jsonFinal[2].unshift(fotoAmeterEnLaDerechaPrincipio);
  } else {
    let fotoMainAntigua = jsonFinal[1];
    let fotoMainNueva = jsonFinal[2][0];
    let fotoAmeterEnLaIzquierdaFinal = fotoMainAntigua;
    let fotoAmeterEnLaDerechaFinal = jsonFinal[0][0];
    
    jsonFinal[0].push(fotoAmeterEnLaIzquierdaFinal);
    jsonFinal[2].splice(0, 1);
    jsonFinal[1] = fotoMainNueva;
    jsonFinal[0].splice(0, 1);
    jsonFinal[2].push(fotoAmeterEnLaDerechaFinal)
  }

  colocarFotos(jsonFinal, 0);
}

function guardarRestpuesta(){
  const evento = form.elements["evento"].value;
  const fecha = form.elements["fecha"].value;
  const lugar = form.elements["lugar"].value;
  const personas = form.elements["personas"].value;
  const observaciones = form.elements["observaciones"].value;

  if (evento || fecha || lugar || personas || observaciones) {
    // Crear un objeto JSON con los valores del formulario
    const data = {
      evento: evento,
      fecha: fecha,
      lugar: lugar,
      personas: personas,
      observaciones: observaciones
    };
    console.log(fotoSeleccionada);
    localStorage.setItem(fotoSeleccionada, JSON.stringify(data));
  }
  console.log("reset");
  document.getElementById("form").reset(); 
}

function recargarRespuesta(){
  // Obtener el formulario y los campos
  const form = document.getElementById("form");
  const evento = form.elements["evento"];
  const fecha = form.elements["fecha"];
  const lugar = form.elements["lugar"];
  const personas = form.elements["personas"];
  const observaciones = form.elements["observaciones"];

  // Obtener los datos guardados del LocalStorage (si existen)
  const data = localStorage.getItem(fotoSeleccionada);
  if (data) {
    // Convertir los datos de JSON a un objeto JavaScript
    const formData = JSON.parse(data);

    // Rellenar los campos del formulario con los datos guardados
    evento.value = formData.evento;
    fecha.value = formData.fecha;
    lugar.value = formData.lugar;
    personas.value = formData.personas;
    observaciones.value = formData.observaciones;

    evento.addEventListener('input', function() {
      // Establecer la altura del área de texto para adaptarse al contenido
      textArea.style.height = 'auto';
      textArea.style.height = textArea.scrollHeight + 'px';
    });
  }
}

//Coloca las fotos en los divs al inicio
function colocarFotos(json, split){

  if (split == 1){
    var json = JSON.parse(splitJSON(json));

  }


  const imageSources1 = json[0];
  const imageSource = json[1];
  const imageSources2 = json[2];
  
  const imagesContainer1 = document.getElementById('slider_left');
  const imageContainer = document.getElementById('slider_main');
  const imagesContainer2 = document.getElementById('slider_right');

  while (imagesContainer1.firstChild) {
    imagesContainer1.removeChild(imagesContainer1.firstChild);
  }
  while (imagesContainer2.firstChild) {
    imagesContainer2.removeChild(imagesContainer2.firstChild);
  }
  while (imageContainer.firstChild) {
    imageContainer.removeChild(imageContainer.firstChild);
  }
  
  for (let i = 0; i < imageSources1.length; i++) {
    let path = "http://localhost:3000" + JSON.stringify(imageSources1[i][0]).substring(2);
    path = path.slice(0, -1);

    const div = document.createElement('div');
    div.classList.add("image_container");
    const image = document.createElement('img');
    image.classList.add("img_side");
    image.src = path;
    imagesContainer1.appendChild(div);
    div.appendChild(image);
  }
  
  let path = "http://localhost:3000" + JSON.stringify(imageSource[0]).substring(2);
  path = path.slice(0, -1);
  fotoSeleccionada = JSON.stringify(imageSource[0]).substring(2);
  fotoSeleccionada = fotoSeleccionada.slice(0, -6);
  
  const partesRuta = fotoSeleccionada.split('/');
  fotoSeleccionada = partesRuta[partesRuta.length - 1];

  const div = document.createElement('div');
  div.classList.add("image_container");
  const image = document.createElement('img');
  imageContainer.classList.add("img_main");
  image.src = path;
  imageContainer.appendChild(div);
  div.appendChild(image);
    
  for (let i = 0; i < imageSources2.length; i++) {
    let path = "http://localhost:3000" + JSON.stringify(imageSources1[i][0]).substring(2);
    path = path.slice(0, -1);
    
    const div = document.createElement('div');
    div.classList.add("image_container");
    const image = document.createElement('img');
    image.classList.add("img_side");
    image.src = path;
    imagesContainer2.appendChild(div);
    div.appendChild(image);
  }

  return json;
}

//Genera un json [ [slider_left], {slider_main}, [slider_right] ]
function splitJSON(arr) {  
  let randomIndex = Math.floor(Math.random() * arr.length);
  let firstArray = [];
  let secondArray = [];


  var n1 = Math.floor((arr.length -1) / 2);
  var n2 = arr.length - 1  - n1;  
  
  var pasadas = 0;
  let index;

  for (index = randomIndex; pasadas < n1; index++, pasadas++) {
    if (index >= arr.length){
        index = 0;
    }
    firstArray.push(arr[index]);
  }

  for (pasadas = 0; pasadas < n2; index++, pasadas++) {
    if (index >= arr.length){
        index = 0;
    }
    secondArray.push(arr[index]);
  }

  if (randomIndex == 0){
    randomIndex = arr.length;
  }
  return ("[" + JSON.stringify(secondArray) + "," +JSON.stringify(arr[randomIndex-1])+ "," + JSON.stringify(firstArray) + "]");
}


