
const _PORT = "44834";
const _ROUTE = `http://127.0.0.1:${_PORT}/api/pokemon/`
const _POKEAPI = "https://pokeapi.co/api/v2/pokemon/"

var bd;
let pokemonObject = {};
let multiplier = 0;
let pagelimit = multiplier + 30;
const pokemonsList = document.getElementById("box-list");
const pokemonImage = document.getElementById("card-img-top");
const pokemonName = document.getElementsByClassName("card-title")[0];
const pokemonDescription =
    document.getElementsByClassName("card-description")[0];
const pokemonAbility = document.getElementsByClassName("card-hability")[0];
const pokemonType = document.getElementsByClassName("card-type")[0];

function init() {
    var solicitud = indexedDB.open("PokemonDatabase");

    solicitud.onerror = function (e) {
        console.error("error: ", e.target.result);
    };

    solicitud.onsuccess = function (e) {
        bd = e.target.result;
        mostrar();
        showCard(null);
    };

    solicitud.onupgradeneeded = function (e) {
        bd = e.target.result;
        bd.createObjectStore("pokemon", { keyPath: "clave" });
    };
}

function deletepokemon(e) {
    release(e);
}

function clicked(e) {
    showCard(e);
}

function incPage() {
    multiplier++;
    pagelimit = multiplier * 30 + 30;
    mostrar();
}

function decPage() {
    if (multiplier >= 1) {
        multiplier--;
        pagelimit = multiplier * 30 + 30;
        mostrar();
    }
}

function showCard(pokemon = null) {
    pokemonObject = pokemon;
    if (pokemon) {
        pokemonImage.src = pokemon.image;
        pokemonImage.style.backgroundImage = pokemon.backgroundImage;
        pokemonName.value = formatFirstLetter(pokemon.clave);
        pokemonDescription.textContent = pokemon.description;
        pokemonAbility.textContent = formatFirstLetter(pokemon.ability);
        pokemonType.textContent = formatFirstLetter(pokemon.type1);
    } else {
        pokemonImage.src = "assets/" + "no-pokemon.png";
        pokemonName.value = "No pokemon selected";
        pokemonDescription.textContent = "";
        pokemonAbility.textContent = "";
        pokemonType.textContent = "";
    }
}

function formatFirstLetter(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function getPokemonTypes(data) {
    if (data.types.length == 2) {
        return "/" + formatFirstLetter(data.types[1].type.name);
    } else {
        pokemonType2.textContent = "";
    }
}

function rename(pokemon) {
    const oldName = pokemon.clave;
    pokemon.clave = formatFirstLetter(pokemonName.value);
    var transaccion = bd.transaction(["pokemon"], "readwrite");
    transaccion.objectStore("pokemon").delete(oldName);
    var almacen = transaccion.objectStore("pokemon").put(pokemon);
    pokemonName.value = pokemon.clave;
    almacen.onsuccess = function (e) {
        mostrar();
    };
}

function release(pokemon) {

    var xhr = new XMLHttpRequest();
    xhr.open("DELETE", `${_ROUTE}${pokemon["_id"]}` , false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send();

    var transaccion = bd.transaction(["pokemon"], "readwrite");
    var almacen = transaccion.objectStore("pokemon").delete(pokemon.clave);
    pokemonImage.src = "assets/" + "no-pokemon.png";
    pokemonName.value = "No pokemon selected";
    pokemonDescription.textContent = "Base Experience: " + "";
    pokemonAbility.textContent = "Ability: " + "";
    pokemonType.textContent = "Type: " + "";
    almacen.onsuccess = function (e) {
        mostrar();
    };
}

function mostrar() {
    var transaccion = bd.transaction(["pokemon"], "readonly");
    var almacen = transaccion.objectStore("pokemon").getAll();
    
    almacen.onsuccess = async function (event) {
    var pokeData =await fetch(_ROUTE)
        .then(response => response.json())
        .then(data => {return data});

    
        let pokemons =  pokeData //event.target.result;

        let content = `
            <div class="box-header">
                <div class="box-name">
                <img src='assets/images/arrow.svg' class="arrow previous" onclick="decPage()" style="cursor: pointer;"></img>
                    <p class="box-text">box ${multiplier + 1}</p>
                    <img src='assets/images/arrow.svg' class="arrow next" onclick="incPage()" style="cursor: pointer;"></img>
                </div>
            </div>
        
        `;

        for (let index = multiplier * 30; index < pagelimit; index++) {
            const element = pokemons[index];
            if (element) {
                content += `
                <div class="box-cont">
                    <div onclick='clicked(${JSON.stringify(
                    element
                )})' class="item-box">
                        <img src="${element.sprite}" height="60" width="60"/>
                    </div>
                    <div class="x-button" onclick='deletepokemon(${JSON.stringify(
                    element
                )})'>
                        <img src="./assets/images/x-button.svg" class="x-image"></img>
                    </div>
                </div>
                `;
            } else {
                content += `
                <div class="item-box">
                </div>
                `;
            }
        }
        pokemonsList.innerHTML = content;

        let leftArrow = document.getElementsByClassName("arrow previous")[0];
        if (multiplier == 0) {
            leftArrow.style = "opacity: 0 !important;";
        } else {
            leftArrow.style = "opacity: 1 !important;";
        }
    };
}

window.addEventListener("load", init, false);