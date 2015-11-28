//Get song information from AccuRadio.com page
function fetchTrackInfo() {
    window.songName = '';
    window.album = '';
    window.firstArtist = '';
    window.artists = '';

    songName = $("div.metadata span:last").text().trim();
    firstArtist = $("div.metadata span:first").text().trim();

}