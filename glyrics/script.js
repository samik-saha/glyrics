window.isLyricWindowVisible = false;

/* Set Up a Message Listener */
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
	if (request.message === "ShowLyrics"){
	  //console.log("Lyrics button clicked. Message received by content script!");
	  themeClass = request.themeClass;
	  fontClass = request.fontClass;
	  if(isLyricWindowVisible) closeLyricsWindow();
	  showLyrics();
	}
	else if (request.msgType === "songURL"){
		getLyricsFromLyricWikiURL(request.url);
		lyricArtist = firstArtist;
		lyricTitle = songName;
		
	}
	else if (request.msgType === "displayError"){
		lyricsTextDiv.innerHTML = request.message;
		if (request.msgAction == 'searchOnLyricWiki'){
			searchOnLiricWiki(songName);
		}
	}
  });

function showLyrics(){
	window.trackChangeInterval = setInterval(function(){checkTrackChange();},3000);
  
  	isLyricWindowVisible = true;

  	window.songName = '';
  	window.album = '';
  	window.firstArtist = '';
  	window.artists = '';
  	window.lwSearchResults = [];
  	window.lyricArtist = ''; //Arist of displayed lyric
  	window.lyricTitle = ''; //Title of the displayed lyric
  
  	window.style=document.createElement("link");
  	style.setAttribute("rel","stylesheet");
  	style.setAttribute("type", "text/css");
  	if(themeClass === "theme-orange"){
		style.setAttribute("href",chrome.extension.getURL("css/theme-orange.css"));
	}
	else{
		style.setAttribute("href",chrome.extension.getURL("css/lyrics.css"));
	}
	document.body.appendChild(style);

  //Add a lyrics component in Gaana.com page
  window.div=document.getElementById('lyrics-container');
  if (!div) {
	div=document.createElement('div');
	div.setAttribute('id','lyrics-container');
	  
	window.topBar = document.createElement('div');
	topBar.setAttribute('id','lyrics-topbar');
	topBar.innerHTML='\
	  <table id="lyrics-header-tb">\
		<tbody>\
		  <tr>\
			<td id="lyrics-header">Lyrics</td>\
			<td class="glyrics-btn">\
			  <img id="lyrics-reload-btn" class="glyrics-btn-img"></td>\
			<td class="glyrics-btn">\
			  <img id="lyrics-close-btn" class="glyrics-btn-img">\
			</td>\
		  </tr>\
		</tbody>\
	  </table>';
	div.appendChild(topBar);
	
	window.lyricsTextDiv = document.createElement('div');
	lyricsTextDiv.setAttribute('id', 'lyrics-text');
	lyricsTextDiv.setAttribute('class', fontClass);
	div.appendChild(lyricsTextDiv);
	lyricsTextDiv.innerHTML='Hi there! Try playing a song!';
	
	document.body.appendChild(div);
	
	//set initial size
	div.style.height='500px';
	div.style.width='330px';

	//setup drag listener
	topBar.addEventListener('mousedown', mouseDown, false);
	window.addEventListener('mouseup', mouseUp, false);
	
	reloadBtn = document.getElementById("lyrics-reload-btn");
	reloadBtn.addEventListener('click', reload,false);
	
	lyricsCloseBtn=document.getElementById("lyrics-close-btn");
	lyricsCloseBtn.addEventListener('click', closeLyricsWindow, false);
	
	window.lyricsHeader=document.getElementById("lyrics-header");
	
	document.getElementById("lyrics-close-btn").src=chrome.extension.getURL("images/Close-16.png");
	document.getElementById("lyrics-reload-btn").src=chrome.extension.getURL("images/Refresh-16.png");
	
	$(function() {
	  $( "#lyrics-container" ).resizable();
	});
	
  } 
  
  //reposition lyrics window
  div.style.position = 'fixed';
  div.style.left='auto';
  div.style.top = (window.innerHeight / 6)+'px';
  div.style.right =(window.innerWidth / 6)+'px';
}

function mouseUp()
{
  window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e){
  e.preventDefault();
  window.mouseX = e.clientX - div.offsetLeft;
  window.mouseY = e.clientY - div.offsetTop;
  window.addEventListener('mousemove', divMove, true);
}

function divMove(e){
  div.style.position = 'fixed';
  div.style.top = (e.clientY - window.mouseY) + 'px';
  div.style.left = (e.clientX - window.mouseX) + 'px';
  
  if (div.offsetTop < 0) div.style.top=0;
  if (div.offsetLeft < 0 ) div.style.left=0;
  
}

function checkTrackChange(){
  prevSongName=songName;
  fetchTrackInfo();
  if (songName !== prevSongName){
	console.log('GLyrics:: detected track change!');
	lyricsHeader.innerHTML="Lyrics | " + songName;
	getLyrics(firstArtist,songName,album);
  }
}

function closeLyricsWindow(){
  window.clearInterval(trackChangeInterval);
  lyricsCloseBtn.removeEventListener('click', closeLyricsWindow, false);
  reloadBtn.removeEventListener('click', reload, false);
  div.remove();
  style.remove();
  isLyricWindowVisible=false;
}

function searchOnLiricWiki(title){
	searchElement = document.createElement('div');
	lyricsTextDiv.innerHTML = lyricsTextDiv.innerHTML + '<br><br><b>Possible Matches:</b>';
	lyricsTextDiv.appendChild(searchElement);
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

function getLyrics(artist, title, album) {
	var lyrics;
	
	//check if title is present
	if (!title){
	lyricsTextDiv.innerHTML='Song title is missing. Cannot search for lyrics.';
	return;
	}
	
	//If artist is missing try to get artist name from MusicBrainz
	if (!artist){
	  lyricsTextDiv.innerHTML = 'Artist is missing! Searching for Artist Name on MusicBrainz...';
	  getArtistFromMusicBrainz(title, album);
	  return;
	}
	
	//Artist could not be retrieved from MusicBrainz as well
	if (artist === 'Not Found'){
		lyricsTextDiv.innerHTML='Artist not found! Cannot locate lyrics for <b>'+title+'</b>\
		  (<a target="_blank" href="https://www.google.com/search?q='+title+' lyrics"><u>Search Google</u></a>).';
		  searchOnLiricWiki(title);
		return;
	}  
	
	lyricsHeader.innerHTML="Lyrics | " + title + ' <em>by</em> ' + artist;
	lyricsTextDiv.innerHTML='Searching lyrics for "'+title+'" by "' + artist + '" ...';
	
	//send a request to extension for getting the lyrics page URL
	pass_data={
		'msgType':'lyricRequest',
		'artist':artist,
		'title':title,
	};
	chrome.runtime.sendMessage(pass_data);
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
		  lyricsTextDiv.innerHTML = lyrics + '<br class="glyrics"><br class="glyrics"><hr class="glyrics">Lyrics provided by <a href="'+songURL+'" target="_blank">LyricWiki</a>.';
		  lyricsHeader.innerHTML='Lyrics | ' + lyricTitle + ' <em>by</em> ' + lyricArtist;
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
			lyricsTextDiv.innerHTML = 'An error occurred while searching artist on MusicBrainz for "'+title+'". Please retry.';
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

function getSongInfoFromRawHtml(data){
	return $(data).find('#WikiaPageHeader h1').text();
}


function reload(){
	songName="";
	fetchTrackInfo();
	getLyrics(firstArtist, songName, album);
}