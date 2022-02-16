const getNewPokemon = () => {
    const randomNumber = getRandomInt(898);

    console.log(randomNumber)

    const url = `https://pokeapi.co/api/v2/pokemon/${randomNumber}`;
    fetch(url, {
            method: 'get',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)

            const pokemonName = document.getElementsByClassName("card-title")[0];
            const pokemonDescription = document.getElementsByClassName("card-description")[0];
            const pokemonHability = document.getElementsByClassName("card-hability")[0];
            const pokemonType = document.getElementsByClassName("card-type")[0];
            const pokemonImage = document.getElementById("card-img-top");

            pokemonName.textContent = formatFirstLetter(data.name);
            pokemonDescription.textContent = "Base Experience: " + data.base_experience;
            pokemonHability.textContent = formatFirstLetter(data.abilities[0].ability.name);
            pokemonType.textContent = formatFirstLetter(data.types[0].type.name);

            pokemonImage.src = data.sprites.other["official-artwork"].front_default;


        });
}

function formatFirstLetter(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function getRandomInt(range) {
    return Math.floor(Math.random() * (range));
}
getNewPokemon()