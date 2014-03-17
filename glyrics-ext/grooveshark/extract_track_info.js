//Get song information from grooveshark.com page
function fetchTrackInfo(){
  songName = '';
  album = '';
  firstArtist = '';
  artists = '';
  
  songName = $('a.now-playing-link.song').text();
  firstArtist = $('a.now-playing-link.artist').text();
  
}