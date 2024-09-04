document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.querySelector('input[type="text"]');
    const searchButton = document.getElementById('searchButton');
    const pokemonName = document.getElementById('pokemonName');
    const pokemonWeight = document.getElementById('pokemonWeight');
    const pokemonHabitat = document.getElementById('pokemonHabitat');
    const pokemonAbilities = document.getElementById('pokemonAbilities');
    const pokemonImage = document.querySelector('img');
    const pokemonCard = document.getElementById('pokemonCard');
    const pokemonCardContainer = document.getElementById('pokemonCardContainer');
    const loadPokemons = document.getElementById('loadPokemons');
    let previousNumberDisplayingPokemons = 0;
   
    window.addEventListener('beforeunload', () => {
        document.body.classList.remove('fade-in');
        document.body.classList.add('fade-out');
    });

    async function addPokemonsToList() {
        previousNumberDisplayingPokemons += 9;
    }
    loadPokemons.addEventListener('click',()=>{
        fetchPokemonList();}
    );

    async function fetchPokemon() {
        const pokemon = inputField.value.toLowerCase();
        if (!pokemon == "") {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
                const data = await response.json();

                const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
                const weight = data.weight / 10; /* Here I converted from hectograms to kilograms*/
                const abilities = data.abilities.map(ability => ability.ability.name).join(', ');

                const speciesResponse = await fetch(data.species.url);
                const speciesData = await speciesResponse.json();
                const habitat = speciesData.habitat ? speciesData.habitat.name : 'Unknown';

                pokemonName.textContent = name;
                pokemonWeight.innerHTML = `<strong>Weight: </strong> ${weight} kg`;
                pokemonHabitat.innerHTML = `<strong>Habitat: </strong> ${habitat}`;
                pokemonAbilities.innerHTML = `<strong>Abilities: </strong>: ${abilities}`;
                pokemonImage.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.id}.png`;

                pokemonName.classList.remove('hidden');
                pokemonWeight.classList.remove('hidden');
                pokemonHabitat.classList.remove('hidden');
                pokemonAbilities.classList.remove('hidden');
                pokemonImage.classList.add('bg-blue-100');
                pokemonCard.classList.add('shadow-lg','border','rounded-t-lg');
                pokemonCard.classList.remove('hidden');
                pokemonCardContainer.classList.add('hidden')
                loadPokemons.classList.add('hidden');

            } catch (error) {
                console.error('Error fetching Pokemon data:', error);
                alert('Pokemon not found or an error occurred.');
            }
        }
        else{
            try{
                fetchPokemonList();
                pokemonCard.classList.add('hidden');
                pokemonCardContainer.classList.remove('hidden')
                loadPokemons.classList.remove('hidden');
            } catch (error){
                console.error('Error fetching Pokemon data:', error);
                alert('Pokemon not found or an error occurred.');
            }

        }
    }

    async function fetchPokemonList() {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=6&offset=${previousNumberDisplayingPokemons}`);
            const data = await response.json();
            const pokemonUrls = data.results.map(pokemon => pokemon.url);
            const pokemonDetailsPromises = pokemonUrls.map(url => fetch(url).then(res => res.json()));
            const pokemonDetails = await Promise.all(pokemonDetailsPromises);
            const pokemonInfo = pokemonDetails.map(pokemon => ({
                name: pokemon.name,
                weight:pokemon.weight,
                image: pokemon.sprites.front_default,
                habitat: pokemon.habitat ? pokemon.habitat.name : 'Unknown',
                abilities: pokemon.abilities.map(ability => ability.ability.name)
            }));
            let pokemonListIndex = 0;
            for (let i = 0; i<pokemonInfo.length;i++){
                const newPokemonsCard = document.createElement('button');
                newPokemonsCard.addEventListener('click',
                    function(){
                        inputField.value = pokemonInfo[i]['name'];
                        fetchPokemon()
                        inputField.value = "";
                    });
                newPokemonsCard.classList.add("w-[250px]", "h-[400px]", "md:h-[480px]", "mt-3", "md:w-[300px]", "bg-white", "rounded-lg","shadow-lg", "overflow-auto", "flex", "flex-col","justify-center", "items-center");
                newPokemonsCard.innerHTML = `<img class="h-[250px] w-[250px] sm:w-[300px] sm:h-[300px] self-center" src="${pokemonInfo[i]['image']}" alt="pokemon image" /><div class="flex flex-col p-3 px-5 gap-2 justify-center items-center"><p class="self-center font-bold text-3xl text-blue-900 text-xl">${pokemonInfo[i]['name'].charAt(0).toUpperCase() + pokemonInfo[i]['name'].slice(1)}</p></div>`;
                pokemonCardContainer.append(newPokemonsCard);
                console.log(pokemonInfo[i]);
            }
            addPokemonsToList();
        } catch (error) {
          console.error('Error fetching Pokémon data:', error);
        }
      }

    searchButton.addEventListener('click', async () => {fetchPokemon();});
});
