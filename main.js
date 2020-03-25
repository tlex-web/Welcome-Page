// DOM Elements

const time = document.getElementById("time"),
	greeting = document.getElementById("greeting"),
	name = document.getElementById("name"),
	focus = document.getElementById("focus");

// Show Time

function showTime() {
	let today = new Date(),
		hour = today.getHours(),
		min = today.getMinutes(),
		sec = today.getSeconds();

	// 24hr Format
	hour = hour % 24;

	// Output Time
	time.innerHTML = `${hour}<span>:</span>${addZero(min)}<span>:</span>${addZero(sec)}`;

	setTimeout(showTime, 1000);
}

// Add Zeros

function addZero(n) {
	return (parseInt(n, 10) < 10 ? "0" : "") + n;
}

// Set Background and greeting

function setBbGreet() {
	let today = new Date(),
		hour = today.getHours();

	switch (hour) {
		case 1:
			document.getElementById("background-image").style.backgroundImage = "url('lib/bandoned-forest-industry-nature-34950.jpg')";
			greeting.textContent = "Good Night";
			break;
		case 2:
			document.getElementById("background-image").style.backgroundImage = "url('lib/agriculture-beautiful-country-countryside-518242.jpg')";
			greeting.textContent = "Good Night";
			break;
		case 3:
			document.getElementById("background-image").style.backgroundImage = "url('lib/beautiful-calm-clouds-cloudy-449416.jpg')";
			greeting.textContent = "Good Night";
			break;
		case 4:
			document.getElementById("background-image").style.backgroundImage = "url('lib/nature-night-field-countryside-36767.jpg')";
			greeting.textContent = "Good Night";
			break;
		case 5:
			document.getElementById("background-image").style.backgroundImage = "url('lib/green-trees-3134681.jpg')";
			greeting.textContent = "Good Morning";
			break;
		case 6:
			document.getElementById("background-image").style.backgroundImage = "url('lib/arizona-asphalt-beautiful-blue-sky-490466.jpg')";
			greeting.textContent = "Good Morning";
			break;
		case 7:
			document.getElementById("background-image").style.backgroundImage = "url('lib/black-and-white-mountain-over-yellow-white-and-blue-sky-46253.jpg')";
			greeting.textContent = "Good Morning";
			break;
		case 8:
			document.getElementById("background-image").style.backgroundImage = "url('lib/dawn-landscape-sky-sunset-2330.jpg')";
			greeting.textContent = "Good Morning";
			break;
		case 9:
			document.getElementById("background-image").style.backgroundImage = "url('lib/daylight-forest-glossy-lake-443446.jpg')";
			greeting.textContent = "Good Morning";
			break;
		case 10:
			document.getElementById("background-image").style.backgroundImage = "url('lib/clouds-country-countryside-daylight-542382.jpg')";
			greeting.textContent = "Good Morning";
			break;
		case 11:
			document.getElementById("background-image").style.backgroundImage = "url('lib/grass-hd-wallpaper-lake-landscape-534164.jpg')";
			greeting.textContent = "Good Morning";
			break;
		case 12:
			document.getElementById("background-image").style.backgroundImage = "url('lib/gray-bridge-and-trees-814499.jpg')";
			greeting.textContent = "Good Morning";
			break;
		case 13:
			document.getElementById("background-image").style.backgroundImage = "url('lib/landscape-nature-wilderness-view-68147.jpg')";
			greeting.textContent = "Good Afternoon";
			break;
		case 14:
			document.getElementById("background-image").style.backgroundImage = "url('lib/conifer-daylight-environment-evergreen-454880.jpg')";
			greeting.textContent = "Good Afternoon";
			break;
		case 15:
			document.getElementById("background-image").style.backgroundImage = "url('lib/beach-dawn-dusk-hd-wallpaper-292442.jpg')";
			greeting.textContent = "Good Afternoon";
			break;
		case 16:
			document.getElementById("background-image").style.backgroundImage = "url('lib/bright-countryside-dawn-daylight-302804.jpg')";
			greeting.textContent = "Good Afternoon";
			break;
		case 17:
			document.getElementById("background-image").style.backgroundImage = "url('lib/river-surrounded-by-trees-1425658.jpg')";
			greeting.textContent = "Good Afternoon";
			break;
		case 18:
			document.getElementById("background-image").style.backgroundImage = "url('lib/road-nature-trees-branches-38537.jpg')";
			greeting.textContent = "Good Afternoon";
			break;
		case 19:
			document.getElementById("background-image").style.backgroundImage = "url('lib/scenic-view-of-trees-961343.jpg')";
			greeting.textContent = "Good Evening";
			break;
		case 20:
			document.getElementById("background-image").style.backgroundImage = "url('lib/birds-flying-over-body-of-water-during-golden-hour-1126384.jpg')";
			greeting.textContent = "Good Evening";
			break;
		case 21:
			document.getElementById("background-image").style.backgroundImage = "url('lib/brown-house-in-between-of-mountains-730981.jpg')";
			greeting.textContent = "Good Evening";
			break;
		case 22:
			document.getElementById("background-image").style.backgroundImage = "url('lib/calm-body-of-water-1363876.jpg')";
			greeting.textContent = "Good Evening";
			break;
		case 23:
			document.getElementById("background-image").style.backgroundImage = "url('lib/clouds-daylight-forest-landscape-592077.jpg')";
			greeting.textContent = "Good Evening";
			break;
		case 24:
			document.getElementById("background-image").style.backgroundImage = "url('lib/red-and-blue-hot-air-balloon-floating-on-air-on-body-of-36487.jpg')";
			greeting.textContent = "Good Night";
			break;
	}
}

// Get Name
function getName() {
	if (localStorage.getItem("name") === null) {
		name.textContent = "[Enter Name]";
	} else {
		name.textContent = localStorage.getItem("name");
	}
}

// Set Name
function setName(e) {
	if (e.type === "keypress") {
		// Make sure enter is pressed
		if (e.which == 13 || e.keyCode == 13) {
			localStorage.setItem("name", e.target.innerText);
			name.blur();
		}
	} else {
		localStorage.setItem("name", e.target.innerText);
	}
}

// Get Focus
function getFocus() {
	if (localStorage.getItem("focus") === null) {
		focus.textContent = "[Enter Focus]";
	} else {
		focus.textContent = localStorage.getItem("focus");
	}
}

// Set Focus
function setFocus(e) {
	if (e.type === "keypress") {
		// Make sure enter is pressed
		if (e.which == 13 || e.keyCode == 13) {
			localStorage.setItem("focus", e.target.innerText);
			focus.blur();
		}
	} else {
		localStorage.setItem("focus", e.target.innerText);
	}
}

name.addEventListener("keypress", setName);
name.addEventListener("blur", setName);
focus.addEventListener("keypress", setFocus);
focus.addEventListener("blur", setFocus);

// Run
showTime();
setBbGreet();
