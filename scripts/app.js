//Create a new Vue app
const proxyUrl = 'https://api.allorigins.win/get?url='; // Proxy URL for CORS which I have trouble to fetch weather API
const apiFact = 'https://uselessfacts.jsph.pl/api/v2/facts/random';
const apiWeather = 'https://weather-data.liamstewart.ca/?city=';
const apiDictionary = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

const app = Vue.createApp({
    data() {
        return {
            // Initial state data
            fact: "Loading",
            curWeather: { temp: "Loading", wind: "Loading", des: "Loading" },
            city: "London, Ontario",
            word: "Bottle",
            meaning: "Loading"
        };
    },

    created() {
        this.fetchFact();   // Fetch initial random fact
        this.fetchWeather(); // Fetch weather for the initial city
        this.fetchWord();   // Fetch initial word definition
    },
    methods: {
        // Method to fetch a new random fact
        fetchFact() {
            fetch(apiFact)
                .then(response => response.json())
                .then(data => {
                    this.fact = data.text; // Update fact with fetched data
                })
                .catch(error => {
                    console.error('Error: ', error) // Log errors
                })
        },
        // Method to fetch current weather data
        fetchWeather() {
            const url = proxyUrl + encodeURIComponent(apiWeather + this.city); // Construct URL with city name
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const result = JSON.parse(data.contents); // Parse JSON data
                    // Update data to curWeather 
                    this.curWeather = {
                        temp: result.temperature || "N/A",
                        wind: result.wind_speed || "N/A",
                        des: result.description || "N/A"
                    };
                })
                .catch(error => console.error('Error:', error));
        },
        // Method to fetch word definition
        fetchWord() {
            const url = apiDictionary + this.word;
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        // Handle errors
                        if (response.status === 404) {
                            throw new Error('Word not found.');
                        } else {
                            throw new Error('Failed to fetch the definition. Please try again later.');
                        }
                    }
                    return response.json();
                })
                .then(data => {
                    // Update meaning with fetched data
                    this.meaning = `<p><strong>Word:</strong> ${data[0].word}
                            <br><strong>Phonetic:</strong> ${data[0].phonetic || 'N/A'}
                            <br><strong>Part of Speech:</strong> ${data[0].meanings[0].partOfSpeech}
                            <br><strong>Definition:</strong> ${data[0].meanings[0].definitions[0].definition}`;
                })
                .catch(error => {
                    console.error('Error:', error);
                    this.meaning = error.message; // Display error message
                });
        }
    }

});
// Mount the app to the #myapp element
app.mount('#myapp');