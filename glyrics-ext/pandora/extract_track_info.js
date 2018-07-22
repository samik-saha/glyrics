//Get song information from grooveshark.com page
function fetchTrackInfo(){
  songName = '';
  album = '';
  firstArtist = '';
  artists = '';
  
  songName = $(".Tuner__Audio__TrackDetail__title").text().trim();
  firstArtist = $(".Tuner__Audio__TrackDetail__artist").text().trim();
  
}