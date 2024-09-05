document.addEventListener('DOMContentLoaded', () => {
    
    const introParagraph = document.getElementById('introParagraph');
    const inputPokemonName = document.querySelector('input[type="text"]');
    const searchButton = document.getElementById('searchButton');    
    const questionMark = document.getElementById('questionMark');
    const returnButton = document.getElementById('returnButton');
    const loadMorePokemons = document.getElementById('loadPokemons');
    const pokemonsIncrement = document.getElementById('pokemonsIncrement');

    const pokemonName = document.getElementById('pokemonName');
    const pokemonWeight = document.getElementById('pokemonWeight');
    const pokemonHabitat = document.getElementById('pokemonHabitat');
    const pokemonAbilities = document.getElementById('pokemonAbilities');
    const pokemonImage = document.querySelector('img');
    const pokemonCard = document.getElementById('pokemonCard');
    const pokemonsCardsContainer = document.getElementById('pokemonsCardsContainer');

    let visiblePokemons = 0;
    let limit = parseInt(pokemonsIncrement.value,10);

    window.addEventListener('beforeunload', () => {
        document.body.classList.remove('fade-in');
        document.body.classList.add('fade-out');
    });

    async function fetchPokemon(name){
        try {
            const endpointPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}/`); // Retrieved from Pokemon endpoint: name, weight, sprite and abilities.
            let data = await endpointPokemon.json();

            const pokemonCard = document.getElementById('pokemonCard');
            const pokemonImage = document.querySelector('img');
            const pokemonName = document.getElementById('pokemonName');
            const pokemonWeight = document.getElementById('pokemonWeight');
            const pokemonHabitat = document.getElementById('pokemonHabitat');
            const pokemonAbilities = document.getElementById('pokemonAbilities');

            const endpointSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${data.id}/`); //Retrieve the habitat for the given the pokemon.
            const pokemonSpecieData = await endpointSpecies.json();
            const habitat = pokemonSpecieData.habitat ? pokemonSpecieData.habitat.name : 'Unknown';

            pokemonImage.src = data.sprites['front_default'];
            pokemonName.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            pokemonWeight.innerHTML = `<strong>Weight: </strong> ${data.weight/10} kg`;
            pokemonHabitat.innerHTML = `<strong>Habitat: </strong> ${habitat}`;
            pokemonAbilities.innerHTML = `<strong>Abilities: </strong>: ${data.abilities.map(ability => ability.ability.name).join(', ')}`;

            pokemonName.classList.remove('hidden');
            pokemonWeight.classList.remove('hidden');
            pokemonHabitat.classList.remove('hidden');
            pokemonAbilities.classList.remove('hidden');
            pokemonImage.classList.add('bg-blue-100',"h-auto", "w-[250px]", "sm:w-[350px]","sm:h-auto");
            pokemonCard.classList.add('shadow-lg','border','rounded-t-lg');
            pokemonCard.classList.remove('hidden');
            pokemonsCardsContainer.classList.add('hidden')
            loadMorePokemons.classList.add('hidden');
            returnButton.classList.remove('hidden');
            pokemonsIncrement.classList.add('md:hidden');
            introParagraph.classList.add('hidden');

        } catch (error) {
            console.error('Error fetching Pokemon data:', error);
            alert(`Could not found pokemon " ${name.charAt(0).toUpperCase()+name.slice(1)} "`);
        }

    }

    async function fetchPokemonsList(offset) {
        try {
            limit = parseInt(pokemonsIncrement.value,10);
            if (offset == true){
                limit = visiblePokemons;
                visiblePokemons = 0;
            }
            const endpointPokemons = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${visiblePokemons}`); // Retrieve a list of Pokemons
            const pokemonList = await endpointPokemons.json();
            for (let i = 0; i < pokemonList.results.length; i++){
                const newPokemonCard = document.createElement('button');
                newPokemonCard.addEventListener('click', function(){
                    fetchPokemon(pokemonList.results[i].name);
                });
                const endpointPokemon = await fetch(pokemonList.results[i].url)
                const newPokemon = await endpointPokemon.json();
                newPokemonCard.classList.add("w-[250px]","h-auto","sm:w-[350px]","sm:h-auto","p-3","h-auto","mt-3","bg-white","rounded-lg","shadow-lg","flex","flex-col","justify-center","items-center","hover:bg-blue-200");
                newPokemonCard.innerHTML = `<img class="h-auto w-[250px] self-center" src="${newPokemon.sprites['front_default']}" alt="pokemon image" /><div class="flex flex-col p-3 px-5 gap-2 justify-center items-center"><p class="self-center font-bold text-3xl text-blue-900 text-xl">${pokemonList.results[i].name.charAt(0).toUpperCase() + pokemonList.results[i].name.slice(1)}</p></div>`;
                pokemonsCardsContainer.append(newPokemonCard);
            }
            pokemonCard.classList.add('hidden');
            pokemonsCardsContainer.classList.remove('hidden')
            loadMorePokemons.classList.remove('hidden');
            returnButton.classList.remove('hidden');
            pokemonsIncrement.classList.remove('md:hidden');
            pokemonsIncrement.classList.add('md:block');
            introParagraph.classList.add('hidden');
            visiblePokemons += limit;
            
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
            alert('Something went wrong');
        }
    }

    inputPokemonName.addEventListener('keydown', function(event){
        if(event.key==="Enter"){
            fetchPokemon(inputPokemonName.value);
        }
    });

    function validateIncrement(input) {
        return input >= 1 && input <= 20;
    }

    searchButton.addEventListener('click', () => {
        if (validateIncrement(parseInt(pokemonsIncrement.value, 10))==true){
            if (inputPokemonName.value == ""){
                fetchPokemonsList();
                return
            }
            fetchPokemon(inputPokemonName.value),{trigger: 'hover'}
        }
        else {
            alert('Choose a number between 1 and 20')
        }
    });

    questionMark.addEventListener('click', () => {trigger: 'hover'});


    loadMorePokemons.addEventListener('click',()=>{
        if (validateIncrement(parseInt(pokemonsIncrement.value, 10))==true){
            fetchPokemonsList();
            return
        }
        alert('Choose a number between 1 and 20')
    }
    );

    pokemonsIncrement.addEventListener('input',() => {
         if (!validateIncrement(parseInt(pokemonsIncrement.value, 10))){
            pokemonsIncrement.classList.add('bg-red-100','ring-2', 'ring-red-500');
         }
         else{
            pokemonsIncrement.classList.remove('bg-red-100','ring-2', 'ring-red-500');
         }
    })

    returnButton.addEventListener('click', () => {
        if (inputPokemonName.value == "") {
            pokemonsCardsContainer.innerHTML = "";
            fetchPokemonsList(true);
            pokemonsIncrement.classList.add('md:block');
            loadMorePokemons.scrollIntoView({ behavior: 'smooth' });
        } else {
            window.location.reload();
        }
    });
    
});
