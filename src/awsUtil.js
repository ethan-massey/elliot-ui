const { S3Client, ListObjectsV2Command } = require("@aws-sdk/client-s3")

const getAudioFiles = async () => {
  try {
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
    const response = await client.send(command);

    const fileNames = response.Contents.map((item) => {
      return item.Key
    })
    return fileNames
  } catch (err) {
    throw(err)
  }
}

module.exports = {
  getAudioFiles
}
