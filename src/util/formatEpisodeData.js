const { getAudioFiles } = require("./awsUtil");
const { getEpisodeSegmentsFromMongo } = require("./spotifyUtil");

// returns formatted episode data for EJS views like so:
// [{ title: formmattedDate, fileName: item, segments: [] }]
const getFormattedEpisodeData = async () => {

  var episodes = [];

  try {
    var audioFiles = await getAudioFiles();
    var episodeSegments = await getEpisodeSegmentsFromMongo();

    for (item of audioFiles) {
      // get formatted date from filename to use as title
      var formmattedDate = new Date(
        `${item.substring(0, item.length - 13)} EST`
      ).toDateString();
  
      episodes.push({
        title: formmattedDate,
        fileName: item,
        segments:
          episodeSegments[item.substring(0, 10)] !== undefined
            ? episodeSegments[item.substring(0, 10)].segments
            : [],
      });
    }
    episodes.sort().reverse();
    
  } catch(err) {
    console.log(err)
  }

  return episodes;
};

module.exports = {
  getFormattedEpisodeData,
};
