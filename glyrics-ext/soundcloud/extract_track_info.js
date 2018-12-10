//Get song information from grooveshark.com page
function fetchTrackInfo(){ 
  var playbackTitle = $('.playbackSoundBadge__title a').attr('title');
  var playbackArtist = $('.playbackSoundBadge__lightLink').attr('title');
  
  if (playbackTitle){
	  songName = '';
	  album = '';
	  firstArtist = '';
	  artists = '';

	  /* SoundClould titles are generally of the format "artist - track".
	  Lets split them */
	  var arr = playbackTitle.split("-");
	  
	  if (arr.length > 1) {
		  /* Sometimes the title will have additional text inside "[]". 
		  Lets remove it and finally trim it of spaces*/
		  songName = arr[1].replace(/\[.*\]/g, "").trim();

		  /* Remove any prefix with the format "text:" from artist name */
		  firstArtist = arr[0].replace(/^.*:/g, "")
		                      .replace(/\(.*\)/g, "").trim();
	  } else if (arr.length === 1){
		  songName = arr[0];
		  firstArtist=playbackArtist;
	  }
  }
}