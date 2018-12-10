//Get song information from grooveshark.com page
function fetchTrackInfo(){
  songName = '';
  album = '';
  firstArtist = '';
  artists = $('[class^=PlayerControlsMetadata-container]:first span a:first').text();
  songName = $('[class^=PlayerControlsMetadata-container]:first a:first').text().trim();
  firstArtist = artists.split(",")[0];
}