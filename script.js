jsonPhotos = [
  {
    "_id": "63e93e2712dc21016c4888ab",
    "index": 0,
    "source": "./fotos/img0.png"
  },
  {
    "_id": "63e93e27a2a2f2165444d4d5",
    "index": 1,
    "source": "./fotos/img1.png"
  },
  {
    "_id": "63e93e27ecf5a297b472ae70",
    "index": 2,
    "source": "./fotos/img2.png"
  },
  {
    "_id": "63e93e27630e58eff6ed2cb2",
    "index": 3,
    "source": "./fotos/img3.png"
  },
  {
    "_id": "63e93e272c9b1dcaa5c54689",
    "index": 4,
    "source": "./fotos/img4.png"
  },
  {
    "_id": "63e93e27002f1840b2785ab7",
    "index": 5,
    "source": "./fotos/img5.png"
  },
  {
    "_id": "63e93e2721e8884621653d27",
    "index": 6,
    "source": "./fotos/img6.png"
  },
  {
    "_id": "63e93e271142a7ae8efd9d54",
    "index": 7,
    "source": "./fotos/img7.png"
  },
  {
    "_id": "63e93e27ee97d23e56402d95",
    "index": 8,
    "source": "./fotos/img8.png"
  }
]

document.getElementById("buttomSubmit").addEventListener("click", function() {
  sendSubmit()
});

document.getElementById("prev").addEventListener("click", function(){
  pasarFotos(1);
});

document.getElementById("next").addEventListener("click", function(){
  pasarFotos(-1)
});

jsonFinal = colocarFotos(jsonPhotos, 1);

function pasarFotos(movimiento){
  guardarRestpuesta()
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

  recargarRespuesta();
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
    localStorage.setItem(jsonFinal[1]._id, JSON.stringify(data));
  }
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
  const data = localStorage.getItem(jsonFinal[1]._id);
  if (data) {
    // Convertir los datos de JSON a un objeto JavaScript
    const formData = JSON.parse(data);

    // Rellenar los campos del formulario con los datos guardados
    evento.value = formData.evento;
    fecha.value = formData.fecha;
    lugar.value = formData.lugar;
    personas.value = formData.personas;
    observaciones.value = formData.observaciones;
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
    const div = document.createElement('div');
    div.classList.add("image_container");
    const image = document.createElement('img');
    image.classList.add("img_side");
    image.src = imageSources1[i].source;
    imagesContainer1.appendChild(div);
    div.appendChild(image);
  }
  
  const div = document.createElement('div');
  div.classList.add("image_container");
  const image = document.createElement('img');
  imageContainer.classList.add("img_main");
  image.src = imageSource.source;
  imageContainer.appendChild(div);
  div.appendChild(image);
    
  for (let i = 0; i < imageSources2.length; i++) {
    const div = document.createElement('div');
    div.classList.add("image_container");
    const image = document.createElement('img');
    image.classList.add("img_side");
    image.src = imageSources2[i].source;
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

//Escribe los datos escritos en el formulario
function sendSubmit(){
  let data = getJsonSubmit();
  if (data != null){
    console.log(JSON.stringify(data));
  }
}


//Devuelve los datos escritos en el formulario
function getJsonSubmit (){
  var evento = document.getElementById("evento").value;
  var fecha = document.getElementById("fecha").value;
  var lugar = document.getElementById("lugar").value;
  var personas = document.getElementById("personas").value;
  var observaciones = document.getElementById("observaciones").value;

  if (evento == "" && fecha == "" && lugar == "" && personas == "" && observaciones == ""){
    return null;
  }

  var formData = {
    "evento": evento,
    "fecha": fecha,
    "lugar": lugar,
    "personas": personas,
    "observaciones": observaciones
  };
  return formData;
}



