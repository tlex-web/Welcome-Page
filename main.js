// DOM Elements

const greeting = document.getElementById("greeting"),
	name = document.getElementById("name"),
	focus = document.getElementById("focus"),
	body = document.querySelector("#background-image"),
	time = document.querySelector("#time"),
	projectBox = document.querySelector(".projects"),
	projectOverlay = document.querySelector(".project-overlay"),
	projetcIcon = document.querySelector("i");

// Show Projets

projetcIcon.addEventListener("click", () => {
	if (projectOverlay.style.visibility === "hidden") {
		projectOverlay.style.visibility = "visible";
		projectOverlay.classList.add("animation");
	} else {
		projectOverlay.style.visibility = "hidden";
		projectOverlay.classList.remove("animation");
	}
});

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
	let randomImage = Math.floor(Math.random() * 18);

	let today = new Date(),
		hour = today.getHours();

	body.style.backgroundImage = `url(lib/${randomImage}.jpg)`;

	if (randomImage === 9 || randomImage === 18) {
		time.style.color = "#000";
	}

	if (hour > 0 && hour < 6) {
		greeting.textContent = "Good Night";
	} else if (hour > 6 && hour < 12) {
		greeting.textContent = "Good Morning";
	} else if (hour > 12 && hour < 18) {
		greeting.textContent = "Good Afternoon";
	} else if (hour > 18 && hour < 0) {
		greeting.textContent = "Good Evening";
	}
}

// Get Name
function getName() {
	if (localStorage.getItem("name") === null) {
		name.textContent = "[ Enter Name ]";
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
		focus.textContent = "[ Enter Focus ]";
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
