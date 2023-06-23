function updateStatusBadge(episodeFileName) {
    const STATUS_COLORS = {
        "New!": "bg-success",
        "In progress": "bg-primary",
        "Finished": "bg-warning",
    }
    var metaData = JSON.parse(localStorage.getItem("elliot-episodeMetadata"))
    let status = metaData[episodeFileName].status
    var badge = document.getElementById(`${episodeFileName}-progress-badge`)
    
    badge.setAttribute('class', `badge text-white ${STATUS_COLORS[status]}`)
    badge.setAttribute('style', `pointer-events: none; margin-left: 3%;`)
    badge.innerHTML = status
}

function saveCurrentEpisodePosition() {
    if (player.src) {
        var currentMetadata = JSON.parse(localStorage.getItem("elliot-episodeMetadata"))
        currentMetadata[localStorage.getItem("elliot-currentEpisode")].currentPos = player.currentTime
        localStorage.setItem("elliot-episodeMetadata", JSON.stringify(currentMetadata))
    }
}

function changeEpisode(event) {
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
    
    var episodeCard = 
        `<div class="card" style="width: 20rem;">
            <img src="https://pbs.twimg.com/profile_images/1433976973387255808/fAfusCBv_400x400.jpg" class="card-img-top" alt="Episode Image">
            <div class="card-body">
                <h5 class="card-title">${event.target.getAttribute('title')}</h5>
                <p>
                    <button class="btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">
                        Share
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-share" viewBox="0 0 16 16">
                        <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                        </svg>
                    </button>
                </p>
                <div class="collapse" id="collapseExample">
                    <div class="card card-body" id="shareLinkTextArea">
                        https://eitmondemand.com/?episode=${event.target.getAttribute('fileName')}
                        <div id="copyIconParent" class="copyToClipboard">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </div>`

    document.getElementById("now_playing").innerHTML = "<h5>Now playing: </h5>" + episodeCard;
    document.getElementById('copyIconParent').addEventListener('click', function() {
        // Get the text field
        var copyText = document.getElementById("shareLinkTextArea").innerText
        // Copy the text inside the text field
        navigator.clipboard.writeText(copyText);

        var iconParent = document.getElementById("copyIconParent")
        iconParent.innerHTML = `<svg class="text-success" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check" viewBox="0 0 16 16">
        <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
        </svg>`

        const delay = ms => new Promise(res => setTimeout(res, ms));
        const waitTwoSecondsThenRestoreClipboardIcon = async () => {
            await delay(2000);
            iconParent.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
            <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
            <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
            </svg>`
        };
        waitTwoSecondsThenRestoreClipboardIcon()
        // wait for 2 seconds, change back to clipboard icon
    })
    
    // Update tab title and url
    document.title = `Elliot on Demand - ${event.target.getAttribute("title")}`
    const newURL = `/?episode=${event.target.getAttribute("fileName")}`;
    const newState = { additionalInformation: 'Updated the URL with JS' };

    // This will create a new entry in the browser's history, without reloading
    window.history.pushState(newState, "", newURL);
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