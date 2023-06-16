const express = require('express');
const app = express();
app.set('views', './src/views')
app.set('view engine', 'ejs')
const { getAudioFiles } = require('./src/awsUtil')
require('dotenv').config()
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

app.listen(process.env.PORT || 5000, () => {
  console.log(`App is listening on port ${process.env.PORT ? process.env.PORT : 5000}`);
});

// returns formatted episode data for EJS views like so:
// [{ title: formmattedDate, fileName: item }]
const getFormattedEpisodeData = async () => {
  var audioFiles = await getAudioFiles()

  var episodes = []
  audioFiles.forEach((item) => {
    var formmattedDate = new Date(`${item.substring(0, item.length-13)} EST`).toDateString()
    episodes.push({
      title: formmattedDate,
      fileName: item
    })
  })
  episodes.sort().reverse();

  return episodes
}

app.get('/', async (request, response) => {
  const episodes = await getFormattedEpisodeData()

  // If there is an episode in query params
  // ex. http://localhost:5000/?episode=2023-06-05T05-45-17.wav
  var episodeQueued
  if (request.query.episode) {
    episodeQueued = episodes.find(({ fileName }) => fileName === request.query.episode);
  }

  response.render('index', {
    episodes,
    episodeQueued
  });
});
