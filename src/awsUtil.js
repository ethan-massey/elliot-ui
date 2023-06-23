const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3")

const getAudioFiles = async () => {
  const client = new S3Client({
    region: 'us-east-1',
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
    }
  });
  const command = new ListObjectsV2Command({
    Bucket: 'daily-elliot-audio'
  });
  try {
    const response = await client.send(command);

    const fileNames = response.Contents.map((item) => {
      return item.Key
    })
    return fileNames
  } catch (err) {
    throw(err)
  }
}

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

module.exports = {
  getFormattedEpisodeData
}
