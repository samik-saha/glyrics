//Get song information from grooveshark.com page
function fetchTrackInfo(){ 
  var playbackTitle = $('a.playbackSoundBadge__title').attr('title').trim();
  
  if (playbackTitle){
	  songName = '';
	  album = '';
	  firstArtist = '';
	  artists = '';

	  var arr = playbackTitle.split("-");
	  
	  if (arr.length > 1){
		  songName = arr[1].trim();
		  firstArtist = arr[0].trim();
	  }else if (arr.length === 1){
		  songName = arr[0];
	  }
  }
}