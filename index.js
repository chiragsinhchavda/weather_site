let lat;
let lon;
let temp = document.getElementById('temp');
let loc = document.getElementById('location');
let cloud = document.getElementById('cloud');
let table = document.querySelectorAll("table");
let city = document.getElementById('city');
let state = document.getElementById('state');

const searchData = () => {
	let cityVal = city.value;
	let stateVal = state.value;
	const kelvin = 273;
	const apiKey = '56dd843e16c1a7978b1f67dede4a9ebf';
	const baseUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityVal}&limit=5&appid=${apiKey}`;
	fetch(baseUrl)
		.then(async (response) => {
			return await response.json();
		})
		.then(async (data) => {
			console.log("Data :", data);
			data.forEach(async element => {
				if (element.state.toUpperCase().includes(stateVal.toUpperCase())) {
					console.log(stateVal);
					console.log(cityVal);
					console.log(typeof (stateVal));
					console.log(element.state)
					lat = element.lat;
					lon = element.lon;
					const latLongUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` +
						`lon=${lon}&appid=${apiKey}`;
					await fetch(latLongUrl)
						.then(async (response) => {
							return await response.json();
						})
						.then((data) => {
							console.log("Data :", data);
							temp.innerHTML = Math.floor(data.main.temp - kelvin) + '°C';
							loc.innerHTML = cityVal[0].toUpperCase() + cityVal.slice(1) + ', ' + element.state + ', ' + data.sys.country;
							cloud.innerHTML = data.weather[0].description;
							table[0].children[0].children[0].children[1].innerHTML = data.clouds.all + '%';
							table[0].children[0].children[1].children[1].innerHTML = data.main.humidity + '%';
							table[0].children[0].children[2].children[1].innerHTML = data.wind.speed + ' km/h';
							table[0].children[0].children[3].children[1].innerHTML = data.main.pressure + ' hPa';
						})
				}
			});
		})

}

const getWeather = () => {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(async (position) => {
			const kelvin = 273;
			lat = position.coords.latitude;
			lon = position.coords.longitude;
			const apiKey = '56dd843e16c1a7978b1f67dede4a9ebf';
			const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&` +
				`lon=${lon}&appid=${apiKey}`;
			await fetch(url)
				.then(async (response) => {
					return await response.json();
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
		})
	}
}

window.addEventListener("load", getWeather());
