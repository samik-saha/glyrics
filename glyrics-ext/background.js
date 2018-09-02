var glyrics_appid = "paiehomgejkdifojcddmbinmophkibac";
var msgFromTabId;
var trackInfoMessage;
var title;

var hostNames = [
	"gaana.com",
	"www.saavn.com",
	"open.spotify.com",
	"play.raaga.com",
	"soundcloud.com",
	"music.amazon.com",
	"play.google.com",
	"www.earbits.com",
	"earbits.com",
	"www.pandora.com",
	"plex.tv",
	"127.0.0.1",
	"localhost",
	"www.accuradio.com",
	"www.jango.com",
	"deezer.com",
	"8tracks.com",
	"listen.tidal.com",
	"music.wynk.in",
	"music.microsoft.com"
];

/* Create url patterns required to create context menu */
var urlPatterns = hostNames.map(function(host){
	return "*://" + host + "/*";
});

/* Build condition for each hostname */
var conditions = hostNames.map(function(host){
	return new chrome.declarativeContent.PageStateMatcher({
		pageUrl: {hostEquals: host}
	});
});

/* Create rules for showing page action */
var rules = {
	conditions: conditions,
	actions: [ new chrome.declarativeContent.ShowPageAction() ]
};

function iconClicked(tab) {
	//console.log("GLyrics: pageAction clicked");
	/* Get stored user preferences */
	var appWindowChecked = localStorage["appWindow"];

	if (appWindowChecked === 'true') {
		chrome.runtime.sendMessage(glyrics_appid, {
			msgType : "LaunchApp"
		});
	} else {
		chrome.tabs.query({
			active : true,
			currentWindow : true
		}, function(tabs) {
			callContentScript(tab.id, "pageIconClicked", []);
		});
	}

}

function contextMenuOnClicked(info, tab)
{
	if(info.menuItemId === "glyrics-menu"){
		iconClicked(tab);
	}
}

chrome.pageAction.onClicked.addListener(iconClicked);
chrome.runtime.onInstalled.addListener(function(){
	chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
		chrome.declarativeContent.onPageChanged.addRules([ rules ]);
        });
	chrome.contextMenus.create({
		"id":"glyrics-menu",
		"contexts":["all"],
		"title":"Gaana Lyrics",
		"documentUrlPatterns":urlPatterns, 
	});
});
chrome.contextMenus.onClicked.addListener(contextMenuOnClicked);



/* Listen for messages from content scripts */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
	/* function call handler */
	if (request.functionName){
		var target=this[request.functionName];
		if(typeof target === 'function'){
			msgFromTabId = sender.tab.id;
			target.apply(this, request.args);
		}
	}
	/* save and forward track information to app event page */
	else if (request.msgType === "trackInfo") {
		//trackInfoMessage = request;
		chrome.storage.local.set({'trackInfo': request});
		chrome.runtime.sendMessage(glyrics_appid, request);
	}
});


/* Listen for messages from outside like, glyrics app */
chrome.runtime.onMessageExternal.addListener(
	function(request, sender, sendResponse) {
		if (request) {
		if (request.msgType) {
			/*
			* this message is sent by the glyrics app to check if the
	 		* ext is installed
	 		*/
	 		if (request.msgType === "version") {
				console.log("Received msg from App: version; sending response");
				sendResponse({ version : 1.0 });
				chrome.storage.local.get('trackInfo', function(obj){
		  			var trackInfoMessage = obj.trackInfo;
		  			if (trackInfoMessage) {
		    			console.log("Already playing. Sending trackinfo to App.");
	            		chrome.runtime.sendMessage(glyrics_appid, trackInfoMessage);
					}
				});
			}
	    }
		}
	});

function getLyricURL(artist, title) {
	$.ajax({
		url : 'http://lyrics.wikia.com/api.php',
		data : {
			action : 'lyrics',
			artist : artist,
			song : title,
			fmt : 'xml'
	  	},
	headers : {
		"X-Wikia-API-Key" : "90d9b7f2f7e0f57b66f13e5c99b287cfa189bb88"
	},
	dataType : 'xml',
	type : 'GET',
	cache : false,
	complete : function(jqXHR, status) {
		// console.log('Status:'+status);
	},
	error : function(jqXHR, textStatus, errorThrown) {
		// send error message to content script
	  	var pass_data = {
		  'msgType' : 'displayError',
		  'message' : 'An error occurred while searching lyrics for "'
				+ title + '" by "' + artist + '". Please retry.'
		};
		chrome.tabs.sendMessage(msgFromTabId, pass_data);
	},
	success : function(lyricsData, status) {
		try {
			// Grab lyrics wikia song url
			var songURL = $(lyricsData).find("url").text();

			if (!songURL) {
				throw ('Could not find a song URL');
			}

			var lyrics = $(lyricsData).find("lyrics").text();
			if (lyrics === 'Not found') {
				// send error message to content script
				var pass_data = {
					'msgType' : 'displayError',
					'msgAction' : 'searchOnLyricWiki',
					'message' : 'Lyrics not found for "'
					+ title + '" by ' + artist
					+ ' (<a target="_blank" href="https://www.google.com/search?q='
					+ title + ' ' + artist + ' lyrics">Search Google</a>).<br>'
					+ 'Please add lyrics at ' + '<a href="' + songURL.replace(/<[^>]*>?/g, '')
					+ '" target="_blank">LyricWiki</a>.'
				};
				chrome.tabs.sendMessage(msgFromTabId, pass_data);
				throw new Error('LYRICS NOT FOUND');
			}

			getLyricsFromLyricWikiURL(songURL);

		} catch (err) {
			console.log(err.message);
			if (err.message !== 'LYRICS NOT FOUND') {
				// send error message to content script
				var pass_data = {
					'msgType' : 'displayError',
					'message' : 'An error occurred while retrieving lyrics for "'
							+ title
							+ '" by "'
							+ artist
							+ '". Please retry.'
					};
				chrome.tabs.sendMessage(msgFromTabId, pass_data);
			}
		}
	  }
	});
}

function getLyricsFromLyricWikiURL(songURL) {
	$.ajax({
		url : songURL,
		type : 'GET',
		complete : function(jqXHR, status) {
			// console.log('Status:'+status);
		},
		success : function(songData, songStatus) {
			var lyrics = getLyricsFromRawHtml(songData);
			if (lyrics.length === 0) {
				throw ('No lyrics found');
			} else {
				// send lyrics to content script
				var pass_data = {
					'msgType' : 'lyrics',
					'lyrics' : lyrics
					+ '<br class="glyrics"><br class="glyrics"><hr class="glyrics"><span class="courtesy">Lyrics provided by <a href="'
					+ songURL
					+ '" target="_blank">LyricWiki</a>.</span>'
				};
				chrome.tabs.sendMessage(msgFromTabId, pass_data);
			}
		}
	});
}

function getLyricsFromRawHtml(data) {
	var filter = function() {
		// filters all text nodes and some inline elements out
		return this.nodeType === Node.TEXT_NODE
				|| $(this).is('p, br, i, b, strong, em');
	};

	// create a div,
	// append .lyricsbox's direct children to it
	// and filter all unnecessary elements out
	// get the html and remove the div.
	return $('<div>').append(
			$(data).find('.lyricbox').contents().filter(filter)).remove().html();
}

function getSongInfoFromRawHtml(data) {
	return $(data).find('#WikiaPageHeader h1').text();
}

function sendSearchRequest(title) {
	$.ajax({
		url : "http://lyrics.wikia.com/Special:Search",
		data : {
			search : title,
			fulltext : 'Search',
			ns0 : '1'
		},
		type : 'GET',
		complete : function(jqXHR, status) {
			// console.log('searchOnLiricWiki:Status:'+status);
		},
		success : function(resultsPage, songStatus) {
			var i = 0;
			var lwSearchResults = [];

			$(resultsPage).find('li.result').each(
					function(index, element) {
						var articleTitle = $(this).children().children('h1')
								.children('a').text();
						var articleLink = $(this).children().children('h1')
								.children('a').prop('href');

						// If there is a artist name before ':'
						if (articleTitle.indexOf(':') > 0) {
							// Get the song title (part after
							// the colon)
							var songTitle = articleTitle.substr(
									articleTitle.indexOf(':') + 1).trim();

							// if the result contains in
							// original song title
							if (songTitle.toLowerCase().search(
									title.toLowerCase()) !== -1) {
								// create JSON object for each result
								var result = {};
								result.link = articleLink;
								result.title = articleTitle;
								lwSearchResults[i] = result;
								i++;
							}
						}
					});
			callContentScript(msgFromTabId, "displaySearchResults",[lwSearchResults]);
		}
	});
}

function getArtistFromMusicBrainz(title, album) {
	var artist = 'Not Found';
	var query = (!album) ? 'recording:"' + title + '"' : 'recording:"' + title
			+ '" AND release:"' + album + '"';

	$.ajax({
		url : "http://musicbrainz.org/ws/2/recording",
		data : {
			query : query
		},
		type : "GET",
		error : function(jqXHR, textStatus, errorThrown) {
		// send error message to content script
			var pass_data = {
				'msgType' : 'displayError',
				'message' : 'An error occurred while searching artist on MusicBrainz for "'
				 + title + '". Please retry.'
			};
			chrome.tabs.sendMessage(msgFromTabId, pass_data);
			console.log("Error calling MusicBrainz api!");
		},
		success : function(data, status) {
			var artistCredit = $(data).find("artist-credit");
			if (artistCredit.length > 0) {
				artist = artistCredit[0].getElementsByTagName("artist")[0].getElementsByTagName("name")[0].textContent;
				console.log("Artist name retrieved from MusicBrainz: " + artist);
				callContentScript(msgFromTabId, "getLyrics",[artist, title, album]);
			} else {
				console.log("MusicBrainz returned 0 results");
				callContentScript(msgFromTabId, "getLyrics",['Not Found', title, album]);
			}
		}
	});
}

function callContentScript(tabid, targetFunction, args){
	var message = {functionName: targetFunction, args: args};
	chrome.tabs.sendMessage(tabid, message);
}
