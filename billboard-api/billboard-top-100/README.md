﻿# billboard-top-100
Node.js API to retrieve top songs, albums, and artists from Billboard's charts

[![https://nodei.co/npm/billboard-top-100.png?downloads=true&downloadRank=true&stars=true](https://nodei.co/npm/billboard-top-100.png?downloads=true&downloadRank=true)](https://www.npmjs.com/package/billboard-top-100)

[![Build Status](https://travis-ci.org/darthbatman/billboard-top-100.svg?branch=master)](https://travis-ci.org/darthbatman/billboard-top-100)
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/darthbatman/billboard-top-100)


# install

```
npm install billboard-top-100
```

# example

```js
var billboard = require("billboard-top-100").getChart;

// date defaults to saturday of this week

billboard('hot-100', function(err, songs) {
	if (err) console.log(err);
	console.log(songs); //prints array of top 100 songs
	console.log(songs[3]); //prints song with rank: 4
	console.log(songs[0].title); //prints title of top song
	console.log(songs[0].artist); //prints artist of top songs
	console.log(songs[0].rank) //prints rank of top song (1)
	console.log(songs[0].cover) //prints URL for Billboard cover image of top song
});

// date format YYYY-MM-DD

billboard('hot-100', '2016-08-27', function(err, songs) {
	if (err) console.log(err);
	console.log(songs); //prints array of top 100 songs for week of August 27, 2016
	console.log(songs[3]); //prints song with rank: 4 for week of August 27, 2016
	console.log(songs[0].title); //prints title of top song for week of August 27, 2016
	console.log(songs[0].artist); //prints artist of top songs for week of August 27, 2016
	console.log(songs[0].rank) //prints rank of top song (1) for week of August 27, 2016
	console.log(songs[0].cover) //prints URL for Billboard cover image of top song for week of August 27, 2016
});

// 'all time' chart

billboard('greatest-billboard-200-albums', function(err, songs) {
	if (err) console.log(err);
	console.log(songs); //prints array of top 200 albums
	console.log(songs[3]); //prints album with rank: 4
	console.log(songs[0].title); //prints title of top album
	console.log(songs[0].artist); //prints artist of top songs
	console.log(songs[0].rank) //prints rank of top album (1)
	console.log(songs[0].cover) //prints URL for Billboard cover image of top album
});

// list all available charts

var listCharts = require('billboard-top-100').listCharts;

listCharts(function(err, data) {
	if (err) console.log(err);
	console.log(data); // prints array of all charts
});

```

# api

### listCharts(callback)

Type: `function`

Returns array of chartObjects separated by category

### getChart(chart[, date], callback)

Type: `function`

```chart``` string

```date``` string ('all time' charts will not accept a date)

```callback``` function

Returns array of songs/albums/artists in chart.

### chartObject.chart

Type: `string`

Name of chart.

### chartObject.link

Type: `string`

Location of chart on Billboard website.

### songs

Type: `array`

Song objects.

### songObject.rank

Type: `number`

Rank of song on charts.

### songObject.title

Type: `string`

Title of song.

### songObject.artist

Type: `string`

Name of artist of song.

### songObject.cover

Type: `string`

Cover image URL of song.

### songObject.position

Type: `object`

```Last Week``` string (position of song on chart last week)

```Peak Position``` string (peak position of song on chart)

```Wks on Chart``` string (number of weeks song has been on chart)

Position information of song.


# license

MIT © [Rishi Masand](https://github.com/darthbatman)
