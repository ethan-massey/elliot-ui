const { MongoClient } = require("mongodb")

// Get segments of all episodes that are in MongoDB
async function getEpisodeSegments () {
    const uri = process.env.MONGO_URI
    const client = new MongoClient(uri);

    try {
        const database = client.db("spotifyDB");
        const spotifySegments = database.collection("spotifySegments");

        const query = {};

        const options = {}

        const spotifyEpisodeInfoCursor = await spotifySegments.find(query, options);

        var res = {}
        for await (const doc of spotifyEpisodeInfoCursor) {
            res[doc.date] = {
                segments: doc.segments
            }
        }
        return res
    } catch (error) {
        console.error(error)
    } finally {
        await client.close();
    }
}

module.exports = {
    getEpisodeSegments
}
