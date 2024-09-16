// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, set, get, query, orderByChild, equalTo } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1ULtDMZELqEs3K4qqnr4BuCKqvuZQPL4",
  authDomain: "dimaranan-kobe-286e0.firebaseapp.com",
  databaseURL: "https://dimaranan-kobe-286e0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "dimaranan-kobe-286e0",
  storageBucket: "dimaranan-kobe-286e0.appspot.com",
  messagingSenderId: "242254190686",
  appId: "1:242254190686:web:754b03a022447faea3bccf",
  measurementId: "G-MDQ2SR8VVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const analytics = getAnalytics(app);

// Function to submit Pokémon information to Firebase
document.getElementById('pokemonForm').addEventListener('submit', function(event) {
  event.preventDefault(); // Prevent form submission

  // Get values from the form
  const pokemonName = document.getElementById('pokemonName').value;
  const pokedexNumber = document.getElementById('pokedexNumber').value;
  const numberCaught = document.getElementById('numberCaught').value;

  // Create a reference for the new Pokémon information
  const pokemonRef = ref(db, 'pokemonInformation/' + pokedexNumber);

  // Save the Pokémon information
  set(pokemonRef, {
    pokemonName: pokemonName,
    pokedexNumber: pokedexNumber,
    numberCaught: numberCaught,
  }).then(() => {
    alert('Pokémon information added successfully!');
    document.getElementById('pokemonForm').reset(); // Reset the form
  }).catch((error) => {
    console.error('Error adding Pokémon information:', error);
    alert('Failed to add Pokémon information.');
  });
});

// Function to download Firebase Pokémon data as an Excel file
function downloadPokemonData(filteredPokedexNumber = null) {
  let pokemonRef = ref(db, 'pokemonInformation/');

  // If filteredPokedexNumber is provided, filter the data by Pokédex number
  if (filteredPokedexNumber) {
    pokemonRef = query(pokemonRef, orderByChild('pokedexNumber'), equalTo(filteredPokedexNumber));
  }

  // Fetch data from Firebase
  get(pokemonRef).then((snapshot) => {
    if (snapshot.exists()) {
      const data = snapshot.val();

      // Convert Firebase data into an array of objects (rows for Excel)
      const rows = [];
      for (let key in data) {
        rows.push({
          Pokemon_Name: data[key].pokemonName,
          Pokedex_Number: data[key].pokedexNumber,
          Number_Caught: data[key].numberCaught
        });
      }

      // Create a new worksheet
      const ws = XLSX.utils.json_to_sheet(rows);

      // Create a new workbook and append the worksheet
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "PokemonInformation");

      // Generate Excel file and trigger the download
      const fileName = filteredPokedexNumber ? `${filteredPokedexNumber}_pokemon_information.xlsx` : 'pokemon_information.xlsx';
      XLSX.writeFile(wb, fileName);
    } else {
      alert('No data available to download.');
    }
  }).catch((error) => {
    console.error('Error fetching data: ', error.message);
    alert('Failed to download data.');
  });
}

// Event listener for downloading all data
document.getElementById('downloadAllBtn').addEventListener('click', function() {
  downloadPokemonData(); // Download all data
});

// Event listener for downloading data filtered by Pokédex number
document.getElementById('downloadByPokedexNumberBtn').addEventListener('click', function() {
  const pokedexNumber = prompt("Enter the Pokédex number to download data for:");
  if (pokedexNumber) {
    downloadPokemonData(pokedexNumber); // Download data by Pokédex number
  }
});
