const express = require('express');
const app = express();
app.set('views', './src/views')
app.set('view engine', 'ejs')
const { getFormattedEpisodeData } = require('./src/util/formatEpisodeData')
require('dotenv').config()
var path = require('path');
app.use(express.static(path.join(__dirname, 'public')));
app.use(require("./src/routes/humanReadableTime"))

app.listen(process.env.PORT || 5000, () => {
  console.log(`App is listening on port ${process.env.PORT ? process.env.PORT : 5000}`);
});

// Initiate cron job to update MongoDB with any new EITM spotify episodes
const mongoCronUtil = require('./src/util/mongoCronUpdate');
mongoCronUtil.initUpdateEpisodeSegments();

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
