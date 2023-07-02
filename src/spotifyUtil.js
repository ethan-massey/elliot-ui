const { MongoClient } = require("mongodb")

// Get a single episode's segments from MongoDB
// param episodeDate format: "2023-06-29"
async function getEpisodeSegments (episodeDate) {
    const uri = process.env.MONGO_URI
    const client = new MongoClient(uri);

    try {
        const database = client.db("spotifyDB");
        const spotifySegments = database.collection("spotifySegments");

        const query = { date: episodeDate };

        const options = {}

        const spotifyEpisodeInfo = await spotifySegments.findOne(query, options);

        // since this method returns the matched document, not a cursor, print it directly
        return spotifyEpisodeInfo
    } catch (error) {
        console.error(error)
    } finally {
        await client.close();
    }
}

module.exports = {
    getEpisodeSegments
}
