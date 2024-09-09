document.addEventListener('DOMContentLoaded', () => {
    
    const introParagraph = document.getElementById('introParagraph');
    const inputPokemonName = document.querySelector('input[type="text"]');
    const searchButton = document.getElementById('searchButton');    
    const questionMark = document.getElementById('questionMark');
    const continueButton = document.getElementById('continueButton');
    const loadMorePokemons = document.getElementById('loadPokemons');
    const increment = document.getElementById('pokemonsIncrement');
    const pokemonsCardsContainer = document.getElementById('pokemonsCardsContainer');

    let offset = 0;
    let pokemonsIncrement = parseInt(increment.value,10);
    let spriteView = 'front_default';
    let growthRate = 'All';
    let pokemonsList = [];
  
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
                let viewName = ((Object.keys(data.sprites)[i].charAt(0).toUpperCase()+Object.keys(data.sprites)[i].slice(1)).replace(/_/g, ' ')).replace('default','')
                newViewButton.innerHTML = `<button id="${Object.keys(data.sprites)[i]}" class="spriteButton px-4 py-2 text-white hover:bg-blue-600 text-sm sm:text-lg w-full flex justify-start">${viewName}</button>`
                document.getElementById('viewSpriteList').append(newViewButton);
                document.getElementById(Object.keys(data.sprites)[i]).addEventListener('click',()=>{
                    spriteView = Object.keys(data.sprites)[i];
                    document.querySelectorAll('.spriteButton').forEach(element => element.classList.remove('hidden'));
                    document.getElementById(Object.keys(data.sprites)[i]).classList.add('hidden');
                    document.getElementById('pokemonView').innerHTML = `${viewName}<svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/></svg>`;
                    applySpriteFilter();
                })
            }
        } catch (error) {
            console.error('button sprite error:',error);
        }
    }

    buttonsSprites();

    async function buttonsGrowth(){
        try {
            const response = await fetch('https://pokeapi.co/api/v2/growth-rate//');
            const data = await response.json();
            for (let i = 0; i < data.results.length; i++){
                let growthName = (data.results[i].name.charAt(0).toUpperCase()+data.results[i].name.slice(1)).replace(/-/g, ' ');
                const newGrowthButton = document.createElement('li');
                newGrowthButton.innerHTML = `<button id="${data.results[i].name}" class="growthButton px-4 py-2 text-white hover:bg-blue-600 text-sm sm:text-lg w-full flex justify-start">${growthName}</button>`
                document.getElementById('growthList').append(newGrowthButton);
                document.getElementById(data.results[i].name).addEventListener('click',()=>{
                    growthRate = data.results[i].name;
                    document.querySelectorAll('.growthButton').forEach(element => element.classList.remove('hidden'));
                    document.getElementById(data.results[i].name).classList.add('hidden');
                    document.getElementById('pokemonGrowth').innerHTML = `${growthName}<svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/></svg>`;
                    document.getElementById('pokemonsIncrement').value = 5;
                    applyGrowthFilter();
                })
            }
            document.getElementById('growthAll').addEventListener('click',()=>{
                growthRate = 'All';
                document.querySelectorAll('.growthButton').forEach(element => element.classList.remove('hidden'));
                document.getElementById('growthAll').classList.add('hidden');
                document.getElementById('pokemonGrowth').innerHTML = `${growthRate}<svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/></svg>`;
                applyGrowthFilter();
            });
        } catch (error) {
            console.error('button Growth error:',error);
        }
    }

    buttonsGrowth();

    async function filterPokemonsByGrowth(growthRate) {
        try {
            const endpointPokemon = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1302&offset=0');
            const allPokemons = await endpointPokemon.json();
            let allPokemonsList = [];
            for (let i = 0; i < allPokemons.results.length; i++){
                allPokemonsList.push(allPokemons.results[i].name)
            }
            if (growthRate == 'All') {
                pokemonsList = allPokemonsList;
                return pokemonsList;
            }
            const response = await fetch(`https://pokeapi.co/api/v2/growth-rate/${growthRate}/`);
            const data = await response.json();
            const pokemonsWithGrowth = [];
            for (let i = 0; i < data.pokemon_species.length; i++){
                pokemonsWithGrowth.push(data.pokemon_species[i].name)
                
            }
            pokemonsList = [];
            for (let i = 0; i < pokemonsWithGrowth.length; i++){
                if (allPokemonsList.includes(pokemonsWithGrowth[i])){
                    pokemonsList.push(pokemonsWithGrowth[i])
                }
            }
            return pokemonsList;
        }catch (error){
            console.error('filter pokemons error:', error)
        }
    }
    
    async function applySpriteFilter(){
        try{
            if (pokemonsCardsContainer.childNodes.length > 0){
                if (growthRate == "All"){
                    offset = parseInt(pokemonsCardsContainer.firstChild.firstChild.id,10)-1;
                } else {
                    offset = pokemonsList.indexOf(pokemonCard.childNodes[3].childNodes[3].textContent.toLowerCase())-1;
                }
                let actualIncrement = parseInt(increment.value, 10);
                increment.value = pokemonsCardsContainer.childNodes.length;
                pokemonsCardsContainer.innerHTML = "";
                await fetchPokemons(offset);
                increment.value = actualIncrement;
            }
        } catch(error){
            console.error('Apply sprite filter error:', error);
        }
    }

    async function applyGrowthFilter() {
        offset = 0;
        pokemonsCardsContainer.innerHTML = "";
        await fetchPokemons(offset);        
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
            let habitat = 'Unknown';
            try {
                const endpointSpecies = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${name.toLowerCase()}/`); //Retrieve the habitat for the given the pokemon.
                const pokemonSpecieData = await endpointSpecies.json();
                habitat = pokemonSpecieData.habitat ? pokemonSpecieData.habitat.name : 'Unknown';
            } catch(error){
                console.error('Fetch Habitat error:',error);
            }
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
            increment.classList.add('md:hidden');
            introParagraph.classList.add('hidden');
            questionMark.classList.add('md:hidden');
            document.getElementById('pokemonGrowth').classList.add('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error('Error fetching Pokemon:', error);
            alert(`Could not find pokemon " ${name} "`);
        }

    }

    async function fetchPokemons(offsetParam){
        try {
            pokemonsList = await filterPokemonsByGrowth(growthRate);
            pokemonsIncrement = parseInt(increment.value,10);
            if (window.innerWidth <= 640){
                pokemonsIncrement = 5;
            }
            for (let i = offsetParam; i < (offsetParam+pokemonsIncrement); i++){
                const newPokemonCard = document.createElement('button');
                newPokemonCard.addEventListener('click', function(){
                    fetchPokemon(pokemonsList[i]);
                });
                const endpointPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonsList[i]}/`);
                const newPokemon = await endpointPokemon.json();
                newPokemonCard.classList.add("w-[250px]","h-auto","sm:w-[235px]","sm:h-auto","p-0","h-auto","bg-white","rounded-lg","shadow-lg","flex","flex-col","justify-center","items-center","hover:bg-blue-200");
                newPokemonCard.innerHTML = `<img id="${newPokemon.id}" class="h-auto w-[250px] self-center" src="${newPokemon.sprites[spriteView]}" alt="${pokemonsList[i]}" /><div class="flex flex-col p-3 px-5 gap-2 justify-center items-center"><p class="self-center font-bold text-3xl text-blue-900 text-xl">${pokemonsList[i].charAt(0).toUpperCase() + pokemonsList[i].slice(1)}</p></div>`;
                pokemonsCardsContainer.append(newPokemonCard);
            }
            pokemonCard.classList.add('hidden');
            pokemonCard.childNodes[3].childNodes[1].id = "pokemonId";
            pokemonsCardsContainer.classList.remove('hidden')
            loadMorePokemons.classList.remove('hidden');
            continueButton.classList.add('hidden');
            increment.classList.remove('md:hidden');
            increment.classList.add('md:block');
            introParagraph.classList.add('hidden');
            questionMark.classList.add('md:hidden');
            offsetParam += pokemonsIncrement
            offset = offsetParam;
            
        } catch (error) {
            console.error('Error fetching Pokemons:', error);
            alert('Something went wrong');
        }
    }

    inputPokemonName.addEventListener('keydown', function(event){
        if(event.key==="Enter"){
            search(offset);
            inputPokemonName.value = "";
        }
    });

    function validateIncrement(input) {
        if (input >= 1 && input <= 20){
            if (pokemonsList.length-offset == 0){
                alert(`There are no pokemons left`)
                increment.value = pokemonsList.length-offset;
            } else if (input+offset > pokemonsList.length){
                alert(`There are only ${pokemonsList.length-offset} pokemons left`)
                increment.value = pokemonsList.length-offset;
            }
            return true
        }
        alert('Please choose a number between 1 and 20')
        return false;
    }

    inputPokemonName.addEventListener('input',() => {
        const regex = /^[A-Za-z-]*$/; // Regular expression to match only alphabetic characters (both uppercase and lowercase) and hyphens
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

    async function search(){
        pokemonsList = filterPokemonsByGrowth(growthRate);
        if (validateIncrement(parseInt(increment.value, 10))){
            if (inputPokemonName.value == "" || inputPokemonName.value.toLowerCase() == "all"){
                pokemonsCardsContainer.innerHTML = "";
                await fetchPokemons(0);
                return
            } else {
                await fetchPokemon(inputPokemonName.value.toLowerCase()),{trigger: 'hover'}
                growthRate = 'All';
                document.querySelectorAll('.growthButton').forEach(element => element.classList.remove('hidden'));
                document.getElementById('growthAll').classList.add('hidden');
                document.getElementById('pokemonGrowth').innerHTML = `${growthRate}<svg class="w-2.5 h-2.5 ms-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 4 4 4-4"/></svg>`;
                return
            }
        }
    }
    
    searchButton.addEventListener('click', () => {
        search();
    });

    increment.addEventListener('input',() => {
        if (validateIncrement(parseInt(increment.value, 10))){
           increment.classList.remove('bg-red-100','ring-2', 'ring-red-500');
           loadMorePokemons.classList.remove('hover:opacity-[0.6]','cursor-not-allowed');
           loadMorePokemons.disabled = false;
        }
        else{
           increment.classList.add('bg-red-100','ring-2', 'ring-red-500');
           loadMorePokemons.classList.add('hover:opacity-[0.6]','cursor-not-allowed')
           loadMorePokemons.disabled = true;
        }
    });

    function scrollDown() {
        setTimeout(() => {
            window.scrollTo({
                top: document.body.scrollHeight - window.innerHeight + 500,
                behavior: 'smooth'
            });
        }, 500);
    }

    loadMorePokemons.addEventListener('click',()=>{
        if (validateIncrement(parseInt(increment.value, 10))){
            offset = pokemonsList.indexOf(pokemonsCardsContainer.lastChild.lastChild.firstChild.textContent.toLowerCase()) + 1
            fetchPokemons(offset);
        }
    }
    );
    
    continueButton.addEventListener('click', () => {
        inputPokemonName.value = "";
        document.getElementById('pokemonGrowth').classList.remove('hidden')
        if (growthRate == 'All'){
            offset = parseInt(pokemonCard.childNodes[3].childNodes[1].id,10)-1;
        } else {
            offset = pokemonsList.indexOf(pokemonCard.childNodes[3].childNodes[3].textContent.toLowerCase());
        }
        pokemonsCardsContainer.innerHTML = "";
        if (pokemonsIncrement > (pokemonsList.length-offset)){
            pokemonsIncrement = pokemonsList.length-offset
            if (pokemonsIncrement < 5){
                offset = pokemonsList.length-5;
                pokemonsIncrement = 5;
            }
        }
        fetchPokemons(offset);
        scrollDown();
    });

});
