const input = document.getElementById("pokemonInput");
const button = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");

function renderPokemon(data) {
  const name = data.name;
  const image =
    data.sprites.front_default ||
    data.sprites.other?.["official-artwork"]?.front_default;
  const types = data.types.map((entry) => entry.type.name).join(", ");
  const height = (data.height / 10).toFixed(1);
  const weight = (data.weight / 10).toFixed(1);
  const id = `#${String(data.id).padStart(3, "0")}`;

  resultDiv.innerHTML = `
    <article class="pokemon-card">
      <div class="pokemon-visual">
        <img src="${image}" alt="${name} artwork" />
      </div>
      <div class="pokemon-info">
        <div class="pokemon-header">
          <h2 class="pokemon-name">${name}</h2>
          <span class="pokemon-id">${id}</span>
        </div>
        <div class="type-row">
          <span class="type-badge">${types}</span>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <span class="stat-label">Height</span>
            <span class="stat-value">${height} m</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Weight</span>
            <span class="stat-value">${weight} kg</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">Type</span>
            <span class="stat-value">${types}</span>
          </div>
        </div>
      </div>
    </article>
  `;
}

function showMessage(message, isError = false) {
  resultDiv.innerHTML = `<div class="result-message" ${isError ? 'style="border-color: rgba(248, 113, 113, 0.5); color: #fecaca;"' : ""}>${message}</div>`;
}

function searchPokemon() {
  const pokemon = input.value.trim();

  if (pokemon === "") {
    showMessage("Please enter a Pokémon name or number.", true);
    return;
  }

  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon.toLowerCase()}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Not found");
      }
      return response.json();
    })
    .then((data) => {
      renderPokemon(data);
    })
    .catch((error) => {
      console.error(error);
      showMessage("Pokémon not found. Try another name or number.", true);
    });
}

button.addEventListener("click", searchPokemon);
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchPokemon();
  }
});

showMessage("Search for a Pokémon to begin your adventure!");
