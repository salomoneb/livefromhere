const chalk = require("chalk")
const fs = require("fs")
const https = require("https")
const path = require("path")

module.exports = {
  errorHandler(error) {
    console.log(chalk.red.bold(error.stack))
    return error
  },
  sort(array) {
    return array.sort((show1, show2) => {
      return show2.date_ms - show1.date_ms
    })
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
  filterExistingShows(newShows, oldShows) {
    existingIds = JSON.parse(oldShows).map(oldShows => oldShows.id)
    return newShows.filter(show => {
      return !existingIds.includes(show.id)
    })
  },
  sort(array) {
    return array.sort((show1, show2) => {
      return show2.date_ms - show1.date_ms
    })
  },
  createFileAndDirectory(file, directory, data) {
    const filePath = path.join(directory, file)
    fs.writeFile(filePath, data, (error) => {
      if (error) {
        module.exports.errorHandler(`Error writing to ${file}: ${error}`)
        if (error.code === "ENOENT") {
          fs.mkdir(directory, { recursive: false }, (err) => {
            console.log(chalk.hex("#008080")(`CREATING DIRECTORY: ${directory}`))
            return module.exports.createFileAndDirectory(file, directory, data)
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
  },
  updateShows(oldShows, newShows) {
    oldShows = JSON.parse(oldShows)
    let updatedShows = [...oldShows]
    let ids = oldShows.map(show => show.id)
    newShows.forEach(show => {
      if (!ids.includes(show.id)) {
        updatedShows.push(show)
        console.log(`Adding ${show.title}`)
      }
    })
    updatedShows = module.exports.sort(updatedShows)
    return updatedShows
  }
}