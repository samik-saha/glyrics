//Get song information from grooveshark.com page
function fetchTrackInfo(){
  songName = '';
  album = '';
  firstArtist = '';
  artists = '';
  
  songName = $('#player div.primaryMetadata a').text().trim();
  firstArtist = $('#player div.secondaryMetadata a:first').text().trim();
  
}