const dropMenu = document.querySelector('.profile-dropMenu')
const profileIcon = document.querySelector('.profile img')

profileIcon.addEventListener('click', () => {
    dropMenu.classList.toggle('active')
})