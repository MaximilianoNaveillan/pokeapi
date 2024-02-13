// Seleccionar elementos del DOM
const pokemonContainer = document.getElementById('pokemon-container');
const pokemonImage = document.getElementById('pokemon-image');
const captureButton = document.getElementById('capture-button');
const pokemonList = document.getElementById('pokemon-list');
const pokemonNameElement = document.getElementById('pokemon-name');
const main = document.getElementById('main');


let pokemonCapturados = [];

// Variable global para almacenar el último Pokémon aleatorio
let ultimoPokemonAleatorio = {};

// Función para obtener un Pokémon aleatorio de la PokeAPI
function obtenerPokemonAleatorio() {
    const pokemonId = Math.floor(Math.random() * 898) + 1; // Números entre 1 y 898
    const apiUrl = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;

    // Realizar solicitud a la API y convertir la respuesta a formato JSON
    return fetch(apiUrl)
        .then(response => response.json())
        .catch(error => {
            console.error('Error al obtener el Pokémon', error);
        });
}

// Función llamada al hacer clic en el botón de captura
function capturarPokemon() {
    main.className = "capture"; // Aplicar temporalmente una clase para efecto visual
    setTimeout(() => {
        esCapturarPokemon(); // Después de 1 segundo, realizar la captura de Pokémon
    }, 1000);
}

// Función que realiza la lógica de captura de Pokémon
function esCapturarPokemon() {
    main.className = ""; // Restablecer la clase del elemento principal

    const capturaExitosa = Math.random() < 0.5; // Simular éxito de captura

    if (capturaExitosa) {
        captureButton.textContent = "¡Capturar!"; // Actualizar texto del botón
        if (ultimoPokemonAleatorio) {
            guardarPokemonCapturado(ultimoPokemonAleatorio); // Guardar Pokémon capturado
            obtenerListaPokemonCapturados(); // Actualizar lista de Pokémon capturados
        }
        // Obtener un nuevo Pokémon aleatorio y actualizar la pantalla
        obtenerPokemonAleatorio().then(data => {
            ultimoPokemonAleatorio = data;
            actualizarPokemonEnPantalla(data);
        });
    } else {
        captureButton.textContent = 'El Pokémon escapó. Intenta de nuevo.'; // Actualizar texto del botón
    }
}

// Función para limpiar la lista de Pokémon capturados
function clearPokemon() {
    pokemonCapturados = []
    localStorage.removeItem('pokemonCapturados')
    obtenerListaPokemonCapturados(); // Actualizar la lista de Pokémon capturados
}

// Función para guardar un Pokémon capturado en el almacenamiento local
// operador terciario ===> ! [undefined o null o 0 NaN ] ? bloque cumple : bloque no cumple
// Operador lógicol ===> if(tal || tal ) ==> if (tal && tal) ==>
// Operador de función null ==> evalua solo valor null ==> !null cumple ejecuta cumple || no cumple

function guardarPokemonCapturado(pokemonData) {

    const {name,sprites} = pokemonData;

    pokemonCapturados = JSON.parse(localStorage.getItem('pokemonCapturados')) || []
    pokemonCapturados.push({name,sprites});
    localStorage.setItem('pokemonCapturados',JSON.stringify(pokemonCapturados))
}

// Función para obtener y mostrar la lista de Pokémon capturados
function obtenerListaPokemonCapturados() {
    pokemonList.innerHTML = ''; // Limpiar contenido actual de la lista

    pokemonCapturados = JSON.parse(localStorage.getItem('pokemonCapturados')) || [];

    
    // Para cada Pokémon capturado, crear un elemento de lista con nombre e imagen
    pokemonCapturados.forEach(pokemonData => {
        const {name, sprites} = pokemonData;
        console.log(pokemonData);
        pokemonList.innerHTML += `<li class='pokemon-item'><span>${name}</span>
        <img src='${sprites.front_default}' alt='${name}'></img>
        </li>`;
    });
}

// Función para actualizar la pantalla con los datos del Pokémon actual
function actualizarPokemonEnPantalla(pokemonData) {
    pokemonImage.src = pokemonData.sprites.front_default;
    pokemonImage.alt = pokemonData.name;
    pokemonNameElement.textContent = pokemonData.name;
}

// Obtener un Pokémon aleatorio inicial y mostrar su información en la pantalla
obtenerPokemonAleatorio().then(data => {
    ultimoPokemonAleatorio = data;
    actualizarPokemonEnPantalla(data);
});

// Mostrar la lista inicial de Pokémon capturados almacenados en el almacenamiento local
obtenerListaPokemonCapturados();