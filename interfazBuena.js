let fotoSeleccionada;
let pos;
let total;
let jsonfotos;
let posComm = 0;

const selectorFiltro = document.getElementById('filtro');
selectorFiltro.value = "todos"

let aportacion;
let numeroAportaciones;
let  filtro = selectorFiltro.value;


let evento;
let fecha;
let lugar;
let personas;
let observaciones;
let comentarios;

let output_evento = document.getElementById("output_evento");
let output_fecha = document.getElementById("output_fecha");
let output_lugar = document.getElementById("output_lugar");
let output_personas = document.getElementById("output_personas");
let output_observaciones = document.getElementById("output_observaciones");
let output_comentarios = document.getElementById("output_comentarios");



document.getElementById("prev").addEventListener("click", function(){
    event.preventDefault();
    pasarFotos(-1);
    recargarComentario();
    document.getElementById("bottom-current-item").value = (pos+1).toString();


});

document.getElementById("next").addEventListener("click", function(){
    event.preventDefault();
    pasarFotos(1);
    recargarComentario();
    document.getElementById("bottom-current-item").value = (pos+1).toString();


});

fetch('http://localhost:3000/fotos')
  .then(response => response.json())
  .then(jsonData => {
    jsonfotos = jsonData;
    pos = 0;
    total = jsonData.ids.length - 1;
    fotoSeleccionada = (jsonData.ids[pos][0]);
    colocarFotos();
    posComm = 0;
    document.getElementById("bottom-current-item").value = (pos+1).toString();
    recargarComentario();
    actualizarLetreroID();

  });


function colocarFotos(){
    const imageContainer = document.getElementById('slider_main');
    let path = "http://localhost:3000/fotos/" + fotoSeleccionada + ".jpeg";
    
    const div = document.createElement('div');
    div.classList.add("image_container");
    const image = document.createElement('img');
    imageContainer.classList.add("img_main");
    image.src = path;
    imageContainer.appendChild(div);
    div.appendChild(image);

}

function pasarFotos(movimiento){
    posComm = 0;
    if (movimiento == 1){
        if (pos < total){
            pos++;
        } else {

            pos = 0;
        }
    } else {
        if (pos == 0){
            pos = total;
        } else {
            pos--;
        }
    }
    fotoSeleccionada = jsonfotos.ids[pos][0];
 
    const imageContainer = document.getElementById('slider_main');
    while (imageContainer.firstChild) {
        imageContainer.removeChild(imageContainer.firstChild);
    }

    const path = "http://localhost:3000/fotos/" + fotoSeleccionada + ".jpeg";

    const div = document.createElement('div');
    div.classList.add("image_container");
    const image = document.createElement('img');
    imageContainer.classList.add("img_main");
    image.src = path;
    imageContainer.appendChild(div);
    div.appendChild(image);

    actualizarLetreroID();

}

function getCommentsByItem(){
    return new Promise((resolve, reject) => {
        const url = "http://localhost:3000/comments/" + fotoSeleccionada;
        fetch(url)
        .then(response => response.json()) // convierte la respuesta a un objeto JSON
        .then(data => {    
            console.log(data);
            resolve (data);
        })
        .catch(error => {
            console.error(error); // muestra cualquier error ocurrido durante la solicitud
            resolve(error);
        });
    });
}

async function recargarComentario(){
    aportacion = await getCommentsByItem();

    if (filtro === "pendiente-de-revisar"){
        console.log("filtrado por pendiente de revisar (" + filtro + ")");
        aportacion = aportacion.filter(item => item.state[0] === "00");
    } else if (filtro === "documentado"){
        console.log("filtrado por documentado (" + filtro + ")");
        aportacion = aportacion.filter(item => item.state[0] === "01");
    } else{
        console.log("filtrado por todos (" + filtro + ")");
    }

    posComm = 0;
    numeroAportaciones = aportacion.length -1;
    document.getElementById("bottom-current-comment").value = (posComm+1).toString();

    console.log("incicio");
    console.log("posComm: " + posComm);
    console.log("num: " + numeroAportaciones);

    if (numeroAportaciones >= 0){
        evento = aportacion[posComm].evento[0];
        fecha = aportacion[posComm].fecha[0];
        lugar = aportacion[posComm].lugar[0];
        personas = aportacion[posComm].personas[0];
        observaciones = aportacion[posComm].comentarios[0];
        comentarios = aportacion[posComm].anotaciones && aportacion[posComm].anotaciones.length > 0 ? aportacion[posComm].anotaciones[0] : "";


        output_evento.innerHTML = evento;
        output_fecha.innerHTML = fecha;
        output_lugar.innerHTML = lugar;
        output_personas.innerHTML = personas;
        output_observaciones.innerHTML = observaciones;
        output_comentarios.value = comentarios;
    } else {
        output_evento.innerHTML = "";
        output_fecha.innerHTML = "";
        output_lugar.innerHTML = "";
        output_personas.innerHTML = "";
        output_observaciones.innerHTML = "";
        output_comentarios.value = "";

    }

    document.getElementById("bottom-current-comment").value = (posComm+1).toString();
    const letretoCom = document.getElementById('com_item');
    letretoCom.innerHTML = "Comentario: " + aportacion[posComm].id[0];
    let desplegable = document.getElementById("pane");
    let valor = "pendiente-de-revisar"; // Valor por defecto
    
    // Lógica para establecer el valor según la variable
    switch(aportacion[posComm].state[0]) {
      case "00":
        valor = "pendiente-de-revisar";
        break;
      case "01":
        valor = "documentado";
        break;
      default:
        valor = "pendiente-de-revisar"; // Valor por defecto si la variable no coincide con ninguna de las opciones
    }
    desplegable.value = valor; // Establecer el valor del select

}

document.getElementById("prev_com").addEventListener("click", function(){
    event.preventDefault();
    if (numeroAportaciones >= 0){
        if (posComm == 0){
            posComm = numeroAportaciones;
        } else {
            posComm = posComm - 1;
        }
        evento = aportacion[posComm].evento[0];
        fecha = aportacion[posComm].fecha[0];
        lugar = aportacion[posComm].lugar[0];
        personas = aportacion[posComm].personas[0];
        observaciones = aportacion[posComm].comentarios[0];
        comentarios = aportacion[posComm].anotaciones && aportacion[posComm].anotaciones.length > 0 ? aportacion[posComm].anotaciones[0] : "";

        output_evento.innerHTML = evento;
        output_fecha.innerHTML = fecha;
        output_lugar.innerHTML = lugar;
        output_personas.innerHTML = personas;
        output_observaciones.innerHTML = observaciones;
        output_comentarios.value = comentarios;
        console.log("prev");
        console.log("posComm: " + posComm);
        console.log("num: " + numeroAportaciones);
    } else {
        output_evento.innerHTML = "";
        output_fecha.innerHTML = "";
        output_lugar.innerHTML = "";
        output_personas.innerHTML = "";
        output_observaciones.innerHTML = "";
        output_comentarios.value = "";
    }
    document.getElementById("bottom-current-comment").value = (posComm+1).toString();

    const letretoCom = document.getElementById('com_item');
    letretoCom.innerHTML = "ID: " + aportacion[posComm].id[0];

    let desplegable = document.getElementById("pane");
    let valor = "pendiente-de-revisar"; // Valor por defecto
    
    // Lógica para establecer el valor según la variable
    switch(aportacion[posComm].state[0]) {
        case "00":
            valor = "pendiente-de-revisar";
            break;
          case "01":
            valor = "documentado";
            break;
          default:
            valor = "pendiente-de-revisar"; // Valor por defecto si la variable no coincide con ninguna de las opciones
    }
    desplegable.value = valor; // Establecer el valor del select
  }
);

document.getElementById("next_com").addEventListener("click", function(){
    event.preventDefault();
    if (numeroAportaciones >= 0){
        if (posComm < numeroAportaciones){
            posComm = posComm + 1;
        } else {
            posComm = 0;
        }
        evento = aportacion[posComm].evento[0];
        fecha = aportacion[posComm].fecha[0];
        lugar = aportacion[posComm].lugar[0];
        personas = aportacion[posComm].personas[0];
        observaciones = aportacion[posComm].comentarios[0];
        comentarios = aportacion[posComm].anotaciones && aportacion[posComm].anotaciones.length > 0 ? aportacion[posComm].anotaciones[0] : "";

        output_evento.innerHTML = evento;
        output_fecha.innerHTML = fecha;
        output_lugar.innerHTML = lugar;
        output_personas.innerHTML = personas;
        output_observaciones.innerHTML = observaciones;
        output_comentarios.value = comentarios;
        console.log("next");
        console.log("posComm: " + posComm);
        console.log("num: " + numeroAportaciones);
    } else {
        output_evento.innerHTML = "";
        output_fecha.innerHTML = "";
        output_lugar.innerHTML = "";
        output_personas.innerHTML = "";
        output_observaciones.innerHTML = "";
        output_comentarios.innerHTML = "";
    }
    document.getElementById("bottom-current-comment").value = (posComm+1).toString();
    const letretoCom = document.getElementById('com_item');
    letretoCom.innerHTML = "ID: " + aportacion[posComm].id[0];

    let desplegable = document.getElementById("pane");
    let valor = "pendiente-de-revisar"; // Valor por defecto
    
    // Lógica para establecer el valor según la variable
    switch(aportacion[posComm].state[0]) {
        case "00":
            valor = "pendiente-de-revisar";
            break;
          case "01":
            valor = "documentado";
            break;
          default:
            valor = "pendiente-de-revisar"; // Valor por defecto si la variable no coincide con ninguna de las opciones
    }
    desplegable.value = valor; // Establecer el valor del select

});

const inputElement = document.getElementById('bottom-current-comment');
inputElement.addEventListener('blur', function() {
    let newpos = inputElement.value - 1

    if (newpos < numeroAportaciones && newpos > 0){
        posComm = newpos;
        evento = aportacion[posComm].evento[0];
        fecha = aportacion[posComm].fecha[0];
        lugar = aportacion[posComm].lugar[0];
        personas = aportacion[posComm].personas[0];
        observaciones = aportacion[posComm].comentarios[0];

        
        output_evento.innerHTML = evento;
        output_fecha.innerHTML = fecha;
        output_lugar.innerHTML = lugar;
        output_personas.innerHTML = personas;
        output_observaciones.innerHTML = observaciones;
    } else {
        inputElement.value = posComm+1;
    }

});
inputElement.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        let newpos = inputElement.value - 1

    if (newpos < numeroAportaciones && newpos > 0){
        posComm = newpos;
        evento = aportacion[posComm].evento[0];
        fecha = aportacion[posComm].fecha[0];
        lugar = aportacion[posComm].lugar[0];
        personas = aportacion[posComm].personas[0];
        observaciones = aportacion[posComm].comentarios[0];

        
        output_evento.innerHTML = evento;
        output_fecha.innerHTML = fecha;
        output_lugar.innerHTML = lugar;
        output_personas.innerHTML = personas;
        output_observaciones.innerHTML = observaciones;
    } else {
        inputElement.value = posComm+1;
    }
    }
  });


const inputElementItem = document.getElementById('bottom-current-item');
inputElementItem.addEventListener('blur', function() {
    let newpos = inputElementItem.value - 1

    if (newpos < total && newpos > 0){
        pos = newpos;
        fotoSeleccionada = jsonfotos.ids[pos][0];
 
        const imageContainer = document.getElementById('slider_main');
        while (imageContainer.firstChild) {
            imageContainer.removeChild(imageContainer.firstChild);
        }

        const path = "http://localhost:3000/fotos/" + fotoSeleccionada + ".jpeg";

        const div = document.createElement('div');
        div.classList.add("image_container");
        const image = document.createElement('img');
        imageContainer.classList.add("img_main");
        image.src = path;
        imageContainer.appendChild(div);
        div.appendChild(image);

        recargarComentario();
    } else {
        inputElementItem.value = pos+1;
    }

});
inputElementItem.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        let newpos = inputElementItem.value - 1

        if (newpos < total && newpos > 0){
            pos = newpos;
            fotoSeleccionada = jsonfotos.ids[pos][0];
     
            const imageContainer = document.getElementById('slider_main');
            while (imageContainer.firstChild) {
                imageContainer.removeChild(imageContainer.firstChild);
            }
    
            const path = "http://localhost:3000/fotos/" + fotoSeleccionada + ".jpeg";
    
            const div = document.createElement('div');
            div.classList.add("image_container");
            const image = document.createElement('img');
            imageContainer.classList.add("img_main");
            image.src = path;
            imageContainer.appendChild(div);
            div.appendChild(image);
    
            recargarComentario();
        } else {
            inputElementItem.value = pos+1;
        }
    }
  });


function actualizarLetreroID (){
    const letrero = document.getElementById('tit_item');

    letrero.innerText = "Foto: " + fotoSeleccionada;
}

document.getElementById("submit-btn").addEventListener("click", function(event) {
       console.log("SUBMIT");
    event.preventDefault();
    var estado = document.getElementById("pane").value;
    var comentario = document.getElementById("output_comentarios").value;

    if (estado == "pendiente-de-revisar") {
        estado = "00";
    } else if (estado == "documentado") {
        estado = "01";
    } else {
        estado = "00";
    }

    var id_comment = aportacion[posComm].id[0];
    console.log(comentario);
    var cadenaConsulta = "https://summa.upsa.es/json/update.vm?query=id:" + id_comment + "&_anotaciones=" + comentario + "&_state=" + estado;
    cadenaConsulta = cadenaConsulta.replace(/ /g, "%20");
    // Crear el objeto XMLHttpRequest
    var xhttp = new XMLHttpRequest();

    // Configurar la petición HTTP POST con la URL y los parámetros
    var url = "http://localhost:3000/update/";
    var params = "query=" + encodeURIComponent(cadenaConsulta);
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // Enviar la petición HTTP POST con los parámetros
    xhttp.send(params);    console.log(aportacion[0]);
    recargarComentario();


});


//Filtro
selectorFiltro.addEventListener('change', (event) => {
  filtro = event.target.value;
  console.log('Selected option changed to:', filtro);
  recargarComentario();
});
