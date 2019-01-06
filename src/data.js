const chalk = require("chalk")
const fs = require("fs")
const path = require("path")
const { fetch, flatten, sort, writeFile, errorHandler } = require("./utils.js")

const showPath = path.join(__dirname, "..", "dist")
const manifestPath = path.join(__dirname, "..", "dist")

let promises = []

module.exports = {
  checkManifest() {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(manifestPath, "manifest.json"), (error, data) => {
        error && error.code === "ENOENT"
          ? resolve(false)
          : resolve(data)
      })
    })
  },
  updateManifest(shows) {
    module.exports.checkManifest().then(response => {
      let data = {
        last_updated_date: new Date(Date.now()),
        last_updated_ms: Date.now(),
      }
      if (response) {
        data["shows"] = [...JSON.parse(response).shows, ...shows.map(show => show.id)]
      } else {
        data["shows"] = [...shows.map(show => show.id)]
      }
      writeFile("manifest.json", manifestPath, JSON.stringify(data))
      return shows
    })
  },
  getShows(page, manifestData) {
    let link = `https://www.livefromhere.org/listen/${page}.json/`

    return fetch(link).then((response, errorHandler) => {
      let shows = module.exports.getIndividualShow(response, manifestData)
      promises.push.apply(promises, shows)

      console.log(chalk.blue(`Fetching from ${link}`))

      response = JSON.parse(response)
      if (response.next_page) {
        console.log(chalk.yellow(`Next page: ${response.next_page}`))
        return module.exports.getShows(response.next_page, manifestData)
      }
      return sort(promises)
    }).catch(error => errorHandler(error))

  },
  getIndividualShow(data, manifestData) {
    data = JSON.parse(data)
    let shows = []
    data.items.forEach(show => {
      if (!manifestData || (manifestData && !manifestData.shows.includes(show.audio.id))) {
        shows.push({
          id: show.audio.id,
          date: show.audio.created_at,
          date_ms: Date.parse(show.audio.created_at),
          duration: show.audio.duration_hms,
          title: show.title,
          audio: show.audio.encodings[0].http_file_path,
          artists: show.title.trim().replace("and", "").split(",")
        })
      }
    })
    return shows
  },
}
