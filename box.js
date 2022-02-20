var bd;
const pokemonsList = document.getElementById("box-list");

function init () {
    var solicitud = indexedDB.open("PokemonDatabase");

    solicitud.onerror = function(e) {
        console.log("error: ", e.target.result);
    };

    solicitud.onsuccess = function(e) {
        bd = e.target.result;
        mostrar()
    };

    solicitud.onupgradeneeded = function(e) {
        bd = e.target.result;
        bd.createObjectStore("pokemon", { keyPath: "clave" });
    };
}


function mostrar() {
    let limit = 30
    var transaccion = bd.transaction(["pokemon"], "readonly");
    var almacen = transaccion.objectStore("pokemon").getAll();

    almacen.onsuccess = function(event) {
        let pokemons = event.target.result
        let content = ''

        for (let index = 0; index < limit; index++) {
            const element = pokemons[index];
            if(element){
                content+=`
                <div class="item-box">
                    <img src="${element.image}" height="60" width="60"/>
                </div>
                `
            }else{
                content+=`
                <div class="item-box">
                </div>
                `
            }
        }

        console.log(content)

        pokemonsList.innerHTML=content
    };
}


window.addEventListener("load", init, false);