const projectBox = document.querySelector('.projects')
const projectOverlay = document.querySelector('.project-overlay')
const projetcIcon = document.querySelector('i')

// Show Projets

projetcIcon.addEventListener('click', () => {
	if (projectOverlay.style.visibility === 'hidden') {
		projectOverlay.style.visibility = 'visible'
		projectOverlay.classList.add('animation')
	} else {
		projectOverlay.style.visibility = 'hidden'
		projectOverlay.classList.remove('animation')
	}
})
