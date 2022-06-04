let cardContainer = document.getElementById("card-container");

function mostrarEvento(evento){
    console.log(evento);
    let card=`
                <div class="row g-0">
                <div class="col-lg-6">
                    <img id="card-img" src="${evento.image}" class="card-img img-fluid rounded-start"
                        alt="Event details">
                </div>
                <div class="col-lg-6">
                    <div
                        class="card-body bg-dark text-light h-100 text-center d-flex flex-column justify-content-md-around">
                        <h5 class="card-title text-pink">${evento.name}</h5>
                        <p class="card-text">${evento.description}</p>
                        <div id="card-data">
                            <p class="card-text"><small class="fw-bold text-pink">Date: </small>${evento.date}</p>
                            <p class="card-text"><small class="fw-bold text-pink">Category: </small>${evento.category}</p>
                            <p class="card-text"><small class="fw-bold text-pink">Place: </small>${evento.place}</p>
                            <p class="card-text"><small class="fw-bold text-pink">Capacity: </small>${evento.capacity}</p>
                            <p class="card-text"><small class="fw-bold text-pink">Price: </small>$${evento.price}</p>
                        </div>
                    </div>
                </div>
            </div>
    `
    cardContainer.innerHTML = card;
}

//Obtener datos de API y aplicar funciones
async function getAPIData(url){
    let listaEventos;
    await fetch(url).then(response => response.json()).then(json => listaEventos = json.events);
    console.log(listaEventos);
    //Encontrar evento
    let idParam = location.search.split("=")[1];
    console.log(idParam);
    let evento = listaEventos.find((evento) => evento._id == idParam);
    mostrarEvento(evento);
}

getAPIData("https://amazing-events.herokuapp.com/api/events");







