const chalk = require("chalk")
const fs = require("fs")
const path = require("path")
const { createFileAndDirectory, errorHandler, fetch, sort } = require("./utils.js")

const showPath = path.join(__dirname, "../..", "data")
const showFile = "shows.json"
const exclusions = [
  "01CZYDRCJXK43QJ5ZVYM07351A",
  "1Q7T558F88HRQDH7XCX1854QEM",
  "1Q7T5GGPJ5ZRN43Y9XYR93FHQ0",
  "1R4CE5VAEYQ4W68SD30N0R9HQW"
]
let promises = []
let baseUrl = "https://www.livefromhere.org/listen/"

module.exports = {
  retrieve(page) {
    let link = `${baseUrl}${page}.json/`
    return fetch(link).then((response, errorHandler) => {
      if (response) {
        response = JSON.parse(response)
        promises.push.apply(promises, response.items)
        console.log(chalk.blue(`Fetching from ${link}`))
        if (response.next_page) {
          console.log(chalk.yellow(`Next page: ${response.next_page}`))
          return module.exports.retrieve(response.next_page)
        }
        return promises
      }
    }).catch(error => errorHandler(error))
  },
  transform(shows) {
    return new Promise((resolve, reject) => {
      shows = shows.map(show => {
        if (!exclusions.includes(show.audio.id)) {
          return show.slug
        }
      }).filter(show => show) // filter nulls
      resolve(shows)
    })
  },
  retrieveArtists(shows) {
    let individualData = shows.map(show => {
      console.log(`Fetching ${baseUrl}${show}.json/`)
      console.log(fetch(`${baseUrl}${show}.json/`))
      return fetch(`${baseUrl}${show}.json/`).then(response => {
        return JSON.parse(response)
      })
    })
    return Promise.all(individualData)
  },
  transformAgain(shows) {
    return new Promise((resolve, reject) => {
      shows = shows.map(show => {
        return {
          id: show.audio.id,
          date: show.audio.created_at,
          date_ms: Date.parse(show.audio.created_at),
          duration: show.audio.duration_hms,
          title: show.title,
          audio: show.audio.encodings[0].http_file_path,
          artists: show.contributors,
          last_updated: new Date(Date.now())
        }
      })
      resolve(shows)
    })
  },
  read(shows) {
    return new Promise((resolve, reject) => {
      const showOutput = path.join(showPath, showFile)
      fs.readFile(showOutput, (error, data) => {
        resolve([shows, data])
      })
    })
  },
  write(shows) {
    let [newShows, oldShows] = shows
    if (!oldShows) {
      createFileAndDirectory(showFile, showPath, JSON.stringify(newShows))
      return
    } else {
      oldShows = JSON.parse(oldShows)
      let updatedShows = [...oldShows]
      let ids = oldShows.map(show => show.id)
      newShows.forEach(show => {
        if (!ids.includes(show.id)) {
          updatedShows.push(show)
          console.log(`Adding ${show.title}`)
        }
      })
      updatedShows = sort(updatedShows)
      createFileAndDirectory(showFile, showPath, JSON.stringify(updatedShows))
      return
    }
  },
}
