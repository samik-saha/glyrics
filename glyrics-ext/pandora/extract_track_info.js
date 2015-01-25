//Get song information from grooveshark.com page
function fetchTrackInfo(){
  songName = '';
  album = '';
  firstArtist = '';
  artists = '';
  
  songName = $("a.playerBarSong").text().trim();
  firstArtist = $("a.playerBarArtist").text().trim();
  
}