document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.querySelector('input[type="text"]');
    const searchButton = document.getElementById('searchButton');
    const pokemonName = document.getElementById('pokemonName');
    const pokemonWeight = document.getElementById('pokemonWeight');
    const pokemonHabitat = document.getElementById('pokemonHabitat');
    const pokemonAbilities = document.getElementById('pokemonAbilities');
    const pokemonImage = document.querySelector('img');
    const pokemonCard = document.getElementById('pokemonCard');
    
    window.addEventListener('beforeunload', () => {
        document.body.classList.remove('fade-in');
        document.body.classList.add('fade-out');
    });

    searchButton.addEventListener('click', async () => {
        
        const pokemon = inputField.value.toLowerCase();
        if (!pokemon == "") {
            try {
                const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);
                const data = await response.json();

                const name = data.name.charAt(0).toUpperCase() + data.name.slice(1);
                const weight = data.weight / 10; /* Acá lo convierto de hectogramos a kg*/
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

            } catch (error) {
                console.error('Error fetching Pokémon data:', error);
                alert('Pokémon not found or an error occurred.');
            }
        }
        else{
            alert("Please type a Pokemon name")
        }
    });
});
