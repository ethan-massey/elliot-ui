const express = require("express");
const { MongoClient } = require("mongodb");
const adHocMongoUpdate = express.Router();
const bcrypt = require('bcrypt');
const { updateEpisodeSegmentsInMongoDB } = require('../util/mongoCronUpdate');


const isValidAPIKey = async (clientPlaintextPassword) => {
    // get hashed password from DB
    const uri = process.env.MONGO_URI;
    const client = new MongoClient(uri);

    try {
        const database = client.db("users");
        const passwordCollection = database.collection("passwords");

        const queryResult = await passwordCollection.findOne({
            username: 'admin'
        })

        await client.close();

        // check to see if plaintext sent from client matches password in DB
        return bcrypt.compareSync(clientPlaintextPassword, queryResult.password, function (err, result) {
            if (err) throw err;
        });

    } catch (error) {
        throw error
    }
}


// endpoint requires API-Key in headers
adHocMongoUpdate.route('/updateEpisodeData').post(async (request, response) => {
    try {
        if (request.header('API-Key')) {
            if (await isValidAPIKey(request.header('API-Key'))) {
                await updateEpisodeSegmentsInMongoDB()
                response.status(201).send('Database updated.')
            }
            else {
                response.status(401).send('Client unauthorized.')
            }
        } else {
            response.status(401).send('Header \'API-Key\' required.')
        }

    } catch (error) {
        console.error(error);
        response.status(500).send(`Internal Server Error.`)
    }
});


module.exports = adHocMongoUpdate;
