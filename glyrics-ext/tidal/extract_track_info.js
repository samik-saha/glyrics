//Get song information from Tidal
function fetchTrackInfo() {
    window.songName = '';
    window.album = '';
    window.firstArtist = '';
    window.artists = '';

    var trackName, trackArtist;
    trackName = $(".player__text a")[0].text.trim();
    trackArtist = $(".player__text a")[1].text.trim();

    window.songName = trackName;
    window.firstArtist = trackArtist;
}
