function fetchTrackInfo() {
    window.songName = '';
    window.album = '';
    window.firstArtist = '';
    window.artists = '';

    songName = $('div.player-track').text().trim();
    firstArtist = $('div.player-artist').text().trim().substr(2);

}