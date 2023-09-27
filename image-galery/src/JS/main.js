import {req} from "./postService.js";
let isLoaded = false;

const getImageElems = async () => {
    let data = await req("https://api.unsplash.com/photos/random?extras=url_s&count=20&client_id=vmgHfoNoz7EggApuiQzTKFpDG2Et06ANC7MjjlhXHL0")
    console.log(data)
    return data.map((img) => {
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

const renderImages = async () => {
    let images = await getImageElems()
    console.log(images)
    images.forEach((img) => {
        let curColumn;
        let columHeight;

        document.querySelectorAll(".column").forEach((col, i) => {
            console.log(columHeight, col.offsetHeight)
            if(i === 0) {
                curColumn = col;
                columHeight = col.offsetHeight;
            } else if(columHeight > col.offsetHeight) {
                columHeight = col.offsetHeight;
                curColumn = col
                console.log(col.offsetHeight)
            }
        })
        curColumn.prepend(img)
    })
    // document.querySelectorAll(".column").forEach((col, i) => {
    //     let count = 5 * i;
    //     let max = count + 5;
    //     while (count < max) {
    //         col.prepend(images[count])
    //         count++;
    //     }
    // })
    isLoaded = true
    checkLoad()
}

const checkLoad = () => {
    let loadWrap = document.querySelector(".load-field")
    let loadIcon = document.querySelector(".load-icon")
    if (!isLoaded) {
        loadWrap.classList.add('loading')
        let degree = 0;
        let rotateId = setInterval(() => {
            if(isLoaded) clearInterval(rotateId);
            loadIcon.style.transform = `rotate(${degree}deg)`
            degree += 180
        }, 1500)
    } else {
        loadIcon.style.transform = null;
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
renderImages()
