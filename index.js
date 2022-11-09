const kelvin = 273;
const apiKey = '56dd843e16c1a7978b1f67dede4a9ebf';
let lat;
let lon;
let temp = document.getElementById('temp');
let loc = document.getElementById('location');
let cloud = document.getElementById('cloud');
let table = document.querySelectorAll('table');
let city = document.getElementById('city');
let state = document.getElementById('state');
let cityErr = document.getElementById('cityValErrorMsg');
let stateErr = document.getElementById('stateValErrorMsg');

const searchData = () => {
	let cityValue = city.value;
	let stateValue = state.value;
	const urlForCityValue = `http://api.openweathermap.org/geo/1.0/direct?q=${cityValue}&limit=5&appid=${apiKey}`;
	if (cityValue == "" || stateValue == "") {
		city.style.borderBottom = '2px solid red';
		state.style.borderBottom = '2px solid red';
		cityErr.innerHTML = 'City name required';
		stateErr.innerHTML = 'State name required';
	} else if (!isNaN(cityValue) || !isNaN(stateValue)) {
		city.style.border = '2px solid red';
		state.style.border = '2px solid red';
		cityErr.innerHTML = 'City value should not a number';
		stateErr.innerHTML = 'State value should not a number';
	} else {
		city.style.border = '1px solid gray';
		state.style.border = '1px solid gray';
		cityErr.innerHTML = '';
		stateErr.innerHTML = '';
		try {
			fetch(urlForCityValue)
				.then((response) => {
					return response.json();
				})
				.then((data) => {
					data.some(element => {
						if (element.name.toUpperCase() === cityValue.toUpperCase() &&
							element.state.toUpperCase() === stateValue.toUpperCase()) {
							city.style.border = '1px solid gray';
							state.style.border = '1px solid gray';
							cityErr.innerHTML = '';
							stateErr.innerHTML = '';
							lat = element.lat;
							lon = element.lon;
							const latLongUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
							fetch(latLongUrl)
								.then((response) => {
									return response.json();
								})
								.then((data) => {
									temp.innerHTML = Math.floor(data.main.temp - kelvin) + '°C';
									loc.innerHTML = cityValue[0].toUpperCase() + cityValue.slice(1) + ', ' + element.state + ', ' + data.sys.country;
									cloud.innerHTML = data.weather[0].description;
									table[0].children[0].children[0].children[1].innerHTML = data.clouds.all + '%';
									table[0].children[0].children[1].children[1].innerHTML = data.main.humidity + '%';
									table[0].children[0].children[2].children[1].innerHTML = data.wind.speed + ' km/h';
									table[0].children[0].children[3].children[1].innerHTML = data.main.pressure + ' hPa';
								})
							return true;
						}
						else {
							city.style.borderBottom = '2px solid red';
							state.style.borderBottom = '2px solid red';
							cityErr.innerHTML = 'Please check city name';
							stateErr.innerHTML = 'Please check state name';
							return false;
						}
					});
				})
		} catch (errorMsg) {
			window.alert(errorMsg.message);
		}
	}
}

const getWeather = () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition((position) => {
			lat = position.coords.latitude;
			lon = position.coords.longitude;
			const urlForLatLong = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` +
				`lon=${lon}&appid=${apiKey}`;
			try {
				fetch(urlForLatLong)
					.then((response) => {
						return response.json();
					})
					.then((data) => {
						temp.innerHTML = Math.floor(data.main.temp - kelvin) + '°C';
						loc.innerHTML = data.name + ', ' + data.sys.country;
						cloud.innerHTML = data.weather[0].description;
						table[0].children[0].children[0].children[1].innerHTML = data.clouds.all + '%';
						table[0].children[0].children[1].children[1].innerHTML = data.main.humidity + '%';
						table[0].children[0].children[2].children[1].innerHTML = data.wind.speed + ' km/h';
						table[0].children[0].children[3].children[1].innerHTML = data.main.pressure + ' hPa';
					})
			} catch (errorMsg) {
				document.body.innerHTML = errorMsg.message;
			}
		})
	} else {
		window.alert('You have to give location permission for getting weather details...');
	}
}

window.addEventListener("load", getWeather());
