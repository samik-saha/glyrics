//Get song information from grooveshark.com page
function fetchTrackInfo(){
  songName = '';
  album = '';
  firstArtist = '';
  artists = '';
  
  _track = $("#track_info .track_name").text();
  _album = $("#track_info .album_name").text();
  _artist = $("#artist_name").text();

  if (_track != undefined){
    songName = _track.trim();
  }

  if(_album != undefined){
    album = _album.trim();
  }
  
  if(_artist != undefined){
    firstArtist = _artist.trim();
  }
}