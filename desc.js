var axios = require('axios');
const { MongoClient } = require("mongodb")
require('dotenv').config()

const getBearerToken = async () => {
  var token
  var data = {
    'grant_type': 'client_credentials',
    'client_id': process.env.SPOTIFY_CLIENT_ID,
    'client_secret': process.env.SPOTIFY_CLIENT_SECRET
  };
  var config = {
    method: 'post',
    url: 'https://accounts.spotify.com/api/token',
    headers: { 
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data
  };

  await axios(config)
    .then(function (response) {
      token = response.data.access_token
    })
    .catch(function (error) {
      console.log(error);
    });
  return token
}


const getEpisodes = async (spotify_bearer_token) => {
  var episodes = []
  var config = {
    method: 'get',
    url: 'https://api.spotify.com/v1/shows/4guKQiUnhhWoBGg7KGz9Nb/episodes?market=US&limit=50',
    headers: { 
      'Authorization': `Bearer ${spotify_bearer_token}`
    }
  };

  await axios(config)
  .then(function (response) {
    // get relevant data
    var episodesByDate = {}
    response.data.items.forEach(element => {
      if (!episodesByDate.hasOwnProperty(element.release_date)){
        episodesByDate[element.release_date] = []
      }

      episodesByDate[element.release_date].push({
        title: element.name,
        description: element.description
      })
    });

    // format into array of documents for MongoDB
    for (const date in episodesByDate) {
      episodes.push({
        date,
        segments: episodesByDate[date]
      })
    }

  })
  .catch(function (error) {
    console.log(error);
  })

  return episodes
}

async function sendEpisodeDataToMongoDB () {

  const uri = process.env.MONGO_URI
  const client = new MongoClient(uri);

  try {
    // get array of documents to insert
    const token = await getBearerToken()
    const docs = await getEpisodes(token)

    for (var doc of docs) {
      const database = client.db("spotifyDB");
      const spotifySegments = database.collection("spotifySegments");
      // create a filter for a movie to update
      const filter = { date: doc.date };
      // this option instructs the method to create a document if no documents match the filter
      const options = { upsert: true };
      
      const updateDoc = {
        $set: doc,
      };
      const result = await spotifySegments.updateOne(filter, updateDoc, options);
      console.log(
        `${result.matchedCount} document(s) matched the filter ${JSON.stringify(filter)}, updated ${result.modifiedCount} document(s)`,
      );
    }

  } catch (error) {
    console.error(error)
  } finally {
    await client.close();
  }
}

sendEpisodeDataToMongoDB().catch(console.dir);
