//Create a new Vue app
const app = Vue.createApp({
    data() {
        return{
            fact: 'test',
            curWeather: 'test',
            word: 'test',
        };
    },

    computed: {

    },
    methods: {

    }

});
// Mount the app to the #myapp element
app.mount('#myapp');