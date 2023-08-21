const express = require("express");
const humanReadableTime = express.Router();
 
humanReadableTime.route('/humanReadableTime/:timeInSeconds').get(async (request, response) => {
    const inputSeconds = request.params.timeInSeconds
    const humanizeDuration = require("humanize-duration");
    const shortEnglishHumanizer = humanizeDuration.humanizer({
      language: "shortEn",
      languages: {
        shortEn: {
          y: () => "y",
          mo: () => "mo",
          w: () => "w",
          d: () => "d",
          h: () => "hr",
          m: () => "min",
          s: () => "sec",
          ms: () => "ms",
        },
      },
    });
    const res = shortEnglishHumanizer(inputSeconds, { round: true, delimiter: " " });  
    response.status(200).json({
      readableTime: res
    })
  });


module.exports = humanReadableTime;
