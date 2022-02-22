var bd;
let pokemonObject = {}
let multiplier = 0;
let pagelimit = multiplier + 30;
const pokemonsList = document.getElementById("box-list");


const pokemonImage = document.getElementById("card-img-top");
const pokemonName = document.getElementsByClassName("card-title")[0];
const pokemonDescription = document.getElementsByClassName("card-description")[0];
const pokemonAbility = document.getElementsByClassName("card-hability")[0];
const pokemonType = document.getElementsByClassName("card-type")[0];

function init() {
    var solicitud = indexedDB.open("PokemonDatabase");

    solicitud.onerror = function (e) {
        // console.log("error: ", e.target.result);
    };

    solicitud.onsuccess = function (e) {
        bd = e.target.result;
        mostrar()
        showCard(null)
    };

    solicitud.onupgradeneeded = function (e) {
        bd = e.target.result;
        bd.createObjectStore("pokemon", { keyPath: "clave" });
    };
}

function deletepokemon(e) {
    release(e)
}

function clicked(e) {
    showCard(e)
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
        console.log(pokemon.clave)
        pokemonImage.src = pokemon.image
        pokemonName.value = formatFirstLetter(pokemon.clave);
        pokemonDescription.textContent = pokemon.description;
        pokemonAbility.textContent = formatFirstLetter(pokemon.ability);
        pokemonType.textContent = formatFirstLetter(pokemon.type1);
    } else {
        pokemonImage.src = "assets/" + "no-pokemon.png";
        pokemonName.textContent = "No pokemon selected";
        pokemonDescription.textContent = "Base Experience: " + "";;
        pokemonAbility.textContent =
            "Ability: " + "";
        pokemonType.textContent =
            "Type: " + "";
    }


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

function release(pokemon) {
    console.log(pokemon)
    console.log("KEY==================>", pokemon.clave)
    var transaccion = bd.transaction(["pokemon"], "readwrite")
    var almacen = transaccion.objectStore("pokemon").delete(pokemon.clave)
    console.log("almacen======================>", almacen);
    console.log("Deleted");
    pokemonImage.src = "assets/" + "no-pokemon.png";
    pokemonName.textContent = "No pokemon selected";
    pokemonDescription.textContent = "Base Experience: " + "";
    pokemonAbility.textContent =
        "Ability: " + "";
    pokemonType.textContent =
        "Type: " + "";
    almacen.onsuccess = mostrar()
}

function mostrar() {

    var transaccion = bd.transaction(["pokemon"], "readonly");
    var almacen = transaccion.objectStore("pokemon").getAll();

    almacen.onsuccess = function(event) {

        let pokemons = event.target.result
        if (multiplier >= 1) {}
        let content = `
            <div class="box-header">
                <div class="box-name">
                <img src='assets/images/arrow.svg' class="arrow previous" onclick="decPage()" style="cursor: pointer;"></img>
                    <p class="box-text">box ${multiplier+1}</p>
                    <img src='assets/images/arrow.svg' class="arrow next" onclick="incPage()" style="cursor: pointer;"></img>
                </div>
            </div>
        
        `


        for (let index = multiplier * 30; index < pagelimit; index++) {
            console.log("INDEX  ====================>", index);
            console.log("MULTIPLIER ====================>", multiplier);
            console.log("PAGELIMIT ====================>", pagelimit);
            const element = pokemons[index];
            if (element) {

                content += `
                <div class="box-cont">
                    <div onclick='clicked(${JSON.stringify(element)})' class="item-box">
                        <img src="${element.image}" height="60" width="60"/>
                    </div>
                    <div class="x-button" onclick='deletepokemon(${JSON.stringify(element)})'>
                        <img src="./assets/images/x-button.svg" class="x-image"></img>
                    </div>
                
                </div>
                `

            } else {
                content += `
                <div class="item-box">
                </div>
                `
            }

            // console.log(content)
        }
        pokemonsList.innerHTML = content
    };
}

window.addEventListener("load", init, false);