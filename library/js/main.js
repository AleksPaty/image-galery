// --------------------------- usersStorage ---------------------------------// 
let isAuthorized = false;
let currentUser;

if(!localStorage.getItem('users')) { localStorage.setItem('users', JSON.stringify([])) }
if(localStorage.getItem('authorizedUser')) { 
    isAuthorized = true; 
    currentUser = JSON.parse(localStorage.getItem('authorizedUser'))
}
console.log(currentUser)
// --------------------------- profile ---------------------------------// 
let dropMenu = document.querySelector('.profile-dropMenu.notAuth')
const bodyElem = document.querySelector('main')
const profileIcon = document.querySelector('.icon_profile')
const loginBtns = [document.getElementById('login-btn'), document.getElementById('login-btn2')]
const registrBtns = [document.getElementById('registr-btn'), document.getElementById('registr-btn2')]
const closeModalBtns = [
    document.querySelector('.register-form_btn-close'), document.querySelector('.login-form_btn-close'),
    document.querySelector('.profile-form_btn-close'), document.querySelector('.buy-card_btn-close')
]
const profileOpenBtns = [document.getElementById('profile-btn'), document.getElementById('profile-btn2')]
const logOutBtn = document.getElementById('logOut-btn')
const registrForm = document.querySelector('.register-form_body form')
const loginForm = document.querySelector('.login-form_body form')
const profileForm = document.querySelector('.profile-form')
const buyCardModal = document.querySelector('.buy-card')
const buyCardForm = document.querySelector('.buy-card_form')
// ----------------------- functions -----------------------------// 
const openModalWind = (modal) => {
    let darkWrap = document.querySelector('.modal-space')
    darkWrap.classList.add('open')
    modal.classList.add('open')

    if(modal.querySelector('a')) {
        modal.querySelector('a').onclick = (e) => {
            e.preventDefault()
            let modalForOpening = modal.className.includes('register') 
                ? document.querySelector('.login-form') 
                : document.querySelector('.register-form')
            closeModalWind(modal)
            openModalWind(modalForOpening)
        }
    }
    darkWrap.onclick = (e) => {
        if(e.target === e.currentTarget) closeModalWind(modal)
    }
}
const closeModalWind = (modal) => {
    let darkWrap = document.querySelector('.modal-space')
    darkWrap.onclick = null
    if(modal.querySelector('a')) modal.querySelector('a').onclick = null
    darkWrap.classList.remove('open')
    modal.classList.remove('open')
}
const generateCardNumber = () => {
    let arrKeys = ['0', '1', '2', '3', '4', '5', 'A', 'B', 'C', '6', '7', '8', '9', 'D', 'E', 'F', '0']
    let cardNumber = '';
    let i = 0;
    while(i < 9) {
        let randomKey = Math.floor(Math.random()*100 / 6);
        cardNumber += arrKeys[randomKey]
        i++
    }
    return cardNumber
}
const registrating = (form) => {
    const inputList = form.querySelectorAll('input')
    const usersArr = JSON.parse(localStorage.users)
    const currentUserObj = {};
    for(let input of inputList) {
        currentUserObj[input.name] = input.value;
        input.value = ''
    }
    currentUserObj.cardNumber = generateCardNumber()
    currentUserObj.cardByed = false;
    currentUserObj.visits = 1;
    currentUserObj.books = []
    usersArr.push(currentUserObj)
    console.log(usersArr)
    console.log(JSON.stringify(currentUserObj))
    localStorage.setItem('users', JSON.stringify(usersArr))
    localStorage.setItem('authorizedUser', JSON.stringify(currentUserObj))
    location.reload()
}
// localStorage.removeItem('users')
// localStorage.removeItem('authorizedUser')
const changeIconFrofile = () => {
    let userProfileElem = document.createElement('div')
    let userFirstName = currentUser.firstName;
    let userLastName = currentUser.lastName;
    let initials = `${userFirstName[0]}${userLastName[0]}`.toUpperCase()

    userProfileElem.innerText = initials;
    userProfileElem.classList.add('icon_user-profile')
    userProfileElem.setAttribute('title', `${userFirstName} ${userLastName}`)
    profileIcon.removeChild(document.querySelector('.icon_profile img'))
    profileIcon.append(userProfileElem)
    return [initials, userFirstName, userLastName]
}
const validation = (form) => {
    let usersArr = JSON.parse(localStorage.getItem('users'))
    let inputList = form.querySelectorAll('input')

    let currentUserArr = usersArr.filter((user) => {
        if(inputList[0].value.includes('@')) {
           if(inputList[0].value === user.email && inputList[1].value === user.password) {
            user.visits += 1
            return true
           }
        } else {
           if(inputList[0].value.toUpperCase() === user.cardNumber && inputList[1].value === user.password) {
            user.visits += 1
            return true
           }
        }
    })
    localStorage.setItem('users', JSON.stringify(usersArr))
    return currentUserArr
}
const enterInProfile = (form) => {
    let currentUserArr = validation(form)
    if(currentUserArr.length > 0) {
        localStorage.setItem('authorizedUser', JSON.stringify(currentUserArr[0]))
        location.reload()
    } else {
        alert('Entered data are wrong!')
    }
}
const doLogOut = () => {
    localStorage.removeItem('authorizedUser')
    location.reload()
}
// ----------------------- end functions -----------------------------// 
console.dir(localStorage)
if(isAuthorized) {
    dropMenu.classList.add('hide')
    dropMenu = document.querySelector('.profile-dropMenu.Auth')
    dropMenu.classList.remove('hide')
    dropMenu.children[0].children[0].innerHTML = `${JSON.parse(localStorage.authorizedUser).cardNumber}`
    
    let [initials, firstName, lastName] = changeIconFrofile()
    profileForm.querySelector('.user-avatar').innerText = `${initials}`
    profileForm.querySelector('.user-name').innerText = `${firstName} ${lastName}`
    profileForm.querySelector('.profile-form_footer_card').innerText = `${currentUser.cardNumber}`
    takeUserData(profileForm, currentUser)

    let ownBooksList = profileForm.querySelector('.rented-books_list')
    if(currentUser.books.length) {
        if(ownBooksList.innerText.includes('Empty')) ownBooksList.innerText = '';
        for(book of currentUser.books) {
            let liItem = document.createElement('li')
            liItem.innerText = `${book.bookName.toLowerCase()}, ${book.bookAuthor}`
            liItem.classList.add('rented-books_name')
            ownBooksList.prepend(liItem)
        }
    }
}
if(isAuthorized) { 
    logOutBtn.addEventListener('click', doLogOut)
}

profileIcon.addEventListener('click', () => {
    dropMenu.classList.toggle('active')
    document.querySelector('.menu-btn').classList.remove('show-menu');  // if open burger menu, it will close
    dropMenu.className.includes('active') 
        ? bodyElem.onclick = () => dropMenu.classList.remove('active')
        : bodyElem.onclick = null
})
profileIcon.addEventListener('mousedown', (e) => e.target.style.backgroundColor = '#b7b7b7')
profileIcon.addEventListener('mouseup', (e) => e.target.style.backgroundColor = '')

registrBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault()
        openModalWind(document.querySelector('.register-form'))
        dropMenu.classList.remove('active')
    })
})
loginBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault()
        openModalWind(document.querySelector('.login-form'))
        dropMenu.classList.remove('active')
    })
})
profileOpenBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
        e.preventDefault()
        openModalWind(document.querySelector('.profile-form'))
        document.querySelector('.profile-dropMenu.Auth').classList.remove('active')
    })
})
document.querySelector('.profile-form_copy-btn').onclick = () => {
    let copyText = document.querySelector('.profile-form_footer_card').innerText;
    navigator.clipboard.writeText(copyText)
}

closeModalBtns.forEach((btn) => {
    if(btn.className.includes('register')) {
        btn.addEventListener('click', () => closeModalWind(document.querySelector('.register-form')))
    } else if(btn.className.includes('login')) {
        btn.addEventListener('click', () => closeModalWind(document.querySelector('.login-form')))
    } else if(btn.className.includes('profile')) {
        btn.addEventListener('click', () => closeModalWind(document.querySelector('.profile-form')))
    } else {
        btn.addEventListener('click', () => closeModalWind(document.querySelector('.buy-card')))
    }
})

registrForm.addEventListener('submit', (e) => {
    e.preventDefault()
    registrating(registrForm)
})
loginForm.addEventListener('submit', (e) => {
    e.preventDefault()
    enterInProfile(loginForm)
})

const buingCard = (e) => {
    e.preventDefault()
    currentUser.cardByed = true
    let users = JSON.parse(localStorage.getItem('users'))
    for(let user of users) {
        if(currentUser.email === user.email) {
            user.cardByed = currentUser.cardByed
        }
    }
    localStorage.setItem('authorizedUser', JSON.stringify(currentUser))
    localStorage.setItem('users', JSON.stringify(users))
    closeModalWind(buyCardModal)
    location.reload()
}
buyCardForm.addEventListener('submit', buingCard)

// --------------------------- burger menu in header -----------------------------// 
const brgBtn = document.querySelector('.menu-btn')
const menu = document.querySelector('.nav-list')
const closeMenu = () => brgBtn.classList.remove('show-menu');

brgBtn.addEventListener('click', (e) => {
    e.preventDefault()
    brgBtn.classList.toggle('show-menu')
    if(dropMenu.className.includes('active')) dropMenu.classList.remove('active')

    brgBtn.className.includes('show-menu')
        ? bodyElem.addEventListener('click', closeMenu)
        : bodyElem.removeEventListener('click', closeMenu)
})
menu.addEventListener('click', (e) => {
    if(document.documentElement.clientWidth < 1024 && e.target != e.currentTarget) {
        closeMenu()
    } else { return }
})

// --------------------------- for slider -------------------------------//
const imageLine = document.querySelector('.image-line')
const viewFild = document.querySelector('.view-fild')
const pictures = document.querySelectorAll('.img-item')
const dots = document.querySelectorAll('.pagination-dot')
const arrowLeft = document.querySelector('.carousel-left')
const arrowRight = document.querySelector('.carousel-right')
let curentPict = 0;

const desctopMoveSlide = (dot, i) => {
    if(dot.children[0].className.includes('curent')) return;

    let curentDot = document.querySelector('.curent')
    const imageWidth = pictures[0].offsetWidth;
    const widthAllimages = pictures.length * imageWidth;
    const spaceBetween = (imageLine.offsetWidth - widthAllimages) / 4;

    imageLine.style.transform = `translateX(-${(imageWidth + spaceBetween) * i}px)`
    curentDot.classList.remove('curent')
    dot.children[0].classList.add('curent')
    curentPict = i;
}
const tabletMoveSlide = (direction, cur) => {
    dots[cur].children[0].classList.remove('curent')
    if(direction === 'left' && cur > 0 ) {
        cur--;
    } else if(direction === 'right') {
        if(cur < pictures.length - 1) cur++;
    }
    imageLine.style.transform = `translateX(-${460 * cur}px)`
    curentPict = cur
    dots[cur].children[0].classList.add('curent')
}

if(document.documentElement.clientWidth > 984) {
    dots.forEach((d, i) => {
        d.onclick = () => desctopMoveSlide(d, i)
    })
} else {
    arrowLeft.onclick = () => tabletMoveSlide('left', curentPict) 
    arrowRight.onclick = () => tabletMoveSlide('right', curentPict)
}

window.addEventListener('resize', () => {
    imageLine.style.transform = `translateX(-${pictures[curentPict].offsetLeft}px)`
    
    setTimeout(() => {
        if(document.documentElement.clientWidth > 984) {
            if(curentPict > 2) {
                curentPict = 2;
                desctopMoveSlide(dots[curentPict], curentPict)
            }
            if(!dots[0].onclick) {
                dots.forEach((d, i) => {
                    d.onclick = () => desctopMoveSlide(d, i)
                })
            }
            if(arrowLeft.onclick) {
                arrowLeft.onclick = null
                arrowRight.onclick = null
            }
        } else {
            if(!arrowLeft.onclick) {
                arrowLeft.onclick = () => tabletMoveSlide('left', curentPict) 
                arrowRight.onclick = () => tabletMoveSlide('right', curentPict)
            }
        }
    }, 400)
})

// --------------------------- end for slider -------------------------------//

// --------------------------- for favorites books -------------------------------//

const booksAll = document.querySelectorAll('.book')
const radioButtons = document.querySelectorAll('input[name=season]')
const chengeBooks = (e, season) => {
    e.target.classList.remove('fade-out')
    e.target.classList.add('hided')
                        
    for(let book of booksAll) {
        if(book.className.includes(season)) {
            book.classList.add('fade-in')
            book.classList.remove('hided')
        }
    }
}
const checkOwnBooks = () => {
    if(currentUser) {
        let userBooks = currentUser.books
        for(let book of booksAll) {
            let bookName = book.querySelector('.book-name').innerText
            for(let userBook of userBooks) {
                if(bookName === userBook.bookName) {
                    book.querySelector('.book-buy').setAttribute('disabled', '')
                    book.querySelector('.book-buy').innerText = 'Own'
                }
            }
        }
    }
}
const addBookOnUser = (e) => {
    let usersArr = JSON.parse(localStorage.getItem('users'))
    let bookName = e.target.offsetParent.querySelector('.book-name').innerText
    let bookAuthor = e.target.offsetParent.querySelector('.book-author').innerText.slice(3)
    let bookObj = {
        bookName,
        bookAuthor
    };

    for(user of usersArr) {
        if(currentUser.email === user.email) {
            user.books.push(bookObj)
            currentUser.books.push(bookObj)
        }
    }
    localStorage.setItem('users', JSON.stringify(usersArr))
    localStorage.setItem('authorizedUser', JSON.stringify(currentUser))
    e.target.setAttribute('disabled', '')
    e.target.innerText = 'Own'
}


if(isAuthorized) {
    checkOwnBooks()
    for(let book of booksAll) {
        if(!currentUser.cardByed) {
            book.querySelector('.book-buy').onclick = () => openModalWind(buyCardModal)
        } else {
            book.querySelector('.book-buy').onclick = event => addBookOnUser(event)
        }
    }
} else {
    for(let book of booksAll) {
        book.querySelector('.book-buy').onclick = () => openModalWind(document.querySelector('.login-form'))
    }
}

for(let radio of radioButtons) {
    radio.addEventListener('change', () => {
        if(radio.checked) {
            let checkedSeason = radio.id;

            for(let book of booksAll) {
                if(book.className.includes('fade-in') || book.className.includes('showed')) {
                    book.classList.remove('showed')
                    book.classList.remove('fade-in')
                    book.classList.add('fade-out')

                    book.onanimationend = (e) => {
                        chengeBooks(e, checkedSeason)
                        checkOwnBooks()
                    }
                } else if(book.className.includes('fade-out')) {   // for more faster persons
                    book.onanimationend = (e) => chengeBooks(e, checkedSeason)
                } else { book.onanimationend = null }
            }
        }
    })
}

// --------------------------- Digital Library Cards -------------------------------//
const libraryForm = document.querySelector('.library-card-form')
const libraryFormBtn = document.querySelector('.library-btn')
const libraryInfo = document.querySelector('.library-card_info')
const readerCard = document.querySelector('.get-card')
const changeViewLibraryElem = (hideElems, showElem) => {
    if(hideElems.length) {
        hideElems.forEach((el) => el.remove('hide'))
    } else {
        hideElems.remove()
    }
    showElem.classList.remove('hide')
}
const checkeUserCard = () => {
    let usersArr = JSON.parse(localStorage.getItem('users'))
    let inputList = libraryForm.querySelectorAll('input')

    let currentUserArr = usersArr.filter((user) => {
        if(inputList[0].value === user.firstName && inputList[1].value === user.cardNumber ||
            inputList[0].value === user.lastName && inputList[1].value === user.cardNumber) {
            return true
        }
    })
    if(currentUserArr.length) return currentUserArr[0]
}
function takeUserData(parentElem, user) {
    let visitValueElem = parentElem.querySelector('.visit-info_value')
    let valueBooksElem = parentElem.querySelector('.books-info_value')

    visitValueElem.innerText = `${user.visits}`
    valueBooksElem.innerText = `${user.books.length}`
}
const toggleUserInfo = () => {
    let inputList = libraryForm.querySelectorAll('input')
    libraryFormBtn.classList.toggle('hide')
    libraryInfo.classList.toggle('hide')

    setTimeout(() => {
        libraryFormBtn.classList.toggle('hide')
        libraryInfo.classList.toggle('hide')
        for(let input of inputList) {
            input.value = ''
        }
    }, 10000)
}

if(isAuthorized) {               // if user authorized
    takeUserData(libraryInfo, currentUser)
    changeViewLibraryElem(libraryFormBtn, libraryInfo)
    let libraryInputs = libraryForm.querySelectorAll('input')
    libraryInputs[0].value = `${currentUser.firstName} ${currentUser.lastName}`
    libraryInputs[1].value = `${currentUser.cardNumber}`

    let [header, bodyText, footerBtn] = readerCard.children
    header.innerText = 'Visit your profile';
    bodyText.innerText = 'With a digital library card you get free access to the Library’s wide array of digital resources including e-books, databases, educational resources, and more.';
    changeViewLibraryElem([footerBtn.children[0], footerBtn.children[1]], footerBtn.children[2])
}

libraryForm.addEventListener('submit', (e) => {
    e.preventDefault()
    let currentUser = checkeUserCard()
    if(currentUser) {
        takeUserData(libraryInfo, currentUser)
        toggleUserInfo()
    }
})


// --------------------------- trash -------------------------------//
// for(let book of booksAll) {
//     book.addEventListener('animationend', (e) => {
//         console.log(ind)
//         if(e.target.className.includes('fade-out')) {
//             e.target.classList.remove('fade-out')
//             e.target.classList.add('hided')

//             if(book.className.includes(radio.id)) book.classList.add('fade-in')
//         }
//         if(e.target.className.includes('fade-in')) {
//             e.target.classList.remove('fade-in')
//             e.target.classList.remove('hided')
//             e.target.classList.add('showed')
//         }
//     })
// }






// dots.forEach((d, i) => {
//     d.addEventListener('click', () => {
//         if(d.className.includes('curent')) return;
//         removeMovementClass(['move-left', 'move-right'])
//         let curentDot = document.querySelector('.curent')
//         console.dir(d)
//         if(curentDot.parentElement.offsetLeft < d.parentElement.offsetLeft) {
//             let curentDotInd = ((document.documentElement.clientWidth / 2) - 13) > curentDot.parentElement.offsetLeft 
//                 ? 0 : 1;
//             if(curentDotInd == 0) {
//                 setTimeout(movePicterSlider, 250, curentDotInd, 'move-left') 
//                 movePicterSlider(curentDotInd, 'move-left')
//             } else { 
//                 movePicterSlider(curentDotInd, 'move-left') 
//             }       
//         } else {
//             let curentDotInd = ((document.documentElement.clientWidth / 2) - 13) > curentDot.parentElement.offsetLeft 
//                 ? 0 : 1;

//             while(curentDotInd >= i) {
//                 movePicterSlider(curentDotInd, 'move-right')
//                 curentDotInd--
//             }
//         }
    
//         removeClassAll(dots, 'curent')
//         d.classList.add('curent')
//         curentPict = i;

//         console.log(d.parentElement.offsetLeft)
//     })
// })

// if(document.documentElement.clientWidth < 1020) {
//     const arrows = [];
//     arrows.push(document.querySelector('.carousel-left'))
//     arrows.push(document.querySelector('.carousel-right'))

//     arrows.forEach((arrow, index) => {
//         arrow.addEventListener('click', () => {
//             if(index == 0 && curentPict > 0) {
//                 curentPict--;
//                 imageLine.classList.add('move-right')
//             }
//             if(index == 1 && curentPict < pictures.length-1) {
//                 curentPict++;
//                 imageLine.classList.add('move-left')
//             }
//             removeClassAll(pictures, 'onView')
//             for(let p = curentPict; p < pictures.length; p++) {
//                 pictures[p].classList.add('onView')
//             }

//             removeClassAll(dots, 'curent')
//             dots[curentPict].classList.add('curent')
//             setTimeout(removeClassDelay, 700, ['move-left', 'move-right'])
//         })
//     })
// }
