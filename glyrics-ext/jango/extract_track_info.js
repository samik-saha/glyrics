//Get song information from jango.com page
function fetchTrackInfo() {
    window.songName = '';
    window.album = '';
    window.firstArtist = '';
    window.artists = '';

    window.songName = $("#current-song").text().trim();
    window.firstArtist = $("#player_current_artist").find("a").text().trim();
}