// --------------------------- profile drop menu in header -----------------------------// 
const dropMenu = document.querySelector('.profile-dropMenu')
const profileIcon = document.querySelector('.profile img')

profileIcon.addEventListener('click', () => {
    dropMenu.classList.toggle('active')
})

// --------------------------- burger menu in header -----------------------------// 
const brgBtn = document.querySelector('.menu-btn')
const bodyElem = document.querySelector('main')
const closeMenu = () => brgBtn.classList.remove('show-menu');

brgBtn.addEventListener('click', (e) => {
    e.preventDefault()
    brgBtn.classList.toggle('show-menu')

    brgBtn.className.includes('show-menu')
        ? bodyElem.addEventListener('click', closeMenu)
        : bodyElem.removeEventListener('click', closeMenu)
})

// --------------------------- for slider -------------------------------//
const carousel = document.querySelector('.carousel')
const pictures = document.querySelectorAll('.img-item')
const dots = document.querySelectorAll('.show')
const removeClassAll = (el, clName) => {
    el.forEach((item) => { if(item.className.includes(`${clName}`)) item.classList.remove(`${clName}`) })
}
console.log(dots.length)
dots.forEach((d, i) => {
    d.addEventListener('click', () => {
        removeClassAll(pictures, 'onView')
        removeClassAll(dots, 'curent')
        for(let p = i; p < (i+3) && p < pictures.length; p++) {
            pictures[p].classList.add('onView')
        }
        d.classList.add('curent')
    })
})