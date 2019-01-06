const chalk = require("chalk")
const { fetch, flatten, writeFile, errorHandler } = require("./utils.js")
let promises = []

module.exports = {
  getAllShows: function(page) {
    let link = `https://www.livefromhere.org/listen/${page}.json/`
    return fetch(link).then((response, errorHandler) => {
      const show = module.exports.getIndividualShow(response)
      promises.push(show)
      console.log(chalk.blue(`Fetching from ${link}`))
      response = JSON.parse(response)
      if (response.next_page) {
        console.log(chalk.yellow(`Next page: ${response.next_page}`))
        return module.exports.getAllShows(response.next_page)
      }
      return promises
    }).catch(error => errorHandler(error))
  },
  getIndividualShow: function(data) {
    data = JSON.parse(data)
    return data.items.map(show => {
      return {
        id: show.audio.id,
        date: show.audio.created_at,
        duration: show.audio.duration_hms,
        title: show.title,
        audio: show.audio.encodings[0].http_file_path,
        artists: show.title.trim().replace("and", "").split(",")
      }
    })
  },
  getManifestData: function(latestShow) {
    return {
      last_updated_date: new Date(Date.now()),
      last_updated_ms: Date.now(),
      most_recent_show: latestShow
    }
  }
}
