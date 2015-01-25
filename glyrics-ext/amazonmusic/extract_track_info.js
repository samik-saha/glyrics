//Get song information from www.raaga.com page
function fetchTrackInfo() {
    window.songName = '';
    window.album = '';
    window.firstArtist = '';
    window.artists = '';

    songName = $('div.currentSongDetails').find('span.title').text();
    firstArtist = $('div.currentSongDetails').find('a.artistLink').text();

}