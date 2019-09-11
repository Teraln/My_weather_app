class UI {
    constructor() {
    }

    //Init stored data (units, last location)

    //********MISC********
    //********MISC********
    //********MISC********

    initLS() {
        //Set the default state of rocker at first load (Celsius)
        let temperatureState = localStorage.getItem('state');
        if (JSON.parse(temperatureState) === null) {

            localStorage.setItem("state", true);
        }

        const LSCity = localStorage.getItem('City');


        //Show data for last city searched on load
        if (LSCity !== null) {
            getUserInput(LSCity);
        }

        this.setState();

        return undefined;
    }

    //Display some elements that are hidden by default
    displayHidden() {
        const drop = document.querySelector('.fa-tint');
        const rocker = document.querySelector('.temperatureUnit');

        drop.classList.remove('hidden');
        rocker.classList.remove('hidden');
    }

    //HTML element insert
    createHtmlElement(type, htmlClass, content) {
        const createdElement = document.createElement(type);

        createdElement.className = htmlClass;

        createdElement.innerHTML = content;

        return createdElement;
    }

    //Calculate current temperature
    calculateTemperature(kelvin) {
        const celsius = Math.round(kelvin - 273.15);
        const fahrenheit = Math.round(1.8 * (kelvin - 273.15) + 32);

        return {
            celsius: celsius,
            fahrenheit: fahrenheit
        }
    }

    // Turns unix into date and optionally adds n days
    dateHandler(unix, daysToAdd) {
        const today = new Date(unix * 1000);
        //Prototype for adding day(s) to today's date
        Date.prototype.addDays = function (days) {
            this.setDate(this.getDate() + parseInt(days));
            return this;
        };
        return today.addDays(daysToAdd);
    }

    //********CURRENT********
    //********CURRENT********
    //********CURRENT********


    //Display name of city
    displayCityName(city, countryCode) {
        let cityName = document.querySelector('.cityName');
        localStorage.setItem('City', city);
        cityName.innerHTML = `${city}, ${countryCode}`;

        return undefined;
    }

    //Display Humidity
    displayHumidity(data) {
        let humidity = document.querySelector('.humidity');

        humidity.innerHTML = `${data}%`;

        return undefined;
    }


    setState() {
        //Apply LS temperature state (C/F)
        let temperatureState = localStorage.getItem('state');
        let switchCheckedAttr = document.querySelector('.rockerPosition');

        if (JSON.parse(temperatureState) === true) {
            switchCheckedAttr.setAttribute('checked', "checked");
        } else if (JSON.parse(temperatureState) === false) {
            switchCheckedAttr.removeAttribute('checked');
        }


        return undefined;
    }

    //Toggle temperature
    toggleTemperature() {
        let temperatureState = localStorage.getItem('state');
        if (JSON.parse(temperatureState) === true) {
            localStorage.setItem('state', false);
        } else if (JSON.parse(temperatureState) === false) {
            localStorage.setItem('state', true)
        }
        this.setState();

        return undefined;
    }

    //Display Temperature
    displayTemperature(data) {
        let temperatureContainer = document.querySelector('.mainTemp');
        let tempUnit = document.querySelector('.tempUnit');


        //Get data from LS
        let celsius = this.calculateTemperature(data).celsius;

        let fahrenheit = this.calculateTemperature(data).fahrenheit;

        let state = JSON.parse(localStorage.getItem('state'));

        //Display temperature unit depending on state in LS

        if (state === true) {
            temperatureContainer.innerHTML = `${celsius}`;
        } else {
            temperatureContainer.innerHTML = `${fahrenheit}`;
        }

        return undefined;
    }

    //Capitalise first letter of each word function
    capitaliseFirstLetter(words) {

        const dataCapitalisedArr = words.split(' ');

        let dataCapitalisedTemp = [];

        for (let i = 0; i < dataCapitalisedArr.length; i++) {
            dataCapitalisedTemp.push(dataCapitalisedArr[i].charAt(0).toUpperCase() + dataCapitalisedArr[i].slice(1))
        }
        return dataCapitalisedTemp.join(' ');
    }


    //Display weather Icon & Description
    displayWeatherDescription(data) {
        //Weather Description - Text
        const weatherDescription = document.querySelector('.weatherDescription');

        weatherDescription.innerHTML = this.capitaliseFirstLetter(data.description);

        //Weather Description - Icon
        const weatherIcon = document.querySelector('.weatherStatusIcon');

        let iconCode = data.icon.split('').splice(0, 2);
        const iconString = iconCode.join('');

        weatherIcon.setAttribute("src", `images/${iconString}.png`);

        return undefined;
    }


    //********FORECAST********
    //********FORECAST********
    //********FORECAST********

    processForecast(data) {
        //dayN contains all the data per day
        const forecastArray = data.list;

        let days = {
            day0: [],
            day1: [],
            day2: [],
            day3: [],
            day4: [],
        };

        const dateDays = [];

        for (let i = 0; i < 5; i++) {
            dateDays.push(this.dateHandler(forecastArray[1].dt, i));
        }

        for (let i = 0; i < forecastArray.length; i++) {
            for (let j = 0; j < 5; j++) {

                if (this.dateHandler(forecastArray[i].dt, 0).getDate() === dateDays[j].getDate()) {
                    days[`day${j}`].push(forecastArray[i]);
                }
            }
        }


        //Get min, max temperature
        function getMinMaxTemperature(dayArray) {

            let minMaxArray = [];

            for (let i = 0; i < dayArray.length; i++) {

                minMaxArray.push(dayArray[i].main.temp);

            }

            const sortedMinMax = minMaxArray.sort((a, b) => a - b);
            const minTemp = sortedMinMax[0];
            const maxTemp = sortedMinMax[sortedMinMax.length - 1];


            return {
                minTemp,
                maxTemp
            }
        }

        //Get "average" weather description
        function getAvgWeatherDescription(dayArray) {

            let icon = [];

            for (let i = 0; i < dayArray.length; i++) {
                icon.push(dayArray[i].weather[0].icon);
            }


            for (let i = 0; i < icon.length; i++) {
                let iconCode = icon[i].split('').splice(0, 2).join('');
                icon[i] = iconCode
            }

            function countStringsInArray(array) {


                return array.sort((a, b) =>
                    array.filter(v => v === a).length
                    - array.filter(v => v === b).length
                ).pop();
            }

            return countStringsInArray(icon)
        }

        //Get Date -> weekday & day
        function getDateForDisplay(dayNDate) {
            const weekDayIndex = dayNDate.getDay();
            const dateNumber = dayNDate.getDate();

            const weekDayArray = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

            const weekDay = weekDayArray[weekDayIndex];

            return {
                weekDay,
                dateNumber
            }
        }

        //Create final objects with data per each day
        const day0object = {
            temperature: getMinMaxTemperature(days.day0),
            icon: getAvgWeatherDescription(days.day0),
            date: getDateForDisplay(dateDays[0])
        };

        const day1object = {
            temperature: getMinMaxTemperature(days.day1),
            icon: getAvgWeatherDescription(days.day1),
            date: getDateForDisplay(dateDays[1])
        };

        const day2object = {
            temperature: getMinMaxTemperature(days.day2),
            icon: getAvgWeatherDescription(days.day2),
            date: getDateForDisplay(dateDays[2])
        };

        const day3object = {
            temperature: getMinMaxTemperature(days.day3),
            icon: getAvgWeatherDescription(days.day3),
            date: getDateForDisplay(dateDays[3])
        };

        const day4object = {
            temperature: getMinMaxTemperature(days.day4),
            icon: getAvgWeatherDescription(days.day4),
            date: getDateForDisplay(dateDays[4])
        };

        //Final Array used for injection
        const forecastList = [day0object, day1object, day2object, day3object, day4object];

        return forecastList
    }


    displayForecast(e) {
        const dataArr = this.processForecast(e);

        //Loop and insert html per day
        for (let i = 0; i < dataArr.length; i++) {
            let dayClass = `.forecast-day-${i}`;
            let currDay = document.querySelector(dayClass);

            //If elements (divs) already exist, remove them
            while (currDay.firstChild) {
                currDay.removeChild(currDay.firstChild)
            }

            //Date
            currDay.appendChild(this.createHtmlElement('div', 'F-date col=12 text-center', `${dataArr[i].date.weekDay} ${dataArr[i].date.dateNumber}`));
            //Icon
            const iconDiv = currDay.appendChild(this.createHtmlElement('div', 'F-icon col-12 text-center', ''));
            const iconImg = iconDiv.appendChild(this.createHtmlElement('img', 'F-icon-img', ''));
            let iconCode = dataArr[i].icon.split('').splice(0, 2);
            const iconString = iconCode.join('');
            iconImg.setAttribute('src', `images/${iconString}.png`);
            //Calculate temps, ready for insertion
            let state = JSON.parse(localStorage.getItem('state'));
            let minTemp, maxTemp;

            if (state) {
                minTemp = this.calculateTemperature(dataArr[i].temperature.minTemp).celsius + '&#176C';
                maxTemp = this.calculateTemperature(dataArr[i].temperature.maxTemp).celsius + '&#176C';
            } else {
                minTemp = this.calculateTemperature(dataArr[i].temperature.minTemp).fahrenheit + '&#176F';
                maxTemp = this.calculateTemperature(dataArr[i].temperature.maxTemp).fahrenheit + '&#176F';
            }
            //Insert temps
            const tempsDiv = currDay.appendChild(this.createHtmlElement('div', 'F-temperatures text-center', ''));
            tempsDiv.appendChild(this.createHtmlElement('span', 'F-max-temp', maxTemp));
            tempsDiv.appendChild(this.createHtmlElement('span', 'F-min-temp', minTemp));
        }

    }

    // ********ERRORS*********

    cityNotFound() {
        //TODO remove current&forecast on a timer and display errorMessage
        const current = document.querySelector('.current-weather-container');
        const forecast = document.querySelector('.forecast-weather-container');
        const error = document.querySelector('.errorMessage');
        const input = document.getElementById('location-input');
        const arr = [current, forecast];

        arr.forEach(function (e) {
            e.classList.add('hidden');
        });
        error.classList.remove('hidden');


        setTimeout(function () {
                arr.forEach(function (e) {
                    e.classList.remove('hidden');
                })

                error.classList.add('hidden')
                input.focus();
            }

            , 1200)
    }
}