var action = process.argv[2];
var value = process.argv[3];
var fs = require('fs');
var key = require('./keys.js');
var request = require('request');

var keyList = key.twitterKeys;
// console.log(keyList);
var Twitter = require('twitter');
var client = new Twitter({
	consumer_key: keyList.consumer_key,
	consumer_secret: keyList.consumer_secret,
	access_token_key: keyList.access_token_key,
	access_token_secret: keyList.access_token_secret
});
var spotKeys = key.spotifyKeys;
var Spotify = require('node-spotify-api');
var spotify = new Spotify({
	id: spotKeys.id,
	secret: spotKeys.secret
})



switch (action){
	case 'my-tweets':
		tweets();
		break;
	case 'spotify-this-song':
		mySpotify();
		break;
	case 'movie-this':
		movie();
		break;
	case 'do-what-it-says':
		justDoIt();
		break;
}

function tweets(){
	client.get('statuses/user_timeline', function(error, tweets, response){
		if (error){
			console.log(error);
		}
		else{
		// console.log(JSON.stringify(tweets, null, 2));
		// console.log(response);
		fs.appendFile('log.txt',"\n\n<<<NEW TWITTER SEARCH>>>\n",function(err){
					if(err){
						console.log(err);
					}
				});
			tweets.forEach( function (element) { 

				console.log(element.text);
				console.log(element.created_at);
				console.log('------------------------------');

				var tweetArr = [element.text,element.created_at+'\n'];
			
				fs.appendFile('log.txt',tweetArr,function(err){
					if(err){
						console.log(err);
					}
					// else{
					// 	console.log('Content Added');
					// }
				})
			});
		}
	})
};

function mySpotify(){
	var spotArr = [];
	var content = {type:'track', query:value, limit: 10 };
	if (value == null || value == ""){
			content = {type:'artist,track', query:'Ace of Base, The Sign', limit:10};
		};
	//code to connect with spotify here
	spotify.search(content, function(err,data){
		if (err){
			return console.log(err);
		}
		else{ 
			// console.log(JSON.stringify(data, null, 2));
			data.tracks.items.forEach( function (element) { 
				element.artists.forEach( function (artist) {
					console.log(`ARTIST:  ${artist.name} `);
					spotArr.push(`ARTIST:  ${artist.name} `);
				});
				console.log(`TRACK:  ${element.name} `);
				spotArr.push(`\nTRACK:  ${element.name} `);
				console.log(`PREVIEW URL:  ${element.preview_url} `);
				spotArr.push(`\nPREVIEW URL:  ${element.preview_url} `);
				console.log(`ALBUM:  ${element.album.name} `);
				spotArr.push(`\nALBUM:  ${element.album.name} `);
				console.log("----------------------------------------------------");
				spotArr.push("\n----------------------------------------------------\n");
			});
		}
		var printSpot = spotArr.join('');
		fs.appendFile('log.txt',"\n\n<<<NEW SPOTIFY SEARCH>>>\n"+printSpot,function(err){
			if(err){
			console.log(err);
			}
		});
	});

};

function movie(){
	// code to connect with OMDB here
	var movieArr = [];
	if (value == null || value == ""){
			value = "Mr. Nobody";
		};
	request("http://www.omdbapi.com/?t="+value+"&y=&plot=short&apikey=40e9cece", function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var film = JSON.parse(body);
			// console.log(film);
			console.log(`Title: ${film.Title}`);
			movieArr.push(`Title: ${film.Title}`);
			console.log(`Year: ${film.Year}`);
			movieArr.push(`\nYear: ${film.Year}`);
			console.log(`IMDB Rating: ${film.Ratings[0].Value}`);
			movieArr.push(`\nIMDB Rating: ${film.Ratings[0].Value}`);
			console.log(`Rotten Tomatoes Rating: ${film.Ratings[1].Value}`);
			movieArr.push(`\nRotten Tomatoes Rating: ${film.Ratings[1].Value}`);
			console.log(`Country: ${film.Country}`);
			movieArr.push(`\nCountry: ${film.Country}`);
			console.log(`Language: ${film.Language}`);
			movieArr.push(`\nLanguage: ${film.Language}`);
			console.log(`Plot: ${film.Plot}`);
			movieArr.push(`\nPlot: ${film.Plot}`);
			console.log(`Actors: ${film.Actors}`);
			movieArr.push(`\nActors: ${film.Actors}\n`);
		}
		var printMov = movieArr.join('');
		fs.appendFile('log.txt',"\n\n<<<NEW MOVIE SEARCH>>>\n"+printMov,function(err){
			if(err){
			console.log(err);
			}
		});
	});
}


function justDoIt(){
	//code to run node fs to connect with spotify here 
	fs.readFile('random.txt','utf8',function(error,data){
		if(error){
			return console.log(error);
		}
		var dataArr = data.split(',');
		action = dataArr[0];
		value = dataArr[1];
		console.log(action,value);
		
		switch (action){
			case 'my-tweets':
				tweets();
				break;
			case 'spotify-this-song':
				mySpotify();
				break;
			case 'movie-this':
				movie();
				break;
		};

	})
};
	
