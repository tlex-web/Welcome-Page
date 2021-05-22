const greeting = document.querySelector('#greeting')
const user = document.querySelector('#name')
const body = document.querySelector('#background-image')
const time = document.querySelector('#time')

// Show Time

function showTime() {
	let today = new Date(),
		hour = today.getHours(),
		min = today.getMinutes(),
		sec = today.getSeconds()

	// 24hr Format
	hour = hour % 24

	// Output Time
	time.innerHTML = `${hour}<span>:</span>${addZero(
		min
	)}<span>:</span>${addZero(sec)}`

	setTimeout(showTime, 1000)
}

// Add Zeros

function addZero(n) {
	return (parseInt(n, 10) < 10 ? '0' : '') + n
}

// Set Background and greeting

function setBbGreet() {
	let randomImage = Math.floor(Math.random() * 17)

	let today = new Date(),
		hour = today.getHours()

	body.style.backgroundImage = `url(img/${randomImage}.jpg)`

	if (hour > 0 && hour <= 6) {
		greeting.textContent = 'Good Night'
	} else if (hour > 6 && hour <= 12) {
		greeting.textContent = 'Good Morning'
	} else if (hour > 12 && hour <= 18) {
		greeting.textContent = 'Good Afternoon'
	} else {
		greeting.textContent = 'Good Evening'
	}
}

// Get Name
function getName() {
	if (localStorage.getItem('name') === null) {
		name.textContent = '[ Enter Name ]'
	} else {
		name.textContent = localStorage.getItem('name')
	}
}

// Set Name
function setName(e) {
	if (e.type === 'keypress') {
		// Make sure enter is pressed
		if (e.which == 13 || e.keyCode == 13) {
			localStorage.setItem('name', e.target.innerText)
			name.blur()
		}
	} else {
		localStorage.setItem('name', e.target.innerText)
	}
}
