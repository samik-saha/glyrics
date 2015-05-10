//Get song information from grooveshark.com page
function fetchTrackInfo(){
  songName = '';
  album = '';
  firstArtist = '';
  artists = '';
  
  songName = $('button.item-title').text().trim();
  firstArtist = $('button.grandparent-title').text().trim();
}