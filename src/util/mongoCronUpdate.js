const { MongoClient } = require("mongodb");
const cron = require("node-cron");
const { getEpisodesFromSpotify } = require("./spotifyUtil");
require("dotenv").config();

// Store episode data in MongoDB
// Uses updateOne() with upsert: true (if no matching document, one is created)
async function updateEpisodeSegmentsInMongoDB() {
  const uri = process.env.MONGO_URI;
  const client = new MongoClient(uri);

  try {
    // get array of documents to insert
    const docs = await getEpisodesFromSpotify();

    for (var doc of docs) {
      const database = client.db("spotifyDB");
      const spotifySegments = database.collection("spotifySegments");
      // create a filter for a movie to update
      const filter = { date: doc.date };
      // this option instructs the method to create a document if no documents match the filter
      const options = { upsert: true };

      for (seg of doc.segments) {
        const updateDoc = {
          $addToSet: { "segments": {title: seg.title, description: seg.description}}
        };
        const result = await spotifySegments.updateOne(
          filter,
          updateDoc,
          options
        );
        console.log(
          `${result.matchedCount} document(s) matched the filter ${JSON.stringify(
            filter
          )}, updated ${result.modifiedCount} document(s)`
        );
      }
    }
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
  }
}

// cron job to regularly update episode segments in MongoDB
const initUpdateEpisodeSegments = () => {
  // update episodes once a day, every day
  const updateEpisodeSegments = cron.schedule("0 17 * * *", () => {
    updateEpisodeSegmentsInMongoDB().catch(console.dir);
  });

  updateEpisodeSegments.start();
};

module.exports = { initUpdateEpisodeSegments, updateEpisodeSegmentsInMongoDB };
