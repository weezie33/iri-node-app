require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var axios = require("axios");
var moment = require("moment");
var fs = require("fs");
var inputString = process.argv;
var choice = inputString[2];
var userInput = process.argv[3];
var searchedWord = ""; //this is what the user searched for

//this grabs everything after "node fileName". ex: "node filename this song has space" it"ll store "this song has space"
for (var i = 3; i < inputString.length; i++) {
  if (i > 3 && i < userInput.length) {
    searchedWord = `${searchedWord} ${userInput[i]}`;
  } else {
    searchedWord += userInput[i];
  }
};

////variables for input/////
if (choice === "concert-this") {
    concertThis(userInput);
} else if (choice === "spotify-this-song") {
	spotifyThis(userInput);
} else if (choice === "movie-this") {
	movieThis(userInput);
} else if (choice === "do-what-it-says") {
	whatToDo();
} else {
	console.log("Try again: \nconcert-this \nspotify-this-song \nmovie-this \ndo-what-it-says");
};

///concert spotify this/////
function concertThis(artist) {
  let qURL = `https://rest.bandsintown.com/artists/${artist}/events?app_id=codingbootcamp`;
  axios
    .get(qURL)
    .then(res => {
      let info = res.data[0];
      console.log(info);

      console.log(
        `band ${info.venue.name} will be in ${info.venue.city}, ${
          info.venue.region
        }. The event is going to be on ${moment(info.datetime).format("L")}`
      );
    })
    .catch(err => {
      throw err;
    });
};

///artitst spotify this/////
var artistName = function(artist){
	return artist.name;
};
function spotifyThis(songName) {
	if (songName === undefined){
		songName = "The Sign";
        artistName = "Ace of Base";
	}
	spotify.search({type: "track", query: songName }, function(err, data) {
	    if (err) {
	        console.log("Error occurred: " + err);
	        return;
	    }
	 	//debugger; //used to find out what"s inside data in the iron-node console

	    var songs = data.tracks.items;

	    for(var i = 0; i < songs.length; i++){
	    	console.log(i);
	    	console.log("Artist(s): " + songs[i].artists.map(artistName));
	    	console.log("Song Name: " + songs[i].name);
	    	console.log("Preview Song: " + songs[i].preview_url);
	    	console.log("Album: " + songs[i].album.name);
	    	console.log("\n-------------\n");
	    }
	});
};


////search movies////
function movieThis(movie) {
  let qURL = `https://www.omdbapi.com/?t=${movie}&apikey=trilogy&plot=short&r=json`;

  axios.get(qURL).then(res => {
    let info = res.data;

    console.log(`
    Found results for ${info.Title}, which was released in ${
      info.Year
    }. IMDB rated it ${info.imdbRating}/10, while Rotten Tomatoes rated it ${
      info.Ratings[1].Value
    }. ${info.Title} was released to ${info.Country}, and offers in ${
      info.Language.length > 1 ? "mutiple languages" : "one language"
    }, them being ${info.Language}. A summery for ${info.Title} is ${
      info.Plot
    } The movie has many great actors and actresses, such as ${info.Actors}.
    `);
  });
};

function whatToDo() {
  fs.readFile("random.txt", "utf8", (err, string) => {
    if (err) throw err;

    let stringArr = string.split(",");
    let command = stringArr[0];
    let search = stringArr[1];

    switch (command) {
      case "concert-this":
        searchConcert(search);
        break;
      case "spotify-this-song":
        spotifyThis(search);
        break;
      case "movie-this":
        movieThis(search);
        break;
      default:
        console.log("can't read it");
        break;
    }
  });
};

switch (arguments[2]) {
  case "concert-this":
    searchConcert(searchedWord);
    break;
  case "spotify-this-song":
    searchSong(searchedWord);
    break;
  case "movie-this":
    searchMovie(searchedWord);
    break;
  case "do-what-it-says":
    do_what_it_says();
    break;
  default:
    console.log(`Try again`);
    break;
}