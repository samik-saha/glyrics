//Get song information from bop.fm page
function fetchTrackInfo(){
  songName = '';
  album = '';
  firstArtist = '';
  artists = '';
  
  songName = $(".song-info .title").text().trim();
  firstArtist = $(".song-info .artist").text().trim();
  
}