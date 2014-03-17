chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (request.msgType === "trackInfo"){
    	console.log("lyric request received by window")
		getLyricURL(request.artist, request.title);
    }
  });
  

function getLyricURL(artist,title)
{
	console.log(title);
	$.ajax({
		url: 'http://lyrics.wikia.com/api.php',
		data: {
			artist: artist,
			song: title,
			fmt: 'xml'
		},
		headers: {
			"X-Wikia-API-Key": "90d9b7f2f7e0f57b66f13e5c99b287cfa189bb88"
		},
		dataType: 'xml',
		type: 'GET',
		cache: false,
		complete: function(jqXHR,status){
			//console.log('Status:'+status);
		},
		error: function(jqXHR, textStatus, errorThrown){
			//send error message to content script
			console.log('error')
		},
		success: function(lyricsData, status){
			try 
			{
				// Grab lyrics wikia song url
				var songURL = $(lyricsData).find("url").text();
				
				if(!songURL){
					throw('Could not find a song URL');
				}
			
				var lyrics = $(lyricsData).find("lyrics").text();
				if (lyrics === 'Not found'){
					throw new Error('LYRICS NOT FOUND');
				}
				console.log(songURL);
				document.getElementById('main').innerHTML=songURL;
				getLyricsFromLyricWikiURL(songURL);
			} 
			catch(err) 
			{
				console.log(err.message);
			}
			  
		}
	  
		});
}


function getLyricsFromLyricWikiURL(songURL){
	$.ajax({
	  url: songURL,
	  type: 'GET',
	  complete: function(jqXHR,status){
		//console.log('Status:'+status);
	  },
	  success: function (songData, songStatus) {
		lyrics = getLyricsFromRawHtml(songData);
		if(lyrics.length === 0){
		  throw('No lyrics found');
		} else{
		  document.getElementById('main').innerHTML = lyrics + '<br class="glyrics"><br class="glyrics"><hr class="glyrics">Lyrics provided by <a href="'+songURL+'" target="_blank">LyricWiki</a>.';
		  //document.getElementById('main').innerHTML='Lyrics | ' + lyricTitle + ' <em>by</em> ' + lyricArtist;
		  $.ajax({
			url: 'https://script.google.com/macros/s/AKfycbycwlT-mFbOKhRrYATyA3NlHqSKdePn5NIVaxh-Pv_4ukf2K8lA/exec',
			data: {
			  trackartist: lyricArtist,
			  trackname: lyricTitle,
			  lyricsfound: 'Y'
			},
			type: 'GET'});
		}         
	  }
	});
}


function getLyricsFromRawHtml(data){
	var filter = function(){
	// filters all text nodes and some inline elements out
	return this.nodeType === Node.TEXT_NODE || $(this).is('p, br, i, b, strong, em');
	};
	
	// create a div,
	// append .lyricsbox's direct children to it
	// and filter all unnecessary elements out
	// get the html and remove the div.
	return $('<div>').append($(data).find('.lyricbox').contents().filter(filter)).remove().html();
}