//Get song information from grooveshark.com page
function fetchTrackInfo(){
  songName = '';
  album = '';
  firstArtist = '';
  artists = '';
  
  songName = $('#playerSongTitle').text().trim();
  firstArtist = $('#player-artist').text().trim();
  
}