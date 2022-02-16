const randomNumber = getRandomInt(100);

function getRandomInt(range) {
    return Math.floor(Math.random() * (range));
}

console.log(randomNumber)



const getNewPokemon = () => {
    const url = `https://pokeapi.co/api/v2/pokemon/${randomNumber}`;
    fetch(url, {
            method: 'get',
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.name, data.sprites.other["official-artwork"].front_default)

            const pokemonName = document.getElementsByClassName("card-title")[0];
            const pokemonImage = document.getElementById("card-img-top");

            pokemonName.textContent = data.name;
            pokemonImage.src = data.sprites.other["official-artwork"].front_default;

        });
}

getNewPokemon()