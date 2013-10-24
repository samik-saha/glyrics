chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.message == "ShowLyrics"){
	  //console.log("Lyrics button clicked. Message received by content script!");
      showLyrics();
	}
  });
  
  
function showLyrics(){
  window.trackChangeInterval = setInterval(function(){checkTrackChange();},3000);

  window.songName = '';
  window.album = '';
  window.firstArtist = '';
  window.artists = '';
  window.lwSearchResults = [];

  //Add a lyrics component in Gaana.com page
  window.div=document.getElementById('lyrics-container');
  if (!div) {
  	div=document.createElement('div');
  	div.setAttribute('id','lyrics-container');
	  
  	window.topBar = document.createElement('div');
  	topBar.setAttribute('id','lyrics-topbar');
  	topBar.innerHTML='\
	  <table style="width:100%;height:20px;">\
	    <tbody>\
		  <tr>\
		    <td id="lyrics-header">Lyrics</td>\
			<td style="width:20px; min-width:20px; max-width:20px; text-align:right;">\
			  <img id="lyrics-reload-btn"></td>\
			<td style="width:20px; min-width:20px; max-width:20px; text-align:right;">\
			  <img id="lyrics-close-btn">\
			</td>\
	      </tr>\
		</tbody>\
      </table>';
  	div.appendChild(topBar);
 	
 	window.lyricsTextDiv = document.createElement('div');
    lyricsTextDiv.setAttribute('id', 'lyrics-text');
    div.appendChild(lyricsTextDiv);
	lyricsTextDiv.innerHTML='Loading...'
	
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
	
	document.getElementById("lyrics-close-btn").src=chrome.extension.getURL("Close-16.png");
	document.getElementById("lyrics-reload-btn").src=chrome.extension.getURL("Refresh-16.png");
	
	$(function() {
      $( "#lyrics-container" ).resizable();
	});
  } 
  
  checkTrackChange();
  
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


//Get song information from Gaana.com page
function fetchTrackInfo(){
  songName = '';
  album = '';
  firstArtist = '';
  artists = '';

  div_trackInfo = document.getElementById('trackInfo');
  
  //For old interface
  if (div_trackInfo.firstChild.className === "fl songInfo rgtSeprator ellipsis"){	  
	  songName = div_trackInfo.getElementsByTagName('span')[0].innerHTML.trim()
  } else {
  	songName = div_trackInfo.firstChild.nodeValue;
  }
  a_elements = div_trackInfo.getElementsByTagName('*');
  for (i = 0; i < a_elements.length; i++) {
	a = a_elements[i];
	if (a.className == 'albumNamePl') album = a.innerHTML.trim();
	if (a.className == 'artistName'){
		artists = artists + a.innerHTML.trim() + ",";
	}
  }
  firstArtist = artists.substr(0, artists.indexOf(',')).trim();
  artists = artists.substr(0, artists.length - 1);
}

function checkTrackChange(){
  prevSongName=songName;
  fetchTrackInfo();
  if (songName != prevSongName){
    console.log('Track Change!');
	lyricsHeader.innerHTML="Lyrics | "+songName;
	getLyrics(firstArtist,songName);
  }
}


function closeLyricsWindow(){
  window.clearInterval(trackChangeInterval);
  lyricsCloseBtn.removeEventListener('click', closeLyricsWindow, false);
  reloadBtn.removeEventListener('click', reload, false);
  div.remove();
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

				//Get the song title (part after the colon)
				songTitle = articleTitle.substr(articleTitle.indexOf(':') + 1).trim();
				
				
				if (songTitle.toLowerCase().search(title.toLowerCase()) != -1){
					//create <a> element containing the result
					result=document.createElement('a');
					result.setAttribute('href',articleLink);
					result.setAttribute('target','_blank');
					result.innerHTML=articleTitle;
					lwSearchResults[i] = result;
					i++;
					result.onclick=function(){
					  event.returnValue=false;
					  getLyricsFromLyricWikiURL(event.srcElement.getAttribute('href'));
					};
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
			
			if (lwSearchResults.length === 1 && lwSearchResults[0].innerHTML.substr(lwSearchResults[0].innerHTML.indexOf(':')+1).trim().toLowerCase() === title.toLowerCase()){
			  	getLyricsFromLyricWikiURL(lwSearchResults[0].getAttribute('href'));
			}
           
          }
        });
}


function getLyrics(artist,title) {
  var lyrics;
  cache = (typeof cache === 'undefined')?true:cache;

  //check if artist and title are present
  if (!title){
   lyricsTextDiv.innerHTML='Song title is missing. Cannot search for lyrics.';
   return;
  }
  else if (!artist){
    lyricsTextDiv.innerHTML='Artist is missing! Cannot locate lyrics for <b>'+title+'</b>\
		(<a target="_blank" href="https://www.google.com/search?q='+title+' lyrics"><u>Search Google</u></a>).';
	searchOnLiricWiki(title)
	return;
  }
  else{
	lyricsTextDiv.innerHTML='Searching lyrics for "'+title+'" by "' + artist + '" ...';
  }
  
  $.ajax({
    url: 'http://lyrics.wikia.com/api.php',
    data: {
      artist: artist,
      song: title,
	  fmt: 'xml'
    },
    dataType: 'xml',
    type: 'GET',
	cache: false,
	complete: function(jqXHR,status){
	   //console.log('Status:'+status);
	},
	error: function(jqXHR, textStatus, errorThrown){
		lyricsTextDiv.innerHTML = 'An error occurred while searching lyrics for "'+title+'" by "'+artist+'". Please retry.';
	},
    success: function(lyricsData, status){
      try {
        // Grab lyrics wikia song url
        var songURL = $(lyricsData).find("url").text();
		
        if(!songURL){
          throw('Could not find a song URL');
        }

		var lyrics = $(lyricsData).find("lyrics").text();
		if (lyrics === 'Not found'){
		  lyricsTextDiv.innerHTML = 'Lyrics not found for <b>'+title+'</b> by <b>'+artist+'</b>\
		  (<a target="_blank" href="https://www.google.com/search?q='+title+' '+artist+' lyrics"><u>Search Google</u></a>).\
		  <br>'+
		  'Please add lyrics at '+ '<a href="'+songURL+'" target="_blank"><u>LyricWiki</u></a>.';
		  
		  searchOnLiricWiki(title);
		  
		  throw new Error('Lyrics not found');
		}
		
		getLyricsFromLyricWikiURL(songURL)

      } catch(err) {
		  console.log(err.message);
		  if (err.message != 'Lyrics not found'){
			lyricsTextDiv.innerHTML = 'An error occurred while retrieving lyrics for "'+title+'" by "'+artist+'". Please retry.';
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
		  lyricsTextDiv.innerHTML = lyrics + '<br><br><hr>Lyrics provided by <a href="'+songURL+'" target="_blank">LyricWiki</a>.';
		  
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

function getSongInfoFromRawHtml(data){
  return $(data).find('#WikiaPageHeader h1').text();
}


function reload(){
  getLyrics(firstArtist,songName);
}