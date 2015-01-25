//Get song information from grooveshark.com page
function fetchTrackInfo(){ 
  var playbackTitle = $('div.playbackTitle');
  
  if (playbackTitle){
	  songName = '';
	  album = '';
	  firstArtist = '';
	  artists = '';
	  
	  playbackTitle = playbackTitle.text().trim();
	  var arr = playbackTitle.split("-");
	  
	  if (arr.length > 1){
		  songName = arr[1].trim();
		  firstArtist = arr[0].trim();
	  }else if (arr.length === 1){
		  songName = arr[0];
	  }
  }
}