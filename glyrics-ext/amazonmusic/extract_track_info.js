function fetchTrackInfo() {
    window.songName = '';
    window.album = '';
    window.firstArtist = '';
    window.artists = '';

    songName = $('div.currentSongDetails').find('span.title').text().trim();
    firstArtist = $('div.currentSongDetails').find('a.artistLink').text().trim();

}