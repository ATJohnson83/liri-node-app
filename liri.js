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
		console.log(JSON.stringify(tweets, null, 2));
		// console.log(response);
		}
	})
};

function mySpotify(){
	//code to connect with spotify here
	spotify.search({type:'track', query:value}, function(err,data){
		if (err){
			return console.log(err);
		}
		else{
			console.log(JSON.stringify(data, null, 2));
		}
	});
};

function movie(){
	// code to connect with OMDB here
	request("http://www.omdbapi.com/?t="+value+"&y=&plot=short&apikey=40e9cece", function(error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log(JSON.parse(body));
		}
	});
}


function justDoIt(){
	//code to run node fs to connect with spotify here 
}
	
