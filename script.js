document.addEventListener('DOMContentLoaded', () => {
    
    const introParagraph = document.getElementById('introParagraph');
    const inputPokemonName = document.querySelector('input[type="text"]');
    const searchButton = document.getElementById('searchButton');    
    const questionMark = document.getElementById('questionMark');
    const continueButton = document.getElementById('continueButton');
    const loadMorePokemons = document.getElementById('loadPokemons');
    const pokemonsIncrement = document.getElementById('pokemonsIncrement');

    const pokemonCard = document.getElementById('pokemonCard');
    const pokemonsCardsContainer = document.getElementById('pokemonsCardsContainer');
    

    let previousVisiblePokemons = 0;
    let limit = parseInt(pokemonsIncrement.value,10);
    let spriteView = 'front_default';

    window.addEventListener('beforeunload', () => {
        document.body.classList.remove('fade-in');
        document.body.classList.add('fade-out');
    });

    async function buttonsSprites(){
        try {
            const response = await fetch('https://pokeapi.co/api/v2/pokemon/1/');
            const data = await response.json();
            for (let i = 0; i <= 6; i+=2){
                const newViewButton = document.createElement('li');
                let viewName = (Object.keys(data.sprites)[i].charAt(0).toUpperCase()+Object.keys(data.sprites)[i].slice(1)).replace(/_/g, ' ')
                newViewButton.innerHTML = `<button id="${viewName}" class="px-4 py-2 text-white hover:bg-blue-600 text-sm sm:text-lg w-full flex justify-start">${viewName}</button>`
                document.getElementById('viewSpriteList').append(newViewButton);
                document.getElementById(viewName).addEventListener('click',()=>{
                    spriteView = Object.keys(data.sprites)[i];
                    applySpriteFilter();
                })
            }
        } catch (error) {
            console.error('fetch error:',error);
        }
    }

    buttonsSprites();

    async function buttonsGrowth(){
        try {
            const response = await fetch('https://pokeapi.co/api/v2/growth-rate/');
            const data = await response.json();
            for (let i = 0; i < data.results.length; i++){
                const newGrowthButton = document.createElement('li');
                let growthName = (data.results[i].name.charAt(0).toUpperCase()+data.results[i].name.slice(1)).replace(/-/g, ' ')
                newGrowthButton.innerHTML = `<button id="${data.results[i].name}" class="px-4 py-2 text-white hover:bg-blue-600 text-sm sm:text-lg w-full flex justify-start">${growthName}</button>`
                document.getElementById('growthList').append(newGrowthButton);
                newGrowthButton.addEventListener('click',()=>{
                    fetchGrowthPokemonsList(data.results[i].name);
                    search();
                })
            }
        } catch (error) {
            console.error('fetch error:',error);
        }
    }

    buttonsGrowth();

    async function fetchGrowthPokemonsList(growthRate){
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/growth-rate/${growthRate}/`);
            const data = await response.json();
            const pokemonWithGrowth = [];
            for (let i = 0; i<data.pokemon_species.length;i++){
                pokemonWithGrowth.push(data.pokemon_species[i].name)
            }
            for (let i = 0; i < pokemonWithGrowth.length; i++){
                const newPokemonCard = document.createElement('button');
                newPokemonCard.addEventListener('click', function(){
                    fetchPokemon(pokemonWithGrowth[i].toLowerCase());
                });
                console.log(data.pokemon_species[i].name)
                const endpointPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${data.pokemon_species[i].name.toLowerCase()}/`);
                const newPokemon = await endpointPokemon.json();
                newPokemonCard.classList.add("w-[250px]","h-auto","sm:w-[235px]","sm:h-auto","p-0","h-auto","bg-white","rounded-lg","shadow-lg","flex","flex-col","justify-center","items-center","hover:bg-blue-200");
                newPokemonCard.innerHTML = `<img id="${newPokemon.id}" class="h-auto w-[250px] self-center" src="${newPokemon.sprites[spriteView]}" alt="pokemon image" /><div class="flex flex-col p-3 px-5 gap-2 justify-center items-center"><p class="self-center font-bold text-3xl text-blue-900 text-xl">${pokemonWithGrowth[i].charAt(0).toUpperCase() + pokemonWithGrowth[i].slice(1)}</p></div>`;
                pokemonsCardsContainer.append(newPokemonCard);
            }
            pokemonCard.classList.add('hidden');
            pokemonCard.childNodes[3].childNodes[1].id = "pokemonId";
            pokemonsCardsContainer.classList.remove('hidden')
            loadMorePokemons.classList.remove('hidden');
            continueButton.classList.remove('hidden');
            pokemonsIncrement.classList.remove('md:hidden');
            pokemonsIncrement.classList.add('md:block');
            introParagraph.classList.add('hidden');
            questionMark.classList.add('md:hidden');
        } catch (error) {
            console.error('fetch error:',error);
        }
        
    }

    async function fetchPokemon(name){
        try {
            const endpointPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${name.toLowerCase()}/`); // Retrieved from Pokemon endpoint: name, weight, sprite and abilities.
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

            pokemonCard.childNodes[3].childNodes[1].id = `${data.id}`;
            pokemonImage.src = data.sprites[spriteView];
            pokemonName.textContent = data.name.charAt(0).toUpperCase() + data.name.slice(1);
            pokemonWeight.innerHTML = `<strong>Weight: </strong>${data.weight/10} kg`;
            pokemonHabitat.innerHTML = `<strong>Habitat: </strong>${habitat}`;
            pokemonAbilities.innerHTML = `<strong>Abilities: </strong>${data.abilities.map(ability => ability.ability.name).join(', ')}`;

            pokemonName.classList.remove('hidden');
            pokemonWeight.classList.remove('hidden');
            pokemonHabitat.classList.remove('hidden');
            pokemonAbilities.classList.remove('hidden');
            pokemonImage.classList.add('bg-blue-100',"h-auto", "w-[250px]", "sm:w-[350px]","sm:h-auto");
            pokemonCard.classList.add('shadow-lg','border','rounded-t-lg');
            pokemonCard.classList.remove('hidden');
            pokemonsCardsContainer.classList.add('hidden')
            loadMorePokemons.classList.add('hidden');
            continueButton.classList.remove('hidden');
            pokemonsIncrement.classList.add('md:hidden');
            introParagraph.classList.add('hidden');
            questionMark.classList.add('md:hidden');

        } catch (error) {
            console.error('Error fetching Pokemon data:', error);
            alert(`Could not find pokemon " ${name.charAt(0).toUpperCase()+name.slice(1)} "`);
        }

    }

    async function fetchPokemonsList(offset) {
        try {
            if (offset == true){
                pokemonsCardsContainer.innerHTML = "";
                if (window.innerWidth <= 640){
                    limit = 3;
                }
            }
            const endpointPokemons = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${previousVisiblePokemons}`); // Retrieve a list of Pokemons
            const pokemonList = await endpointPokemons.json();
            for (let i = 0; i < pokemonList.results.length; i++){
                const newPokemonCard = document.createElement('button');
                newPokemonCard.addEventListener('click', function(){
                    fetchPokemon(pokemonList.results[i].name.toLowerCase());
                });
                const endpointPokemon = await fetch(pokemonList.results[i].url)
                const newPokemon = await endpointPokemon.json();
                newPokemonCard.classList.add("w-[250px]","h-auto","sm:w-[235px]","sm:h-auto","p-0","h-auto","bg-white","rounded-lg","shadow-lg","flex","flex-col","justify-center","items-center","hover:bg-blue-200");
                newPokemonCard.innerHTML = `<img id="${newPokemon.id}" class="h-auto w-[250px] self-center" src="${newPokemon.sprites[spriteView]}" alt="pokemon image" /><div class="flex flex-col p-3 px-5 gap-2 justify-center items-center"><p class="self-center font-bold text-3xl text-blue-900 text-xl">${pokemonList.results[i].name.charAt(0).toUpperCase() + pokemonList.results[i].name.slice(1)}</p></div>`;
                pokemonsCardsContainer.append(newPokemonCard);
            }
            pokemonCard.classList.add('hidden');
            pokemonCard.childNodes[3].childNodes[1].id = "pokemonId";
            pokemonsCardsContainer.classList.remove('hidden')
            loadMorePokemons.classList.remove('hidden');
            continueButton.classList.remove('hidden');
            pokemonsIncrement.classList.remove('md:hidden');
            pokemonsIncrement.classList.add('md:block');
            introParagraph.classList.add('hidden');
            questionMark.classList.add('md:hidden');
            previousVisiblePokemons += limit;
            
        } catch (error) {
            console.error('Error fetching Pokémon data:', error);
            alert('Something went wrong');
        }
    }

    inputPokemonName.addEventListener('keydown', function(event){
        if(event.key==="Enter"){
            search();
            inputPokemonName.value = "";
        }
    });

    function validateIncrement(input) {
        return input >= 1 && input <= 20;
    }

    function validateInputName(input) {
        return typeof(input)=="string";
    }

    inputPokemonName.addEventListener('input',() => {
        const regex = /^[A-Za-z]+$/; // Regular expression to match only alphabetic characters (both uppercase and lowercase)
        const searchSvg = document.getElementById('searchSvg');
        if (regex.test(inputPokemonName.value) || inputPokemonName.value=="") {
            inputPokemonName.classList.remove('bg-red-100','ring-2', 'ring-red-500','opacity-[0.5]');
            searchButton.disabled = false
            searchSvg.classList.remove('opacity-[0.5]','cursor-not-allowed')
        } else {
            inputPokemonName.classList.add('bg-red-100','ring-1', 'ring-red-500');
            searchButton.disabled = true;
            searchSvg.classList.add('opacity-[0.5]','cursor-not-allowed')
        }        
    })

    function search(offset){
        if (offset){
            fetchPokemonsList(offset);
        }
        else if (validateIncrement(parseInt(pokemonsIncrement.value, 10))==true){
            if (inputPokemonName.value == "" || inputPokemonName.value.toLowerCase() == "all"){
                pokemonsCardsContainer.innerHTML = "";
                previousVisiblePokemons = 0;
                fetchPokemonsList();                
                return
            } else if (validateInputName(inputPokemonName.value.toLowerCase())){
                fetchPokemon(inputPokemonName.value.toLowerCase()),{trigger: 'hover'}
                return
            }
            alert('Please type a known pokemon name. (e.g.: Pikachu)')
        }
        else {
            alert('Choose a number between 1 and 20')
        }
    }

    function applySpriteFilter(){
        try {
            if (pokemonsCardsContainer.classList.contains('hidden') && pokemonCard.childNodes[3].childNodes[1].id=="pokemonId"){
                fetchPokemonsList();
            }
            else if (!pokemonCard.classList.contains('hidden')){
                fetchPokemon(pokemonCard.childNodes[3].childNodes[3].textContent);
            } else if (pokemonCard.classList.contains('hidden') && pokemonsCardsContainer.childNodes.length > 0) {
                limit = parseInt(pokemonsCardsContainer.lastChild.firstChild.id,10)-(parseInt(pokemonsCardsContainer.firstChild.firstChild.id, 10)-1);
                previousVisiblePokemons = parseInt(pokemonsCardsContainer.firstChild.firstChild.id, 10)-1;
                search(true);
                
            } else {
                search();
            }            
        } catch (error) {
            console.error('Error in filter:', error);
            alert('Something went wrong')
        }
    }

    searchButton.addEventListener('click', () => {if (pokemonsCardsContainer.classList.contains('hidden') || inputPokemonName.value != ""){search(); inputPokemonName.value = "";}});

    questionMark.addEventListener('click', () => {trigger: 'hover'});

    pokemonsIncrement.addEventListener('input',() => {
         if (validateIncrement(parseInt(pokemonsIncrement.value, 10))){
            pokemonsIncrement.classList.remove('bg-red-100','ring-2', 'ring-red-500');
            loadMorePokemons.classList.remove('hover:opacity-[0.6]','cursor-not-allowed');
            loadMorePokemons.disabled = false;
         }
         else{
            pokemonsIncrement.classList.add('bg-red-100','ring-2', 'ring-red-500');
            loadMorePokemons.classList.add('hover:opacity-[0.6]','cursor-not-allowed')
            loadMorePokemons.disabled = true;
            alert('Choose a number between 1 and 20')
         }
    })
    
    function scrollDown() {
        setTimeout(() => {
            window.scrollTo({
                top: document.body.scrollHeight - window.innerHeight + 500,
                behavior: 'smooth'
            });
        }, 400);
    }

    loadMorePokemons.addEventListener('click',()=>{
        if (validateIncrement(parseInt(pokemonsIncrement.value, 10))==true){
            limit = parseInt(pokemonsIncrement.value,10);
            fetchPokemonsList();
            scrollDown();
            return
        }
        alert('Choose a number between 1 and 20')
    }
    );
    
    continueButton.addEventListener('click', () => {
        inputPokemonName.value = "";
        previousVisiblePokemons = pokemonCard.childNodes[3].childNodes[1].id-1;
        limit = pokemonsCardsContainer.childNodes.length;
        pokemonsCardsContainer.innerHTML = "";
        fetchPokemonsList(true);
        scrollDown();
    });    
});