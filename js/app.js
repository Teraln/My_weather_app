//Init
const weatherApi = new WeatherApi;
const ui = new UI;
window.onload = ui.initLS();

//Search input
const locationForm = document.getElementById('CityNameForm');



// Search input event listener on keyup with timer
//let myTimer;

//locationForm.addEventListener('keyup', (inputText) => {
//    clearTimeout(myTimer);
//    myTimer = setTimeout(function () {
//        getUserInput(inputText);
//        globalInputTxt = inputText;
//    }, 1000)
//});

// Search form on submit
locationForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const cityName = new FormData(locationForm).get('cityname');

    //Remove text after submit
    locationForm.reset();

    // Unfocus keyboard for mobile
    const locationInput = document.querySelector('.cityInputBox');
    locationInput.blur();

    getUserInput(cityName);
});


function getUserInput(userText) {

    if (userText !== '') {
        //Make call
        weatherApi.getWeather(userText)
            .then(apiData => {
                if (apiData.status === 404) {
                    //Show 'not found'
                    ui.cityNotFound();
                } else {
                    //Display the data (ui.js)
                    ui.displayCityName(apiData.liveWeather.name, apiData.liveWeather.sys.country);
                    ui.displayTemperature(apiData.liveWeather.main.temp);
                    ui.displayWeatherDescription(apiData.liveWeather.weather[0]);
                    ui.displayHumidity(apiData.liveWeather.main.humidity);
                    ui.displayForecast(apiData.forecastWeather);
                    ui.processForecast(apiData.forecastWeather);
                    ui.displayHidden();
                }
            })
    }
}

//Unit toggle
const tempToggler = document.querySelector('.rockerPosition');
tempToggler.addEventListener('click', function () {
    ui.toggleTemperature();
    const currCity = localStorage.getItem('City');
    getUserInput(currCity);
});