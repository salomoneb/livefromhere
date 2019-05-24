const chalk = require("chalk")
const fs = require("fs")
const path = require("path")
const { createFileAndDirectory, errorHandler, fetch, filterExistingShows, updateShows } = require("./utils.js")

const showPath = path.join(__dirname, "..", "data")
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
  // Retrieve the lists of all shows
  getAll(page) {
    let link = `${baseUrl}${page}.json/`
    return fetch(link).then((response, errorHandler) => {
      if (response) {
        response = JSON.parse(response)
        promises.push.apply(promises, response.items) // Nice way to flatten the array
        console.log(chalk.blue(`Fetching from ${link}`))
        if (response.next_page) {
          console.log(chalk.yellow(`Next page: ${response.next_page}`))
          return module.exports.getAll(response.next_page)
        }
        return promises
      }
    }).catch(error => errorHandler(error))
  },
  // Return an array of filtered slugs
  filterIds(shows) {
    return new Promise((resolve, reject) => {
      shows = shows.map(show => {
        if (show.audio && show.audio.id && !exclusions.includes(show.audio.id)) {
          return {
            id: show.audio.id,
            slug: show.slug
          }
        }
      }).filter(show => show) // filter nulls
      resolve(shows)
    })
  },
  // Check if the file exists and return data
  read(shows) {
    return new Promise((resolve, reject) => {
      const showOutput = path.join(showPath, showFile)
      fs.readFile(showOutput, (error, data) => {
        if (data) {
          shows = filterExistingShows(shows, data)
        }
        resolve(shows)
      })
    })
  },
  // Make individual calls to each show
  getIndividual(shows) {
    let individualData = shows.map(show => {
      console.log(chalk.cyan(`Fetching ${baseUrl}${show.slug}.json/`))
      return fetch(`${baseUrl}${show.slug}.json/`).then(response => {
        return JSON.parse(response)
      })
    })
    return Promise.all(individualData)
  },
  // Transform our data
  transform(shows) {
    return new Promise((resolve, reject) => {
      shows = shows.map(show => {
        return {
          id: show.audio.id,
          date: show.audio.created_at,
          date_ms: Date.parse(show.audio.created_at),
          duration: show.audio.duration_hms,
          title: show.title,
          slug: show.slug,
          audio: show.audio.encodings[0].http_file_path,
          artists: show.contributors.map(artist => artist.title),
          last_updated: new Date(Date.now())
        }
      })
      resolve(shows)
    })
  },
  // Write the file and directory
  write(shows) {
    fs.readFile(path.join(showPath, showFile), (err, data) => {
      if (err && err.code === 'ENOENT') {
        createFileAndDirectory(showFile, showPath, JSON.stringify(shows))
        return
      } else {
        let updatedShows = updateShows(data, shows)
        createFileAndDirectory(showFile, showPath, JSON.stringify(updatedShows))
        return
      }
    })
  },
}
