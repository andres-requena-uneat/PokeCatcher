let lvl = 1;
const getNewPokemon = () => {
    const randomNumber = getRandomInt(898);
    const shinyChance = getRandomInt(4096);


    const url = `https://pokeapi.co/api/v2/pokemon/${randomNumber}`;
    fetch(url, {
            method: 'get',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)

            const pokemonName = document.getElementsByClassName("card-title")[0];
            const pokemonDescription = document.getElementsByClassName("card-description")[0];
            const pokemonAbility = document.getElementsByClassName("card-hability")[0];
            const pokemonType = document.getElementsByClassName("card-type")[0];
            const pokemonType2 = document.getElementsByClassName("card-type2")[0];
            const pokemonImage = document.getElementById("card-img-top");

            let trainerLevel = document.getElementsByClassName("lvl")[0];
            trainerLevel.textContent = lvl;

            pokemonImage.style.backgroundImage = "url(assets/backgrounds/" + data.types[0].type.name + ".jpg)"
            pokemonImage.src = getPokemonImageChekingIfShiny(shinyChance, pokemonImage, data);
            pokemonName.textContent = formatFirstLetter(data.name);
            pokemonDescription.textContent = "Base Experience: " + data.base_experience;
            pokemonAbility.textContent = "Primary Ability: " + formatFirstLetter(data.abilities[0].ability.name);
            pokemonType.textContent = "Type: " + formatFirstLetter(data.types[0].type.name);
            pokemonType2.textContent = getPokemonTypes(data);

        });
}

function getPokemonImageChekingIfShiny(shinyChance, pokemonImage, data) {
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
    return Math.floor((Math.random() * (range)) + 1);
}
getNewPokemon()