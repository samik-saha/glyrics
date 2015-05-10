//Get song information from AccuRadio.com page
function fetchTrackInfo() {
    songName = '';
    album = '';
    firstArtist = '';
    artists = '';

    songName = $("div.metadata span:last").text().trim();
    firstArtist = $("div.metadata span:first").text().trim();

}