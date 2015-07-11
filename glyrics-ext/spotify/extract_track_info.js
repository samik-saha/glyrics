//Get song information from Spotify
function fetchTrackInfo() {
    window.songName = '';
    window.album = '';
    window.firstArtist = '';
    window.artists = '';

    var trackName, trackArtist;

    if (window.location.hostname == "play.spotify.com") {
        trackName = $('#app-player').contents().find('#track-name a:first').text().trim();
        trackArtist = $('#app-player').contents().find('#track-artist a:first').text().trim();
    }
    else {
        trackName = $('#main').contents().find('#view-now-playing .track span:first').text().trim();
        trackArtist = $('#main').contents().find('#view-now-playing .artist span:first').text().trim();
    }

    window.songName = trackName;
    window.firstArtist = trackArtist;
}
