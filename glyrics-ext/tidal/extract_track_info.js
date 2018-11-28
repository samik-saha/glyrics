//Get song information from Tidal
function fetchTrackInfo() {
    window.songName = '';
    window.album = '';
    window.firstArtist = '';
    window.artists = '';

    var trackName, trackArtist;
    trackName = $('[class^=mediaInformation]:first').children().first().text().trim()
    trackArtist = $('[class^=mediaInformation]:first').children().last().text().trim();;

    window.songName = trackName;
    window.firstArtist = trackArtist;
}
