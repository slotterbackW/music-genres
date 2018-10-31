/* The code in this file provides several methods for fetching data from the
  billboard hot-100 list.
  Functions:
    fetchAllData() -> Fetches every chart on the billboard hot 100 since August 9th, 1958
    fetchFromDay(date) -> Fetches every chart on the billboard hot 100 since the date specified
    updateData() -> Updates the songs.txt file to include new billboard data
*/

// Required libraries
const Billboard = require("billboard-top-100") // Used to scrape billboard web pages for chart data
const moment = require("moment") // Used for managing dates
const fs = require("fs") // Used to access the filesystem to read and write files

// Some constants
const STARTING_DAY = '1958-08-09'
const FILE_PATH ='./../data/songs.txt'

// A convenience method to add one week to a date
// input: date
// output: date in YYYY-MM-DD format
const addOneWeek = date => moment(date).add(7, 'days').format('YYYY-MM-DD')

// Number of times we've tried to fetch a specific chart. Used in fetchHot100()
let numTries = 0
// List of weeks we couldn't fetch. Used in fetchHot100()
let missedWeeks = []

// Fetches the top 100 files from a given date all the way up until today
// and writes those songs to a filestream
// input: date in YYYY-MM-DD format
// output: list of songs as a JSON string
function fetchHot100(date, filestream) {
  console.log('Fetching Hot 100 for', date)
  // if the supplied date is before today
  if (moment(date).isBefore(moment())) {
    // Use Billboard module to fetch hot-100 chart
    Billboard.getChart('hot-100', date, (error, songs) => {
      // If there's an error wait three seconds (3000 ms) and attempt to fetch results again.
      // Do this three times before failing and trying next week
      if (error) {
        console.log(error)
        if (numTries < 3) {
          // Add one since humans start counting at one
          console.log(`Retrying (attempt ${numTries + 1})...`)
          numTries++
          setTimeout(() => fetchHot100(date, filestream), 3000)
        } else {
          numTries = 0
          missedWeeks.push(date)
          fetchHot100(addOneWeek(date), filestream)
        }
      // Otherwise the songs for this week were successfully fetched
      } else {
        console.log(`Songs for ${date} fetched!`)
        numTries = 0
        // Write each song to the file at FILE_PATH
        songs.forEach(song => {
          let line = `${date},${song.title},${song.artist},${song.rank}`
          filestream.write(line + "\n")
        })
        console.log(`Songs for ${date} successfully written!`)
        // call fetchHot100 with next week
        fetchHot100(addOneWeek(date), filestream)
      }
    })
  } else {
    // close the file stream
    filestream.end()
    console.log(`${FILE_PATH} successfully written!`)
    // Log any weeks which couldn't be fetched
    console.log('Number of missed weeks', missedWeeks.length, 'Dates:', missedWeeks)
  }
}

// A convenience method to create a new filestream for writing
// input: none
// output: filestream
const newFilestream = () => fs.createWriteStream(FILE_PATH, {flags:'a'})

// Fetches every chart on the billboard hot 100 since August 9th, 1958
// input: none
// output: none, but writes to a text file specified in the FILE_PATH constant
const fetchAllData = () => {
  const filestream = newFilestream()
  filestream.write('Date,Title,Artist,Rank\n')
  fetchHot100(STARTING_DAY, filestream)
}

// Fetches every chart on the billboard hot 100 since the date specified
// input: date in YYYY-MM-DD format
// output: none, but writes to a text file specified in the FILE_PATH constant
const fetchFromDay = date => {
  const filestream = newFilestream()
  fetchHot100(date, filestream)
}

// Updates the songs.txt file to include new billboard data
// useful if this file has become outdated
// input: none
// output: none, but writes to a text file specified in the FILE_PATH constant
const updateData = () => {
  // TODO
  // read songs.txt file to find last date
  // call fetchFromDay with that date
}

// Actually call the fetchHot100 function
// fetchAllData()
