//Get song information from Gaana.com page
function fetchTrackInfo(){
  var prevSongName=songName;
  songName = '';
  album = '';
  firstArtist = '';
  artists = '';

  div_trackInfo = document.getElementById('trackInfo');
  
  if (div_trackInfo.children.length == 0){
	  lyricsTextDiv.innerHTML="No track is playing!";
	  return;
  }
  
  //For old interface -- to be removed
  if (div_trackInfo.firstChild.className == "fl songInfo rgtSeprator ellipsis"){	  
	  songName = div_trackInfo.getElementsByTagName('span')[0].innerHTML.trim()
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
  } else {
	  //For Radio Mirchi
	  songNames = div_trackInfo.getElementsByClassName("songName");
	  if (songNames.length > 0){
		  songName = songNames[0].innerText.trim();
		  albumElement = div_trackInfo.getElementsByClassName("albumNamePl");
		  album = (albumElement.length > 0)?albumElement[0].innerText.trim():"";
	  }else {
		  //Gaana.com default
		  songName = div_trackInfo.firstChild.nodeValue.trim();
		  album = div_trackInfo.getElementsByClassName("albumNamePl white pjax")[0].innerText.trim();
	  }
  }
  
  //if song changed
  if (songName != prevSongName){
	  //Look for artist elsewhere in the page
	  extractTracksFromPage();
  }
}


/* 
Although artist name is not displayed, it might be available elsewhere in the page
This function finds all songs listed in the page and extracts the artist for the current song.
*/
function extractTracksFromPage(){
	var allSpans = document.getElementsByTagName("span");
	var songJSON=[];
	
	for (var i=0;i<allSpans.length;i++){
		if(allSpans[i].className.indexOf("sourcelist")>=0){
			songJSON.push(allSpans[i].innerText);
		}
	}
	
	for (var i=0;i<songJSON.length;i++){
		obj = eval("("+songJSON[i]+")");
		if (obj.title.trim()==songName.trim()){
			firstArtist=obj.artist.substring(0,obj.artist.indexOf("###"));
		}
		//console.log(obj.title+":"+obj.artist);
	}
}