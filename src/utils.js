const chalk = require("chalk")
const https = require("https")
const fs = require("fs")

module.exports = {
  errorHandler: function(error) {
    console.log(chalk.red.bold(error))
    return error
  },
  fetch: function(link) {
    return new Promise((resolve, reject) => {
      const request = https.get(link, (response) => {
        if (response.statusCode < 200 || response.statusCode > 299) {
          reject(new Error(`Request rejected with status code: ${response.statusCode}`))
        }
        let body = ""
        response.on("data", (d) => body+=d)
        response.on("end", () => resolve(body))
      })
      request.on("error", (error) => {
        reject(new Error(`Rejecting request to ${link}. Status code: ${error}`))
      })
    })
  },
  flatten: function(array) {
    return array.reduce((a,b) => a.concat(b))
  },
  writeFile: function(location, data) {
    fs.writeFile(location, data, (err) => {
      if (err) errorHandler(`Error writing to ${location}: ${err}`)
      console.log(chalk.green.bold(`Finished writing to ${location}`))
    })
  }
}