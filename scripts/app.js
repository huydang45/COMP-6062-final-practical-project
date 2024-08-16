//Create a new Vue app
const proxyUrl = 'https://api.allorigins.win/get?url=';
const apiFact = 'https://uselessfacts.jsph.pl/api/v2/facts/random';
const apiWeather = 'https://weather-data.liamstewart.ca/?city=';
const apiDictionary = 'https://api.dictionaryapi.dev/api/v2/entries/en/';

const app = Vue.createApp({
    data() {
        return {
            fact: "Loading",
            curWeather: { temp: "Loading", wind: "Loading", des: "Loading" },
            city: "London, Ontario",
            word: "Bottle",
            meaning: "Loading"
        };
    },

    computed: {

    },
    created() {
        this.fetchFact();
        this.fetchWeather(); // Fetch weather for the initial city
        this.fetchWord();
    },
    methods: {
        fetchFact() {
            fetch(apiFact)
                .then(response => response.json())
                .then(data => {
                    this.fact = data.text;
                })
                .catch(error => {
                    console.error('Error: ', error)
                })
        },
        fetchWeather() {
            const url = proxyUrl + encodeURIComponent(apiWeather + this.city);
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const result = JSON.parse(data.contents);
                    //console.log(result);
                    this.curWeather = {
                        temp: result.temperature || "N/A",
                        wind: result.wind_speed || "N/A",
                        des: result.description || "N/A"
                    };
                })
                .catch(error => console.error('Error:', error));
        },
        fetchWord() {
            const url = apiDictionary + this.word;
    fetch(url)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Word not found.');
                } else {
                    throw new Error('Failed to fetch the definition. Please try again later.');
                }
            }
            return response.json();
        })
        .then(data => {
            this.meaning = `<p><strong>Word:</strong> ${data[0].word}
                            <br><strong>Phonetic:</strong> ${data[0].phonetic || 'N/A'}
                            <br><strong>Part of Speech:</strong>: ${data[0].meanings[0].partOfSpeech}
                            <br><strong>Definition:</strong> ${data[0].meanings[0].definitions[0].definition}`;
         })
        .catch(error => {
            console.error('Error:', error);
            this.meaning = error.message;
        });
        }
    }

});
// Mount the app to the #myapp element
app.mount('#myapp');