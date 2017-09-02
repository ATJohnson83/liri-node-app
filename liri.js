var action = process.argv[2];
var value = process.argv[3];

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
			tweets.forEach( function (element) { 

				console.log(element.text);
				console.log(element.created_at)
				console.log('------------------------------');
			})
		}
	})
};

function mySpotify(){
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
					});
				console.log(`TRACK:  ${element.name} `);
				console.log(`PREVIEW URL:  ${element.preview_url} `);
				console.log(`ALBUM:  ${element.album.name} `);
				console.log("----------------------------------------------------");
			});
		}
	});
};

function movie(){
	// code to connect with OMDB here
	if (value == null || value == ""){
			value = "Mr. Nobody";
		};
	request("http://www.omdbapi.com/?t="+value+"&y=&plot=short&apikey=40e9cece", function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var film = JSON.parse(body);
			// console.log(film);
			console.log(`Title: ${film.Title}`);
			console.log(`Year: ${film.Year}`);
			console.log(`IMDB Rating: ${film.Ratings[0].Value}`);
			console.log(`Rotten Tomatoes Rating: ${film.Ratings[1].Value}`);
			console.log(`Country: ${film.Country}`);
			console.log(`Language: ${film.Language}`);
			console.log(`Plot: ${film.Plot}`);
			console.log(`Actors: ${film.Actors}`);
		}

	});
}


function justDoIt(){
	//code to run node fs to connect with spotify here 
}
	
