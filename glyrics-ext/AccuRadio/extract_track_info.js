//Get song information from AccuRadio.com page
function fetchTrackInfo() {
    songName = '';
    album = '';
    firstArtist = '';
    artists = '';

    //For longer names there are multiple divs inside
    //for animation. Just take one of them
    if ( $('#songtitle').children().length == 0){
        songName = $('#songtitle').text().trim();
    }
    else{
        songName = $('#songtitle div:first').text().trim();
    }
    
    firstArtist = $('#songartist').text().trim();
    album = $('#songalbum').text().trim();
}