//Get song information from grooveshark.com page
function fetchTrackInfo(){
  songName = '';
  album = '';
  firstArtist = '';
  artists = '';
  
  songName = $('#currently-playing-title').text().trim();
  firstArtist = $('#player-artist').text().trim();
  
}