const { getAudioFiles } = require('./awsUtil')
const { getEpisodeSegments } = require('./spotifyUtil')

// returns formatted episode data for EJS views like so:
// [{ title: formmattedDate, fileName: item }]
const getFormattedEpisodeData = async () => {
    var audioFiles = await getAudioFiles()
  
    var episodes = []
    for (item of audioFiles) {

        // get formatted date from filename to use as title
        var formmattedDate = new Date(`${item.substring(0, item.length-13)} EST`).toDateString()
        // get episode segments from MongoDB
        var episodeSegments = await getEpisodeSegments(item.substring(0, 10))

        episodes.push({
            title: formmattedDate,
            fileName: item,
            segments: episodeSegments
        })
    }
    episodes.sort().reverse();

    return episodes
}

module.exports = {
    getFormattedEpisodeData
}