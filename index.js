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
    episodes.sort().reverse();

    response.render('index', {
      episodes: episodes
    });
  })
});
