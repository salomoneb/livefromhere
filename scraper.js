const https = require("https")
const fs = require("fs")
const chalk = require("chalk")

const output = "shows.json"
let page = 1
let promises = []

function getAllShows(page) {
  let link = `https://www.livefromhere.org/listen/${page}.json`
  return fetch(link).then(response => {
    const shows = getIndividualShow(response)   
    promises.push(shows)

    response = JSON.parse(response)
    if (response.next_page) {            
      return getAllShows(response.next_page)
    }
    return promises
  })
}
function getIndividualShow(data) {
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
}
function fetch(url) {
  return new Promise( (resolve, reject) => {    
    const request = https.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error(response.statusCode))
      }
      let body = ""
      response.on("data", (d) => body+=d)
      response.on("end", () => resolve(body))
    })
    request.on("error", (error) => console.log(`Having problems: ${error}`))
  })
}
function flatten(array) {
  return array.reduce((a,b) => a.concat(b))
}

getAllShows(page).then(response => {
  const flattenedResponse = flatten(response)
  const finalData = JSON.stringify(flattenedResponse)
  fs.writeFile(output, finalData, (err) => {
    if (err) {
      console.log(`Error writing shows: ${err}`)
    }
    console.log("Finished writing")  
  })
})