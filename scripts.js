var bd;
let lvl = 1;

const pokemonImage = document.getElementById("card-img-top");
const pokemonName = document.getElementsByClassName("card-title")[0];
const pokemonDescription =
    document.getElementsByClassName("card-description")[0];
const pokemonAbility = document.getElementsByClassName("card-hability")[0];
const pokemonType = document.getElementsByClassName("card-type")[0];
const pokemonType2 = document.getElementsByClassName("card-type2")[0];
const trainerLevel = document.getElementsByClassName("lvl")[0];

function iniciar() {
    getNewPokemon()

    var solicitud = indexedDB.open("PokemonDatabase");

    solicitud.onerror = function(e) {
        console.log("error: ", e.target.result);
    };

    solicitud.onsuccess = function(e) {
        bd = e.target.result;
    };

    solicitud.onupgradeneeded = function(e) {
        bd = e.target.result;
        bd.createObjectStore("pokemon", { keyPath: "clave" });
    };
}

const getNewPokemon = () => {
    const randomNumber = getRandomInt(898);
    const shinyChance = getRandomInt(4096);

    const url = `https://pokeapi.co/api/v2/pokemon/${randomNumber}`;
    getShowData(url, shinyChance);
};

function getShowData(url, shinyChance) {
    fetch(url, {
            method: "get",
        })
        .then((response) => response.json())
        .then((data) => {
            // console.log(data);
            setValuesOnHTML(data, shinyChance);
        });
}

function setValuesOnHTML(data, shinyChance) {
    trainerLevel.textContent = lvl;
    pokemonImage.style.backgroundImage =
        "url(assets/backgrounds/" + data.types[0].type.name + ".jpg)";
    pokemonImage.src = getPokemonImageChekingIfShiny(shinyChance, data);
    pokemonName.textContent = formatFirstLetter(data.name);
    pokemonDescription.textContent ="Base Experience: " + data.base_experience;
    pokemonAbility.textContent =
        "Ability: " + formatFirstLetter(data.abilities[0].ability.name);
    pokemonType.textContent =
        "Type: " + formatFirstLetter(data.types[0].type.name);
    pokemonType2.textContent = getPokemonTypes(data);
}

function getPokemonImageChekingIfShiny(shinyChance, data) {
    if (shinyChance == 1) {
        return data.sprites.other["home"].front_shiny;
    } else {
        return data.sprites.other["home"].front_default;
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

function getRandomInt(range) {
    return Math.floor(Math.random() * range + 1);
}

function agregarobjeto() {
    var transaccion = bd.transaction(["pokemon"], "readwrite");
    var almacen = transaccion.objectStore("pokemon");

    console.log("Almacenando... " + pokemonName.textContent);

    almacen.add({
        clave: pokemonName.textContent,
        image: pokemonImage.src,
        description: pokemonDescription.textContent,
        ability: pokemonAbility.textContent,
        type1: pokemonType.textContent,
        type2: pokemonType2.textContent,
    });

    mostrar();
}

function mostrar() {
    var transaccion = bd.transaction(["pokemon"], "readonly");
    var almacen = transaccion.objectStore("pokemon").getAll();

    almacen.onsuccess = function(event) {
        console.log(event.target.result);
        getNewPokemon();
    };
}

// function mostrarDatos(e) {
//     var cursor = e.target.result;

//     // if (cursor) {

//     //     zonadatos.innerHTML += "<div>" + cursor.value.clave + " - " + cursor.value.titulo + " - " + cursor.value.Fecha + "</div>";

//     //     cursor.continue();

//     // }
// }

window.addEventListener("load", iniciar, false);