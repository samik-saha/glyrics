//Get song information from grooveshark.com page
function fetchTrackInfo(){
  songName = '';
  album = '';
  firstArtist = '';
  artists = '';
  
  songName = $("div.track-name").first().text().trim();
  firstArtist = $("div.artist-name").first().text().trim();
  
}