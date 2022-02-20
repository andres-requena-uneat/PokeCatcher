var bd;

const pokemonsList = document.getElementById("box-list");


const pokemonImage = document.getElementById("card-img-top");
const pokemonName = document.getElementsByClassName("card-title")[0];
const pokemonDescription =
    document.getElementsByClassName("card-description")[0];
const pokemonAbility = document.getElementsByClassName("card-hability")[0];
const pokemonType = document.getElementsByClassName("card-type")[0];

function init () {
    var solicitud = indexedDB.open("PokemonDatabase");

    solicitud.onerror = function(e) {
        console.log("error: ", e.target.result);
    };

    solicitud.onsuccess = function(e) {
        bd = e.target.result;
        mostrar()
        showCard(null)
    };

    solicitud.onupgradeneeded = function(e) {
        bd = e.target.result;
        bd.createObjectStore("pokemon", { keyPath: "clave" });
    };
}
function clicked (e){
    showCard(e)
}

function showCard(pokemon=null){
    if(pokemon){
        console.log(pokemon)
        pokemonImage.src = pokemon.image
        pokemonName.textContent = formatFirstLetter(pokemon.clave);
        pokemonDescription.textContent = pokemon.description;
        pokemonAbility.textContent =formatFirstLetter(pokemon.ability);
        pokemonType.textContent = formatFirstLetter(pokemon.type1);
    }else{
        pokemonImage.src = "assets/"+"no-pokemon.png";
        pokemonName.textContent = "No pokemon selected";
        pokemonDescription.textContent ="Base Experience: " + "No pokemon selected";;
        pokemonAbility.textContent =
            "Ability: " + "No pokemon selected";
        pokemonType.textContent =
            "Type: " + "No pokemon selected";
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
function mostrar() {
    let limit = 30
    var transaccion = bd.transaction(["pokemon"], "readonly");
    var almacen = transaccion.objectStore("pokemon").getAll();

    almacen.onsuccess = function(event) {
        let pokemons = event.target.result
        let content = `
            <div class="box-header">
                <div class="box-name">
                <img src='assets/images/arrow.svg' class="arrow previous"></img>
                    <p class="box-text">box 1</p>
                    <img src='assets/images/arrow.svg' class="arrow next"></img>
                </div>
            </div>
        
        `
        

        for (let index = 0; index < limit; index++) {
            const element = pokemons[index];
            if(element){
                
                content+=`
                <div onclick='clicked(${JSON.stringify(element)})' class="item-box">
                    <img onclick='showCard(${element})' src="${element.image}" height="60" width="60"/>
                </div>
                `
                
            }else{
                content+=`
                <div class="item-box">
                </div>
                `
            }

            console.log(content)
        }
        pokemonsList.innerHTML=content
    };
}

window.addEventListener("load", init, false);

