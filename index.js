const express = require('express');
const app = express();
app.set('views', './src/views')
app.set('view engine', 'ejs')
const { getAudioFiles } = require('./src/awsUtil')
require('dotenv').config()

app.listen(5000, () => {
  console.log('App is listening on port 5000');
});

app.get('/', (request, response) => {
  getAudioFiles().then((fileNames) => {

    var episodes = []
    fileNames.forEach((item) => {
      var formmattedDate = new Date(item.substring(0, item.length-13)).toDateString()
      episodes.push({
        title: formmattedDate,
        fileName: item
      })
    })

    response.render('index', {
      episodes: episodes
    });
  })
});
