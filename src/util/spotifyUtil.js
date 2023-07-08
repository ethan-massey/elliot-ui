const { MongoClient } = require("mongodb");

// Get bearer token from Spotify. Expires after 1 hour
const getSpotifyBearerToken = async () => {
  var token;
  var data = {
    grant_type: "client_credentials",
    client_id: process.env.SPOTIFY_CLIENT_ID,
    client_secret: process.env.SPOTIFY_CLIENT_SECRET,
  };
  var config = {
    method: "post",
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    data,
  };

  await axios(config)
    .then(function (response) {
      token = response.data.access_token;
    })
    .catch(function (error) {
      console.log(error);
    });
  return token;
};

// Get all Elliot in the Morning episodes from Spotify
const getEpisodesFromSpotify = async () => {
  const spotify_bearer_token = await getSpotifyBearerToken();

  var episodes = [];
  var config = {
    method: "get",
    // limit=50 maximum that Spotify will provide
    url: "https://api.spotify.com/v1/shows/4guKQiUnhhWoBGg7KGz9Nb/episodes?market=US&limit=50",
    headers: {
      Authorization: `Bearer ${spotify_bearer_token}`,
    },
  };

  await axios(config)
    .then(function (response) {
      // get relevant data (title, description)
      var episodesByDate = {};
      response.data.items.forEach((element) => {
        if (!episodesByDate.hasOwnProperty(element.release_date)) {
          episodesByDate[element.release_date] = [];
        }

        episodesByDate[element.release_date].push({
          title: element.name,
          description: element.description,
        });
      });

      // format into array of documents for MongoDB
      for (const date in episodesByDate) {
        episodes.push({
          date,
          segments: episodesByDate[date],
        });
      }
    })
    .catch(function (error) {
      console.log(error);
    });

  return episodes;
};

// Get segments of all episodes that are in MongoDB
async function getEpisodeSegmentsFromMongo() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    const database = client.db("spotifyDB");
    const spotifySegments = database.collection("spotifySegments");

    const query = {};

    const options = {};

    const spotifyEpisodeInfoCursor = await spotifySegments.find(query, options);

    var res = {};
    for await (const doc of spotifyEpisodeInfoCursor) {
      res[doc.date] = {
        segments: doc.segments,
      };
    }
    return res;
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

module.exports = {
  getEpisodeSegmentsFromMongo,
  getEpisodesFromSpotify,
};
