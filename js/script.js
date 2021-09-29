apiKey = 'e887dacdf0abc809861fbbfcec05c772'; // OpenWeatherMap API Key

main = document.getElementById('main');
error = document.getElementById('error');

displayTime = document.getElementById('time');
displayDate = document.getElementById('date');
displayTemperature = document.getElementById('temperature');
displayTemperatureUnit = document.getElementById('temperature-unit');
displayWeatherIcon = document.getElementById('weather-icon');
displayWeatherText = document.getElementById('weather-text');
locationInput = document.getElementById('location');

temperatureUnit = 'C';

function setTimeDate() {
	date = new Date();
	weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	displayTime.innerHTML = String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
	displayDate.innerHTML = weekdays[date.getDay()] + ' ' + date.getDate() + ' ' + months[date.getMonth()];
}
setTimeDate();
setInterval(setTimeDate, 1000);

if (navigator.geolocation) {
	navigator.geolocation.getCurrentPosition(getLocation);
}

function getLocation(object) {
	latitude = object['coords']['latitude'];
	longitude = object['coords']['longitude'];

	request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			locationInput.value = JSON.parse(this.responseText)[0]['name'];
			checkWeather();
		}
	};
	request.open('GET', 'https://api.openweathermap.org/geo/1.0/reverse?lat=' + latitude + '&lon=' + longitude + '&limit=1&appid=' + apiKey);
	request.send();
}

function checkWeather() {
	request = new XMLHttpRequest();
	request.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status == 200) {
				response = JSON.parse(this.responseText);

				if (temperatureUnit == 'F') {
					temperature = Math.round((response['main']['temp'] * 9/5) + 32);
				}
				else {
					temperature = Math.round(response['main']['temp']);
				}

				displayTemperature.innerHTML = temperature;

				if (response['weather'][0]['main'] == 'Thunderstorm') {
					icon = 'bolt';
				}
				else if (response['weather'][0]['main'] == 'Drizzle') {
					icon = 'cloud-rain';
				}
				else if (response['weather'][0]['main'] == 'Rain') {
					icon = 'cloud-showers-heavy';
				}
				else if (response['weather'][0]['main'] == 'Snow') {
					icon = 'snowflake';
				}
				else if (response['weather'][0]['main'] == 'Clear') {
					icon = 'sun';
				}
				else if (response['weather'][0]['main'] == 'Clouds') {
					icon = 'cloud';
				}
				else {
					icon = 'smog';
				}

				displayWeatherIcon.classList.value = 'fas fa-' + icon;

				displayWeatherText.innerHTML = response['weather'][0]['main'];

				error.classList.value = 'd-none';
				main.classList.value = 'row text-center';
			}
			else {
				main.classList.value = 'd-none';
				error.classList.value = 'alert alert-danger';
				error.innerHTML = 'Something went wrong. It\'s likely the location you entered couldn\'t be found!';
			}
		}
	};
	request.open('GET', 'https://api.openweathermap.org/data/2.5/weather?q=' + locationInput.value + '&units=metric&appid=' + apiKey);
	request.send();
}

function changeTemperatureUnit(unit) {
	temperatureUnit = unit;
	displayTemperatureUnit.innerHTML = unit;
	checkWeather();
}
