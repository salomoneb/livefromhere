const chalk = require("chalk")
const fs = require("fs")
const path = require("path")
const { fetch, sort, errorHandler, writeFile } = require("./utils.js")
const showPath = path.join(__dirname, "..", "dist")
const manifestPath = path.join(__dirname, "..", "dist")
let promises = []

module.exports = {
  updateManifest(shows) {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(manifestPath, "manifest.json"), (error, data) => {
        console.log("should see first and third")
        const manifestData = {
          last_updated_date: new Date(Date.now()),
          last_updated_ms: Date.now(),
          shows: [...shows.map(show => show.id)]
        }
        if(!error) { // If the manifest file exists
          shows.forEach(show => {
            const idCheck = manifestData.shows.includes(show.id)
            if (!idCheck) manifestData.shows.push(show.id)
          })
          writeFile("manifest.json", manifestPath, JSON.stringify(manifestData))
        }
        if (error && error.code ==="ENOENT") {
          writeFile("manifest.json", manifestPath, JSON.stringify(manifestData))
          return module.exports.updateManifest(shows)
        }
        resolve([shows, JSON.parse(data).shows])
      })
    })
  },
  updateShows(showsAndManifestIds) { // Accepts an array of shows and updated manifest IDs
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(showPath, "shows.json"), (error, data) => {
        if (error && error.code ==="ENOENT") {
          writeFile("shows.json", showPath, JSON.stringify(showsAndManifestIds[0]))
        }
        if (!error) { // If the show file exists
          let updatedShows = showsAndManifestIds[0].filter(show => showsAndManifestIds[1].includes(show.id))
          writeFile("shows.json", showPath, JSON.stringify(showsAndManifestIds[0]))
        }
        resolve(showsAndManifestIds[0])
        return
      })
    })
  },
  getShows(page) {
    let link = `https://www.livefromhere.org/listen/${page}.json/`
    return fetch(link).then((response, errorHandler) => {
      if (response) {
        let shows = module.exports.getIndividualShow(response)
        promises.push.apply(promises, shows)
        console.log(chalk.blue(`Fetching from ${link}`))
        response = JSON.parse(response)
        if (response.next_page) {
          console.log(chalk.yellow(`Next page: ${response.next_page}`))
          return module.exports.getShows(response.next_page)
        }
        return sort(promises)
      }
    }).catch(error => errorHandler(error))
  },
  getIndividualShow(data) {
    data = JSON.parse(data)
    return data.items.map(show => {
      return {
        id: show.audio.id,
        date: show.audio.created_at,
        date_ms: Date.parse(show.audio.created_at),
        duration: show.audio.duration_hms,
        title: show.title,
        audio: show.audio.encodings[0].http_file_path,
        artists: show.title.trim().replace("and", "").split(",")
      }
    })
  },
}
