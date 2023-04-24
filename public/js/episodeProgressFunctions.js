function updateStatusBadge(episodeFileName) {
const STATUS_COLORS = {
        "New!": "bg-success",
        "In progress": "bg-primary",
        "Finished": "bg-warning",
    }
    var button = document.getElementById(episodeFileName)
    let title = button.getAttribute("title")
    var metaData = JSON.parse(localStorage.getItem("elliot-episodeMetadata"))
    let status = metaData[episodeFileName].status
    button.innerHTML = `${title} <span class="badge text-white ${STATUS_COLORS[status]}" style="pointer-events: none; margin-left: 3%;">${status}</span>`
}

function saveCurrentEpisodePosition() {
    if (player.src) {
        var currentMetadata = JSON.parse(localStorage.getItem("elliot-episodeMetadata"))
        currentMetadata[localStorage.getItem("elliot-currentEpisode")].currentPos = player.currentTime
        localStorage.setItem("elliot-episodeMetadata", JSON.stringify(currentMetadata))
    }
}

function changeCurrentEpisode(event) {
    saveCurrentEpisodePosition()

    // set NEW current episode
    var player = document.getElementById("audioplayer");
    localStorage.setItem("elliot-currentEpisode", event.target.getAttribute('fileName'))
    player.src = "https://d2bso5f73cpfun.cloudfront.net/" + event.target.getAttribute('fileName');
    player.load();
    var status = JSON.parse(localStorage.getItem("elliot-episodeMetadata"))[event.target.getAttribute('fileName')].status
    // If episode has been finished, start it over
    if (status === "Finished") {
        player.currentTime = 0
    } else {
        player.currentTime = JSON.parse(localStorage.getItem("elliot-episodeMetadata"))[event.target.getAttribute('fileName')].currentPos
    }
    document.getElementById("now_playing").innerHTML = "Now playing: " + event.target.getAttribute("title");
}

function setCurrentEpisodeStatus(status) {
    var currentEp = localStorage.getItem("elliot-currentEpisode")
    var currentMetadata = JSON.parse(localStorage.getItem("elliot-episodeMetadata"))
    currentMetadata[currentEp].status = status
    localStorage.setItem("elliot-episodeMetadata", JSON.stringify(currentMetadata))

    updateStatusBadge(currentEp)
}

function setupLocalStorage(episodes) {
    // If user doesn't already have cepisodeMetadata in localStorage, add it
    var localStorageMetadata = JSON.parse(localStorage.getItem("elliot-episodeMetadata"))
    if (localStorageMetadata === null) {
        localStorageMetadata = {}
        localStorage.setItem("elliot-episodeMetadata", JSON.stringify(localStorageMetadata))
    }

    // Add any episodes to localstorage that user doesnt have (new episodes etc)
    episodes.forEach((ep) => {
        if (localStorageMetadata[ep.fileName] === undefined) {
            localStorageMetadata[ep.fileName] = {
                "currentPos": 0,
                "status": "New!"
            }
            localStorage.setItem("elliot-episodeMetadata", JSON.stringify(localStorageMetadata))
        }
    })
}