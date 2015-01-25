//Get song information from www.raaga.com page
function fetchTrackInfo(){
  songName = '';
  album = '';
  firstArtist = '';
  artists = '';
  
  songName = $(".player_track_title").text();
  firstArtist = $(".album_title:first").children(":last").text();
  
}