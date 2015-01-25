//Get song information from play.spotify.com page
function fetchTrackInfo(){
  songName = '';
  album = '';
  firstArtist = '';
  artists = '';

  trackName = $('#app-player').contents().find('#track-name a:first').text().trim();
  trackArtist = $('#app-player').contents().find('#track-artist a:first').text().trim();
  
  songName = trackName;
  firstArtist = trackArtist;
}
