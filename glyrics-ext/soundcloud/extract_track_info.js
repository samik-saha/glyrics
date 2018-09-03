//Get song information from grooveshark.com page
function fetchTrackInfo(){ 
  var playbackTitle = $('.playbackSoundBadge__title a').attr('title');
  var playbackArtist = $('.playbackSoundBadge__lightLink').attr('title');
  
  if (playbackTitle){
	  songName = '';
	  album = '';
	  firstArtist = '';
	  artists = '';

	  var arr = playbackTitle.split("-");
	  
	  if (arr.length > 1) {
		  songName = arr[1].trim();
		  firstArtist = arr[0].trim();
	  } else if (arr.length === 1){
		  songName = arr[0];
		  firstArtist=playbackArtist;
	  }
  }
}