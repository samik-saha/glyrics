//Get song information from AccuRadio.com page
function fetchTrackInfo() {
    songName = '';
    album = '';
    firstArtist = '';
    artists = '';

    songName = $("#player .player-track-title").text().trim();
    firstArtist = $("#player .player-track-artist .player-track-link:first").text().trim();

}