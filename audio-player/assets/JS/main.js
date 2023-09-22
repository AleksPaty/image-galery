let soundList = [
    {'What a Wonderful World-Louis Armstrong': "assets/music/Louis Armstrong-What A Wonderful World.mp3"},
    {'Freedom-George Michael': "assets/music/george-michael-freedom.mp3"},
    {'Never gonna give you up-Rick Astley': "assets/music/Rick_Astley_Tribute_Band_-_Never_Gonna_Give_You_Up.mp3"}
]

const music = new Audio(soundList[0]['What a Wonderful World-Louis Armstrong']);
music.volume = 0.2;


const player = document.querySelector('.player')
const playPauseBtn = document.querySelector('.controll-mainBtn')
const nextBtn = document.querySelector(".controll-btn.forvard")
const prevBtn = document.querySelector(".controll-btn.back")
const timeLineThumb = player.querySelector(".time-progress__thumb")

let isPlaying = false;
let currentSound = 0;

const linkRangeVolume = () => {
    document.getElementById("volume-line").value = music.volume * 100
}
linkRangeVolume()
const playMusic = (srcTrack = "") => {
    if(srcTrack) music.src = srcTrack;
    music.play()
    setIntervalPlaying()

    isPlaying = true
}
const toggleNextSound = (duration) => {
    if(duration === 'prev' && currentSound > 0) currentSound -= 1;
    if(duration === 'next' && currentSound < soundList.length - 1) {
        currentSound += 1;
    } else if(duration === 'next') {
        currentSound = 0 
    }

    music.currentTime = 0;
    playMusic(Object.values(soundList[currentSound])[0])
    togglePlayBtn()
    changeWallpape()
}
const endedPlaying = () => {
    isPlaying = false;
    togglePlayBtn()
    setTimeout(toggleNextSound, 800, 'next')

    music.removeEventListener("ended", endedPlaying)
}
const togglePlayBtn = () => {
    isPlaying ? playPauseBtn.classList.add("pause") : playPauseBtn.classList.remove("pause")
}
const getSoundDuration = (duration) => {
    let minuts = Math.floor(duration / 60)
    let seconds = Math.floor(duration - (minuts * 60))
    return [minuts, seconds]
}
const showMusicCurentTime = () => {
    let [min, sec] = getSoundDuration(music.currentTime)
    player.querySelector(".current-time").innerText = `${min.toString().padStart(2, 0)}:${sec.toString().padStart(2, 0)}`
}
const setIntervalPlaying = () => {
    
    let playTimerId = setInterval(() => {
        if(!isPlaying) clearInterval(playTimerId);
        (music.duration / music.currentTime < 1.1) 
            ? timeLineThumb.classList.add('end')
            : timeLineThumb.classList.remove('end')

        showMusicCurentTime()
    }, 1000)
    let progressLineId = setInterval(() => {
        if(!isPlaying) clearInterval(progressLineId);

        player.querySelector(".time-progress").style.width = (Math.floor(music.currentTime) / Math.floor(music.duration)) * 100 + '%'
    }, 250)
    music.addEventListener("ended", endedPlaying)
}
function showSoundAuth() {
    let soundNameElem = player.querySelector(".sound-name")
    let soundAuthNameElem = player.querySelector(".sound-detaile")
    let soundInfo = Object.keys(soundList[currentSound])[0]

    soundNameElem.innerText = soundInfo.split('-')[0]
    soundAuthNameElem.innerText = soundInfo.split('-')[1]
}
function changeWallpape() {
    let imgSrcList = [
        'assets/wallpaper/wallpaper_cyt.jpg',
        'assets/wallpaper/1249580.jpg',
        'assets/wallpaper/wallpaper_road.jpg'
    ]
    document.querySelector(".wallpaper-image").src = imgSrcList[currentSound]
}
const changeVolume = (e) => {
    music.volume = e.target.value * 0.01;
}


music.addEventListener('loadeddata', () => {
    let [min, sec] = getSoundDuration(music.duration)
    player.querySelector(".over-time").innerText = `${min.toString().padStart(2, 0)}:${sec.toString().padStart(2, 0)}`
    showSoundAuth()
})


 /*----------- for muving sound time line -----------*/

const moveThumb = (e) => {
    let timeLine = player.querySelector(".time-line");
    let progressBar = player.querySelector(".time-progress");

    let muveValue = e.pageX - player.offsetLeft;
    if(7 < muveValue && (player.offsetWidth) > muveValue) {
        let changeTimeStamp = (muveValue / timeLine.offsetWidth)*100;
        changeTimeStamp > 60 ? timeLineThumb.classList.add('end') : timeLineThumb.classList.remove('end')

        progressBar.style.width = changeTimeStamp + '%';
        music.currentTime = music.duration * (changeTimeStamp / 100)
    } else {
        timeLine.removeEventListener("mousemove", moveThumb)
    }
}
timeLineThumb.addEventListener("mousedown", () => {
    let timeLine = player.querySelector(".time-line");
    timeLine.addEventListener("mousemove", moveThumb)
    player.querySelector(".time-progress").style.transition = "width 0s";

    timeLineThumb.addEventListener("mouseup", () => {
        showMusicCurentTime()
        timeLine.removeEventListener("mousemove", moveThumb)
        player.querySelector(".time-progress").style.transition = ""
    })
})
timeLineThumb.ondragstart = () => false;

 /*----------- end muving sound time line -----------*/


playPauseBtn.addEventListener('click', () => {
    if(!isPlaying) {
        playMusic()
    } else {
        music.pause()
        isPlaying = false
    }
    togglePlayBtn()
})
nextBtn.addEventListener('click', () => {
    toggleNextSound('next')
    togglePlayBtn()
})
prevBtn.addEventListener('click', () => {
    toggleNextSound('prev')
    togglePlayBtn()
})

document.getElementById("volume-line").addEventListener('change', changeVolume)
document.getElementById("volume-line").addEventListener('mousedown', (e) => {
    let progressVolId = setInterval(() => {
        e.target.style.backgroundSize = `${e.target.value}% 100%`;
    }, 50)

    document.getElementById("volume-line").addEventListener('mouseup', () => {
        clearInterval(progressVolId)
    })
})
document.getElementById("volume-line").addEventListener("touchstart", (e) => {
    let progressVolId = setInterval(() => {
        e.target.style.backgroundSize = `${e.target.value}% 100%`;
    }, 50)

    document.getElementById("volume-line").addEventListener("touchend", () => {
        clearInterval(progressVolId)
    })
})

document.querySelector(".arrow-footer").addEventListener('click', () => {
    let footer = document.getElementById("footer")
    let arrowBtn = document.querySelector(".arrow")

    footer.classList.toggle("open")
    arrowBtn.classList.toggle("opening")

    document.querySelector(".to_start").onclick = (e) => {
        e.preventDefault()
        footer.classList.remove("open")
        arrowBtn.classList.remove("opening")
    }
})