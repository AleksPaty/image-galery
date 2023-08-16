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
const imageLine = document.querySelector('.image-line')
const pictures = document.querySelectorAll('.img-item')
const dots = document.querySelectorAll('.show')
let curentPict = 0;

const removeClassAll = (el, clName) => {
    el.forEach((item) => { if(item.className.includes(`${clName}`)) item.classList.remove(`${clName}`) })
}
const removeClassDelay = (nameClasses) => {
    imageLine.className.includes(nameClasses[0])
        ? imageLine.classList.remove(nameClasses[0])
        : imageLine.classList.remove(nameClasses[1])
}

dots.forEach((d, i) => {
    d.addEventListener('click', () => {
        if(d.className.includes('curent')) return;
        let curentDot = document.querySelector('.curent')

        removeClassAll(pictures, 'onView')
        removeClassAll(dots, 'curent')
        for(let p = i; p < (i+3) && p < pictures.length; p++) {
            pictures[p].classList.add('onView')
        }
        d.classList.add('curent')
        curentPict = i;

        curentDot.parentElement.offsetLeft < d.parentElement.offsetLeft
            ? imageLine.classList.add('move-left')
            : imageLine.classList.add('move-right')

        setTimeout(removeClassDelay, 800, ['move-left', 'move-right'])
    
    })
})

if(document.documentElement.clientWidth < 1020) {
    const arrows = [];
    arrows.push(document.querySelector('.carousel-left'))
    arrows.push(document.querySelector('.carousel-right'))

    arrows.forEach((arrow, index) => {
        arrow.addEventListener('click', () => {
            if(index == 0 && curentPict > 0) {
                curentPict--;
                imageLine.classList.add('move-right')
            }
            if(index == 1 && curentPict < pictures.length-1) {
                curentPict++;
                imageLine.classList.add('move-left')
            }
            removeClassAll(pictures, 'onView')
            for(let p = curentPict; p < pictures.length; p++) {
                pictures[p].classList.add('onView')
            }

            removeClassAll(dots, 'curent')
            dots[curentPict].classList.add('curent')
            setTimeout(removeClassDelay, 900, ['move-left', 'move-right'])
        })
    })
}
