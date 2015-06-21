//Get song information from grooveshark.com page
function fetchTrackInfo(){
  songName = '';
  album = '';
  firstArtist = '';
  artists = '';
  
  songName = $('#player-song-title').text().trim();
  firstArtist = $('#player-artist').text().trim();
  
}