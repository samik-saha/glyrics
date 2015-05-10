//Get song information from AccuRadio.com page
function fetchTrackInfo() {
    songName = '';
    album = '';
    firstArtist = '';
    artists = '';

    songName = $('#songtitle').text().trim();
    firstArtist = $('#songartist').text().trim();
    album = $('#songalbum').text().trim();

}