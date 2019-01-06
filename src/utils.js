const chalk = require("chalk")
const https = require("https")
const fs = require("fs")
const path = require("path")

module.exports = {
  errorHandler(error) {
    console.log(chalk.red.bold(error))
    console.log(error.stack)
    return error
  },
  fetch(link) {
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
  flatten(array) {
    return array.reduce((a,b) => a.concat(b))
  },
  sort(array) {
    return array.sort((show1, show2) => {
      return show1.date_ms - show2.date_ms
    })
  },
  writeFile(file, directory, data) {
    const filePath = path.join(directory, file)
    fs.writeFile(filePath, data, (error) => {
      if (error) {
        module.exports.errorHandler(`Error writing to ${file}: ${error}`)
        if (error.code === "ENOENT") {
          fs.mkdir(directory, { recursive: false }, (err) => {
            console.log(chalk.hex("#008080")`CREATING DIRECTORY: ${directory}`)
            return module.exports.writeFile(file, directory, data)
            if (err) {
              return module.exports.errorHandler(`Error creating directory: ${err}`)
            }
          })
        }
      } else {
        console.log(chalk.green.bold(`Finished writing to ${file}`))
        return
      }
    })
  }
}