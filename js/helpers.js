const getData = url => {
	return fetch(url)
		.then(check)
		.then(res => res.json())
		.then(body => body)
		.catch(err => console.log(err))
}

const check = res => {
	if (res.ok && res.status === 200) {
		return res
	} else {
		throw new Error()
	}
}
