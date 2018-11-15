/* The code in this file provides several methods for fetching data from the
  billboard hot-100 list.
  Functions:
    fetchAllData() -> Fetches every chart on the billboard hot 100 since August 9th, 1958
    fetchFromDay(date) -> Fetches every chart on the billboard hot 100 since the date specified
    fetchSpecificDate(date) -> Fetches a single chart for the specified date
    updateData() -> Updates the songs.txt file to include new billboard data (TODO)
*/

// REQUIRED LIBRARIES
/*
  Library used to gather results from the billboard hot 100.
  Fetches the actual html for each chart and scrapes the data on that page.
  Forked from https://github.com/darthbatman/billboard-top-100
*/
const Billboard = require("./billboard-top-100/billboard-top-100")
/*
  Javascript Library used for dealing with dates. Useful since we want to fetch
  the billboard chart from every week since 1958.
  https://momentjs.com/
*/
const moment = require("moment")
/*
  Used to access the filesystem to read and write files
*/
const fs = require("fs")

// CONSTANTS:
// Earliest day Billboard charts are available
const STARTING_DAY = '1958-08-09'
// Output path to write resulting file to
const OUTPUT_PATH ='./../data/songs.txt'
// Character to divide results on
const DELIMITER = '|'

// A convenience method to add one week to a date
// input: date
// output: date in YYYY-MM-DD format
const addOneWeek = date => moment(date).add(7, 'days').format('YYYY-MM-DD')

// Number of times we've tried to fetch a specific chart. Used in fetchHot100()
let numTries = 0
// List of weeks we couldn't fetch. Used in fetchHot100FromDate()
let missedWeeks = []

// Fetches the billboard hot 100 chart for the date specified
// and writes it to the supplied filestream.
// Used in the fetchSpecificDate function
// input: Date in YYYY-MM-DD format, Filestream object
// output: None, but writes to filestream
const fetchHot100 = (date, filestream) => {
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
          console.log(`Failed to fetch songs for ${date}`)
        }
      // Otherwise the songs for this week were successfully fetched
      } else {
        console.log(`Songs for ${date} fetched!`)
        numTries = 0
        // Write each song to the file at OUTPUT_PATH
        songs.forEach(song => {
          let line = `${date}${DELIMITER}${song.title}${DELIMITER}${song.artist}${DELIMITER}${song.rank}`
          filestream.write(line + "\n")
        })
        console.log(`Songs for ${date} successfully written!`)
        // close the file stream
        filestream.end()
      }
    })
  } else {
    console.log('Charts don\'t exist for dates in the future!')
  }
}

// Fetches the top 100 files from a given date all the way up until today
// and writes those songs to a filestream
// input: date in YYYY-MM-DD format
// output: list of songs as a JSON string
const fetchHot100FromDate = (date, filestream) => {
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
          fetchHot100FromDate(addOneWeek(date), filestream)
        }
      // Otherwise the songs for this week were successfully fetched
      } else {
        console.log(`Songs for ${date} fetched!`)
        numTries = 0
        // Write each song to the file at OUTPUT_PATH
        songs.forEach(song => {
          let line = `${date}${DELIMITER}${song.title}${DELIMITER}${song.artist}${DELIMITER}${song.rank}`
          filestream.write(line + "\n")
        })
        console.log(`Songs for ${date} successfully written!`)
        // call fetchHot100 with next week
        fetchHot100FromDate(addOneWeek(date), filestream)
      }
    })
  } else {
    // close the file stream
    filestream.end()
    console.log(`${OUTPUT_PATH} successfully written!`)
    // Log any weeks which couldn't be fetched
    console.log('Number of missed weeks', missedWeeks.length, 'Dates:', missedWeeks)
  }
}

// A convenience method to create a new filestream for writing
// input: none
// output: filestream
const newFilestream = () => fs.createWriteStream(OUTPUT_PATH, {flags:'a'})

// Fetches every chart on the billboard hot 100 since August 9th, 1958
// input: none
// output: none, but writes to a text file specified in the OUTPUT_PATH constant
const fetchAllData = () => {
  const filestream = newFilestream()
  filestream.write(`Date${DELIMITER}Title${DELIMITER}Artist${DELIMITER}Rank\n`)
  fetchHot100FromDate(STARTING_DAY, filestream)
}

// Fetches every chart on the billboard hot 100 since the date specified
// input: date in YYYY-MM-DD format
// output: none, but writes to a text file specified in the OUTPUT_PATH constant
const fetchFromDay = date => {
  const filestream = newFilestream()
  fetchHot100FromDate(date, filestream)
}

// Fetches a chart on the billboard for the specified date
// input: date in YYYY-MM-DD format
// output: none, but writes to a text file specified in the OUTPUT_PATH constant
const fetchSpecificDate = date => {
  const filestream = newFilestream()
  fetchHot100(date, filestream)
}

// Updates the songs.txt file to include new billboard data.
// Useful if this file has become outdated
// input: none
// output: none, but writes to a text file specified in the OUTPUT_PATH constant
const updateData = () => {
  // TODO
  // read songs.txt file to find last date
  // call fetchFromDay with that date
}

// Actually call the fetchHot100 function
// NOTE: UNCOMMENT THIS TO RUN THE PROGRAM
// fetchAllData()
fetchFromDay('1990-10-20')
