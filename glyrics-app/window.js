var extId = "indphkjgcbdoaigcjlaaokkfllleolli";
var hasExtension = false;
var requiredVersion = 1.0;
var mainView = null;
var header;
var headerTitle;
var headerArtist;


window.onload=function(){
    mainView = document.getElementById('main');
    header = document.getElementById("header");
};



chrome.runtime.sendMessage(extId, { msgType: "version" },
    function (reply) {
        if (reply) {
            if (reply.version) {
                if (reply.version >= requiredVersion) {
                    hasExtension = true;
                    document.getElementById('ext-note').remove();
                }
            }
        }
    });

chrome.runtime.onMessageExternal.addListener(
  function(request, sender, sendResponse) {
    if (request.msgType === "trackInfo"){
    	console.log("lyric request received by window");
    	header.innerHTML = '<h2>' + request.title + '</h2>' +
    	                   '<h4>' + request.artist + '</h4>';
		getLyrics(request.artist, request.title, request.album);
    }
  });


function getLyrics(artist, title, album)
{
    /* check if title is present */
    if (!title){
        mainView.innerHTML='Song title is missing. Cannot search for lyrics.';
        return;
    }

    /* If artist is missing try to get artist name from MusicBrainz */
    if (!artist){
        mainView.innerHTML = 'Artist is missing! Searching for Artist Name on MusicBrainz...';
        getArtistFromMusicBrainz(title, album);
        /* the above method will call getLyrics() again after search on MusicBrainz is complere */
        return;
    }

    /* Artist could not be retrieved from MusicBrainz as well */
    if (artist === 'Not Found'){
        mainView.innerHTML='Artist not found! Cannot locate lyrics for <b>'+title+'</b>\
            (<a target="_blank" href="https://www.google.com/search?q='+title+' lyrics"><u>Search Google</u></a>).';
            searchOnLiricWiki(title);
        return;
    }

    mainView.innerHTML = "Searching lyrics for "+title+" by " + artist+"...";
    getURLFromLyricWiki(artist, title);


}

function getURLFromLyricWiki(artist, title){
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
            console.log('error');
            mainView.innerHTML='An error occurred while retrieving lyrics for "'+title+'" by "'+artist+'". Please retry.';
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
                    mainView.innerHTML = 'Lyrics not found for <b>'+title+'</b> by <b>'+artist+'</b>\
                            (<a target="_blank" href="https://www.google.com/search?q='+title+' '+artist+' lyrics"><u>Search Google</u></a>).\
                            <br>'+
                            'Please add lyrics at '+ '<a href="'+songURL+'" target="_blank"><u>LyricWiki</u></a>.'
                    searchOnLiricWiki(title);
                    throw new Error('LYRICS NOT FOUND');
                }
                console.log(songURL);
                getLyricsFromLyricWikiURL(songURL);
            }
            catch(err)
            {
                if (err.message != 'LYRICS NOT FOUND'){
                    document.getElementById('main').innerHTML='An error occurred while retrieving lyrics for "'+title+'" by "'+artist+'". Please retry.';
                }
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


function searchOnLiricWiki(title){
    searchElement = document.createElement('div');
    mainView.innerHTML = mainView.innerHTML + '<br><br><b>Possible Matches:</b>';
    mainView.appendChild(searchElement);
    searchElement.innerHTML = 'Searching with "'+title+'" ...';

    $.ajax({
        url: "http://lyrics.wikia.com/Special:Search",
        data: {
            search: title,
            fulltext: 'Search',
            ns0: '1'
        },
        type: 'GET',
        complete: function(jqXHR,status){
            //console.log('searchOnLiricWiki:Status:'+status);
        },
        success: function (resultsPage, songStatus) {
            i=0;
            lwSearchResults = [];
            $(resultsPage).find('li.result').each(function(index,element){
                articleTitle=$(this).children().children('h1').children('a').text();
                articleLink=$(this).children().children('h1').children('a').prop('href');

                //If there is a artist name before ':'
                if (articleTitle.indexOf(':') > 0){
                    //Get the song title (part after the colon)
                    songTitle = articleTitle.substr(articleTitle.indexOf(':') + 1).trim();

                    //if the result contains in original song title
                    if (songTitle.toLowerCase().search(title.toLowerCase()) !== -1){
                        //create <a> element containing the result
                        result=document.createElement('a');
                        result.setAttribute('href',articleLink);
                        result.setAttribute('target','_blank');
                        result.innerHTML=articleTitle;
                        lwSearchResults[i] = result;
                        i++;
                        result.onclick=function(){
                            //do not follow the link
                            event.returnValue=false;
                            //Set lyricArtist and lyricTitle to be displayed on header
                            elementText = event.srcElement.innerText;
                            lyricArtist = elementText.substr(0,elementText.indexOf(':'));
                            lyricTitle = elementText.substr(elementText.indexOf(':')+1);
                            getLyricsFromLyricWikiURL(event.srcElement.getAttribute('href'));
                        };
                    }
                }

            });


            if (lwSearchResults.length === 0){
                searchElement.innerHTML = 'No match found for "' + title +'".';
            }
            else{
                searchElement.innerHTML='';
                ol=document.createElement('ol');
                searchElement.appendChild(ol);
                for (i = 0; i < lwSearchResults.length; i++){
                    li=document.createElement('li');
                    li.appendChild(lwSearchResults[i]);
                    ol.appendChild(li);
                }
            }

            //If only one result returned and the song title matches exactly, then fetch lyrics from the page immediately
            /*
            if (lwSearchResults.length == 1 && lwSearchResults[0].innerHTML.substr(lwSearchResults[0].innerHTML.indexOf(':')+1).trim().toLowerCase() === title.toLowerCase()){
                //Set lyricArtist and lyricTitle to be displayed on header
                elementText = lwSearchResults[0].innerHTML;
                lyricArtist = elementText.substr(0,elementText.indexOf(':'));
                lyricTitle = elementText.substr(elementText.indexOf(':')+1);

                getLyricsFromLyricWikiURL(lwSearchResults[0].getAttribute('href'));
            }
            */

        }
        });
}

function getArtistFromMusicBrainz(title, album){
    var artist='Not Found';
    query = (!album)?'recording:"'+title+'"':'recording:"'+title+'" AND release:"'+album+'"';

    $.ajax({
        url: "http://musicbrainz.org/ws/2/recording",
        data: {
            query: query
        },
        type: "GET",
        error: function(jqXHR, textStatus, errorThrown){
            console.log("Error calling MusicBrainz api!");
            mainView.innerHTML = 'An error occurred while searching artist on MusicBrainz for "'+title+'". Please retry.';
        },
        success: function(data, status){
            artistCredit = $(data).find("artist-credit");
            if(artistCredit.length > 0){
                artist=artistCredit[0].getElementsByTagName("artist")[0].getElementsByTagName("name")[0].textContent;
                console.log("Artist name retrieved from MusicBrainz: "+artist);
                getLyrics(artist, title, album);
            }else{
                console.log("MusicBrainz returned 0 results");
                getLyrics('Not Found', title, album);
            }
        }

    });
}