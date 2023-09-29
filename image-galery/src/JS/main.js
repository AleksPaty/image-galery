import {req} from "./postService.js";
let isLoaded = false;

const getImageElems = async (puth) => {
    let data = await req(puth)

    let imgList = data.results ? data.results : data
    return imgList.map((img) => {
        let wrapperElem = document.createElement("div")
        let imgElem = document.createElement("img")
        imgElem.src = img.urls.small;
        imgElem.alt = img.alt_description;
        imgElem.dataset.mod = img.urls.regular;

        wrapperElem.className = 'img-wrapper';
        imgElem.className = 'img-item';
        wrapperElem.append(imgElem)
        return wrapperElem
    })
}

const renderImages = async (puth) => {
    let images = await getImageElems(puth)
    if(!images.length) {
        isLoaded = false;
        return
    }
    
    images.forEach((img) => {
        let timeoutId = setTimeout(() => {
            let curColumn;
            let columHeight;
            
            document.querySelectorAll(".column").forEach((col, i) => {
                if(i === 0) {
                    curColumn = col;
                    columHeight = col.offsetHeight;
                } else if(columHeight > col.offsetHeight) {
                    columHeight = col.offsetHeight;
                    curColumn = col
                }
            })
            curColumn.append(img)
            clearTimeout(timeoutId)
        }, 1000)
        // clearTimeout(timeoutId)
        isLoaded = true
        checkLoad()
    })
}

const checkLoad = () => {
    let loadWrap = document.querySelector(".load-field")
    let loadIcon = document.querySelector(".load-icon")
    if (!isLoaded) {
        loadWrap.classList.add('loading')

        loadIcon.classList.add("active")

    } else {
        loadIcon.classList.remove("active")
        loadWrap.classList.remove('loading')
    }
}

const openModalImg = (e) => {
    if (e.target.src) {
        let modalWrap = document.querySelector(".modal-wrapper")
        let modalCont = document.querySelector(".modal-img")
        let curentImg = document.createElement("img")

        modalWrap.classList.add("open")
        curentImg.src = e.target.dataset.mod;
        curentImg.alt = e.target.alt + '_m';
        modalCont.append(curentImg)
    }
}

const findForm = document.querySelector(".search-form")
const crossBtn = document.querySelector(".search-cross")
const getSearchImg = async(e) => {
    e.preventDefault()
    let searchWord = e.target.firstElementChild.value;

    document.querySelectorAll(".column").forEach((col) => {
        col.innerHTML = null
    })
    isLoaded = false;
    checkLoad()
    renderImages(`https://api.unsplash.com/search/photos?query=${searchWord}&per_page=20&client_id=vmgHfoNoz7EggApuiQzTKFpDG2Et06ANC7MjjlhXHL0`)
}

const cleanFindRequest = (e) => {
    findForm.querySelector(".search-img").value = ""
}

findForm.addEventListener('submit', getSearchImg)
crossBtn.addEventListener('click', cleanFindRequest)

document.querySelectorAll(".column").forEach((col) => {
    col.addEventListener('click', openModalImg)
})
document.querySelector(".modal-wrapper").onclick = (e) => {
    if(e.target === e.currentTarget) {
        document.querySelector(".modal-img").lastChild.remove()
        e.target.classList.remove("open")
    }
}

checkLoad()
renderImages("https://api.unsplash.com/photos/random?extras=url_s&count=20&client_id=vmgHfoNoz7EggApuiQzTKFpDG2Et06ANC7MjjlhXHL0")
