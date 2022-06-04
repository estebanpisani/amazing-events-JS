let listaEventos;
//contenedor de los checkboxes
var checkboxContainer = document.getElementById("checkboxes-container");
var checked = [];
//Búsqueda por nombre. Input y Botón.
let searchInput = document.getElementById("search-input");
//Inicializo vacío el valor de búsqueda por nombre
var searchValue = "";
let dataAPI;

//Funciones
function filtrarEventosFuturos(lista, fechaRef){
    let eventosFuturos = [];
    console.log("Fecha ref: "+fechaRef)
    for (let i = 0; i < lista.length; i++) {
        let fechaEvento = lista[i].date;
        
        if(fechaEvento>fechaRef){
            eventosFuturos.push(lista[i]);
        }
    }
    listaEventos = eventosFuturos;
}
function mostrarEventos(lista){
    // console.log("Eventos filtrados en mostrar: "+lista)
    let cardTemplate = "";
    if(lista.length>0){
        for (let i = 0; i < lista.length; i++) {
            let cardData = lista[i];
            cardTemplate += `
                            <div class="col-12 col-sm-6 col-md-4 col-xl-3 col-xxl-2 grid-item mt-3">
                                <div class="card text-center text-pink bg-dark h-100" >
                                    <img src="${cardData.image}" class="card-img card-img-top h-50" alt="${cardData.name}">
                                    <div class="card-body h-50">
                                        <div class="mb-4">
                                            <h6 class="card-title mb-2">${cardData.name}</h6>
                                            <p class="card-text">Date: <span class="text-light">${cardData.date}</span></p>
                                        </div>    
                                        <div class="btn btn-outline-danger precio mt-2 d-block">Price: <span class="text-light">$${cardData.price}</span></div>
                                        <a href="./details.html?id=${cardData._id}" class="btn btn-danger mt-2 d-block">More info</a>
                                    </div>
                                </div>
                            </div>
            `;
        }
    } else {
        cardTemplate = `<div class="d-flex h-100 w-100 mt-3 text-center justify-content-center align-items-center">
                            <h5 class="card-title">No events found.</h5>
                        </div>`;
    }

    document.getElementById("grid").innerHTML = cardTemplate;
}

function mostrarFiltrosCategorias(listaEventos){
    let listaCategorias = [];
    //Recorre cada evento. Si la category del evento no está incluida ya en "listaCategorias", la agrega al final.
    listaEventos.forEach(evento => {
        if(!listaCategorias.includes(evento.category)){
            listaCategorias.push(evento.category);
        }
    });

    let checkbox = "";
        for (let i = 0; i < listaCategorias.length; i++) {
        checkbox += `
                        <div class="form-check form-check-inline text-start col-12 col-md-3 col-lg-4 col-xxl-1">
                            <input class="form-check-input " type="checkbox" id="inlineCheckbox${i}" value="${listaCategorias[i]}">
                            <label class="form-check-label text-start" for="inlineCheckbox${i}">${listaCategorias[i]}</label>
                        </div>
        `;
    }
    checkboxContainer.innerHTML = checkbox;
}

function aplicarFiltroCategoria(){
    // Capturar checkboxes mostrados
    let listaCheckboxes = checkboxContainer.querySelectorAll("input[type=checkbox]");
    //A cada checkbox le asigno un evento de click.
    listaCheckboxes.forEach(checkbox => checkbox.addEventListener("click", (event)=> {
        if (event.target.checked) { //Verifica si esta tildado o no el checkbox
            //Si esta tildado guardo el valor de ese checkbox dentro del array de filtros aplicados.
            checked.push(event.target.value) 
            filtrado(); //LLamo a la funcion que se ocupara del filtrado general del array
        } else {
            // Si el checkbox clickeado no está tildado, filtra elementos que tampoco lo estén.
            checked = checked.filter(unchecked => unchecked !== event.target.value) 
            filtrado();//LLamo de nuevo a la funcion que se ocupara del filtrado general del array
        } 
    }));
}

function aplicarFiltroNombre(){
    // Capturo el valor del input al hacer click en el botón del formulario y lo guardo en searchValue.
    searchInput.addEventListener("keyup", () => {
        searchValue = searchInput.value;
        filtrado();
    });
}

function filtrado(){
    let eventosFiltrados = [];
    // Si sólo hay checkboxes
    if(searchValue==="" && checked.length>0){
        checked.map(category => {listaEventos.forEach(evento => {
            if(evento.category ===category){
                eventosFiltrados.push(evento);
            }
        } )
    })
    }
        // Si sólo hay texto
    else if(searchValue!=="" && checked.length===0){
        listaEventos.forEach(evento =>{
            if(evento.name.toLowerCase().includes(searchValue.trim().toLowerCase())){
                eventosFiltrados.push(evento);
            }
        })
    }
        // Si están ambos
    else if(searchValue!=="" && checked.length>0){
        checked.map(category => {listaEventos.forEach(evento => {
                    if(evento.category === category && evento.name.toLowerCase().includes(searchValue.trim().toLowerCase())){
                        eventosFiltrados.push(evento);
                    }
                } )
            }
        );
    }
        //Si no hay ninguno
    else{
        eventosFiltrados=listaEventos;
    }
    // console.log("Eventos Filtrados en filtrado: "+eventosFiltrados);
    mostrarEventos(eventosFiltrados);  
}

//Obtener datos de API y aplicar funciones
async function getAPIData(url){
    let eventosTotal;
    await fetch(url).then(response => response.json()).then(json => dataAPI = json);
    eventosTotal = dataAPI.events;
    console.log(eventosTotal);

    filtrarEventosFuturos(eventosTotal, dataAPI.currentDate)
    mostrarFiltrosCategorias(listaEventos);
    mostrarEventos(listaEventos); 
    aplicarFiltroCategoria();
    aplicarFiltroNombre();

}


getAPIData("https://amazing-events.herokuapp.com/api/events");


