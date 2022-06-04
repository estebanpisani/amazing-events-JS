let data;
let listaEventos;

let eventStatsContainer = document.getElementById("eventDynamicRows");
let upcomingStatsContainer = document.getElementById("upcomingDynamicRows");
let pastStatsContainer = document.getElementById("pastDynamicRows");

function getUpcomingEvents(lista, fechaRef){
    let upcomingEvents = [];
    upcomingEvents = lista.filter(event => event.date>fechaRef);
    return upcomingEvents;
}
function getPastEvents(lista, fechaRef){
    let pastEvents = [];
    pastEvents = lista.filter(event => event.date<fechaRef);
    return pastEvents;
}
function getMinAssistance(lista){
        //Array sólo con porcentajes
    let porcentajes = [];
    porcentajes= lista.map(event => event.assistancePercentage); 
        //Porcentaje más bajo.
    let menorAsistencia = Math.min(...porcentajes);
        //Encontrar evento con ese porcentajes.
    let eventoMinAsis = lista.find(event => event.assistancePercentage == menorAsistencia);
    return eventoMinAsis;
}
function getMaxAssistance(lista){
        //Array sólo con porcentajes
    let porcentajes = [];
    porcentajes= lista.map(event => event.assistancePercentage);
            //Porcentaje más alto.
    let mayorAsistencia = Math.max(...porcentajes);
        //Encontrar evento con ese porcentajes.
    let eventoMaxAsis = lista.find(event => event.assistancePercentage == mayorAsistencia);
    return eventoMaxAsis;
}
function getMaxCapacity(lista){
    let capacidades = [];
    capacidades = lista.map(event => event.capacity)
    let mayorCapacidad = Math.max(...capacidades);
    let eventoMaxCap = lista.find(event => event.capacity == mayorCapacidad);
    return eventoMaxCap;
}
function getAssistanceAverage(lista){
    porcentajes=lista.map(event => Number(event.assistancePercentage))
    let total=0;
    for (let i=0; i<porcentajes.length; i++){
        total += porcentajes[i];
    }
    let promedio = (total/porcentajes.length).toFixed(2); 
    return promedio;
};
function getRevenueAverage(lista){
    let ganancias=[];
    let promedioGanancias=0;
    let total = 0;
    lista.forEach(event => {
        //Si es evento futuro
        if(event.estimate){
            ganancias.push(event.estimate*event.price);
        }else if(event.assistance){ //Si es evento pasado.
            ganancias.push(Number(event.price)*Number(event.assistance));
        }
    })
    for (let i = 0; i < ganancias.length; i++) {
        total += ganancias[i];
    }
    promedioGanancias=total/lista.length;
    return promedioGanancias.toFixed(2);
};

function getStatsByCategory(lista){
    //Obtengo una lista de categorías de cada evento (sin repetir)
    let categorias = [];
    lista.forEach(event=>{
        //Primero me fijo si ya no está cargada, para no cargarla de nuevo.
        if(!categorias.includes(event.category)){
            categorias.push(event.category);
        }
    });
    let estadisticas=[];
    //Recorro la lista de categorías y obtengo todos los eventos correspondientes a cada una.
    for (let i = 0; i < categorias.length; i++) {
        let eventosPorCat = [];
        //De la lista total, obtengo sólo los eventos que tengan la categoría correspondiente a cada iteración.
        eventosPorCat = lista.filter(event => event.category==categorias[i]);
        //Creo un objeto que tenga el nombre de la categoría, el promedio de ganancias y el promedio de asistencias.
        //Estos cálculos están hechos dentro de las funciones.
        let datosCat = {
            "category": categorias[i],
            "revenueAverage": getRevenueAverage(eventosPorCat),
            "assistanceAverage": getAssistanceAverage(eventosPorCat)
        };
        //Este objeto tiene las estadísticas de la categoría actual, la guardo en un array que va a tener las estadísticas de todas las categorías.
        estadisticas.push(datosCat);
    }
    return estadisticas;
}

function displayEventStats(datos){
    let template = `
                    <tr>
                        <td>${datos.eventMaxAssist.name} (${datos.eventMaxAssist.assistancePercentage}%)</td>
                        <td>${datos.eventMinAssist.name} (${datos.eventMinAssist.assistancePercentage}%)</td>
                        <td>${datos.eventMaxCap.name} (${datos.eventMaxCap.capacity})</td>
                    </tr>
    `

    return template;
};

function displayCategoryStats(lista){
    let template = "";
        
        for (let i=0; i<lista.length; i++){
        template += `
                        <tr>
                            <td>${lista[i].category}</td>
                            <td>$${lista[i].revenueAverage}</td>
                            <td>${lista[i].assistanceAverage}%</td>
                        </tr>
                    `
        }

    return template;
};


async function getAPIData(url){
    await fetch(url).then(response => response.json()).then(json => data = json);
    listaEventos = data.events;
    let pastEvents = getPastEvents(listaEventos, data.currentDate);
    let upcomingEvents = getUpcomingEvents(listaEventos, data.currentDate);
        //Obtener porcentajes de asistencia:
    pastEvents.forEach(element => element.assistancePercentage = ((Number(element.assistance)*100)/Number(element.capacity)).toFixed(2));
    upcomingEvents.forEach(element => element.assistancePercentage = ((Number(element.estimate)*100)/Number(element.capacity)).toFixed(2));
        console.log("Eventos Pasados:")
        console.log(pastEvents);
        console.log("Eventus Futuros:")
        console.log(upcomingEvents);
    //Resultados para Event Stats
    let eventStats = {
        eventMinAssist: getMinAssistance(pastEvents),
        eventMaxAssist: getMaxAssistance(pastEvents),
        eventMaxCap: getMaxCapacity(listaEventos)
    }
        //Obtener estadísticas por cada lista de eventos:
    let upcomingStats=getStatsByCategory(upcomingEvents);
    let pastStats=getStatsByCategory(pastEvents);
         //Testeos:
        console.log("Event Stats:");
        console.log(eventStats);
        console.log("Estadisticas Futuras por Categoría:");
        console.log(upcomingStats);
        console.log("Estadisticas Pasadas por Categoría:");
        console.log(pastStats);
        console.log("Event Stats");
        console.log(eventStats);


    //Imprimir casilleros.
    eventStatsContainer.innerHTML += displayEventStats(eventStats);
    upcomingStatsContainer.innerHTML += displayCategoryStats(upcomingStats);
    pastStatsContainer.innerHTML += displayCategoryStats(pastStats);
}



getAPIData("https://amazing-events.herokuapp.com/api/events");