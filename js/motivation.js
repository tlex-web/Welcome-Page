const motivation = document.querySelector('#motivation')

const getQuotes = async () => {
	const data = await getData('https://type.fit/api/quotes')

	let num = Math.round(Math.random() * data.length)

	for (let i = 0; i < data.length; ++i) {
		if (i === num) {
			motivation.innerHTML = `"${data[i].text}" - ${data[i].author}`
		}
	}
}

getQuotes()
