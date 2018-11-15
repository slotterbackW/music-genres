var request = require("request");
var cheerio = require("cheerio");

const baseUrl = "http://www.billboard.com/charts/";

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt){
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

// list all data from requested chart

var getChart = function(chart, date, cb){
	var result;
	if (typeof date === 'function'){
		cb = date;
		date = '';
	}

	var songs = [];

	var titles = [];
	var artists = [];
	var covers = [];
	var ranks = [];
	var positions = [];

	request(baseUrl + chart + "/" + date, function(error, response, html){

			var $ = cheerio.load(html);

      // Fetch number one song
			covers.push(undefined); // top song has no cover image
      $('.chart-number-one__title').each(function(index, item){
          ranks.push('1');
          titles.push(item.children[0].data)
      });
      // chart-number-one__artist
      $('.chart-number-one__artist').each(function(index, item){
        if (item.children[0].data.trim().length > 0) {
          artists.push(item.children[0].data.trim())
        } else {
          artists.push(item.children[1].children[0].data.trim())
        }
      });
      // Fetch song 2 - 100
			$('.chart-list-item__image-wrapper').each(function(index, item){
				var imageSrcAttrib = $(this).children()[1].attribs['data-srcset'];
				if (imageSrcAttrib == undefined) {
					imageSrcAttrib = $(this).children()[2].attribs['data-srcset'];
				}
				var songCover = imageSrcAttrib.split(', ').slice(-1)[0].split(' ')[0];
				covers.push(songCover);
			});

			$('.chart-list-item__title').each(function(index, item){
				var item = $(this).parent().parent().parent().parent()[0].attribs;
				titles.push(item['data-title']);
				artists.push(item['data-artist']);
				ranks.push(item['data-rank']);
			});

			if (titles.length > 1){
				for (var i = 0; i < titles.length; i++){
					var song = {
						"rank": ranks[i],
						"title": titles[i],
						"artist": artists[i],
						"cover": covers[i]
					};
					var positionInfo = positions[i];
					if (positionInfo) {
						song['position'] = positionInfo;
					}
					songs.push(song);

					if (i == titles.length - 1){
						cb (null, songs);
					}

				}
			}
			else {
				cb ("No chart found.", null);
			}

	});

}

// list the available charts

var listCharts = function(cb) {
	request(baseUrl, function(error, response, html) {
		var charts = [];
		if (error) {
			cb(error, null)
			return;
		}
		var $ = cheerio.load(html);

		$('.chart-panel__link').each(function(index, item) {
			var chartObject = {};
			chartObject.chart = toTitleCase($(this)[0].attribs.href.replace('/charts/', '').replace(/-/g, ' '));
			chartObject.link = $(this)[0].attribs.href;
			charts.push(chartObject);
		});

		if (typeof cb === 'function') {
			cb(null, charts);
		}
	});
}

module.exports = {
	getChart,
	listCharts
}
