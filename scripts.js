
const _PORT = "44834";
const _ROUTE = `http://127.0.0.1:${_PORT}/api/pokemon/`
const _POKEAPI = "https://pokeapi.co/api/v2/pokemon/"


var bd;
let lvl = 1;

const pokemonImage = document.getElementById("card-img-top");
const pokemonName = document.getElementsByClassName("card-title")[0];
const pokemonDescription =
    document.getElementsByClassName("card-description")[0];
const pokemonAbility = document.getElementsByClassName("card-hability")[0];
const pokemonType = document.getElementsByClassName("card-type")[0];
const pokemonType2 = document.getElementsByClassName("card-type2")[0];

function iniciar() {
    getNewPokemon()

    var solicitud = indexedDB.open("PokemonDatabase");

    solicitud.onerror = function (e) {
        console.log("error: ", e.target.result);
    };

    solicitud.onsuccess = function (e) {
        bd = e.target.result;
    };

    solicitud.onupgradeneeded = function (e) {
        bd = e.target.result;
        bd.createObjectStore("pokemon", { keyPath: "clave" });
    };
}

const getNewPokemon = () => {
    const randomNumber = getRandomInt(898);
    const shinyChance = getRandomInt(4096);

    const url = `${_POKEAPI}${randomNumber}`;
    getShowData(url, shinyChance);
};

function getShowData(url, shinyChance) {
    fetch(url, {
        method: "get",
    })
        .then((response) => response.json())
        .then((data) => {
            setValuesOnHTML(data, shinyChance);
        });
}

function setValuesOnHTML(data, shinyChance) {
    pokemonImage.style.backgroundImage =
        'url(assets/backgrounds/' + data.types[0].type.name + '.jpg)';
    pokemonImage.src = getPokemonImageChekingIfShiny(shinyChance, data);
    pokemonImage.alt = getPokemonSpriteChekingIfShiny(shinyChance, data);
    pokemonName.textContent = formatFirstLetter(data.name);
    pokemonDescription.textContent = "Base Experience: " + data.base_experience;
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

function getPokemonSpriteChekingIfShiny(shinyChance, data) {
    if (shinyChance == 1) {
        return data.sprites.front_shiny;
    } else {
        return data.sprites.front_default;
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



function agregarObjeto() {
    var transaccion = bd.transaction(["pokemon"], "readwrite");
    var almacen = transaccion.objectStore("pokemon");

    var data = {
        clave: pokemonName.textContent,
        image: pokemonImage.src,
        backgroundImage: pokemonImage.style.backgroundImage,
        sprite: pokemonImage.alt,
        description: pokemonDescription.textContent,
        ability: pokemonAbility.textContent,
        type1: pokemonType.textContent,
        type2: pokemonType2.textContent,
    }

    var xhr = new XMLHttpRequest();
    xhr.open("POST", _ROUTE , false);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(data));

    almacen.add({
        clave: pokemonName.textContent,
        image: pokemonImage.src,
        backgroundImage: pokemonImage.style.backgroundImage,
        sprite: pokemonImage.alt,
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

    almacen.onsuccess = function (event) {
        getNewPokemon();
    };
}

window.addEventListener("load", iniciar, false);