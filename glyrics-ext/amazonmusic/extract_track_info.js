function fetchTrackInfo() {
    window.songName = '';
    window.album = '';
    window.firstArtist = '';
    window.artists = '';

    songName = $('.playbackControlsView .trackTitle').text().trim();
    firstArtist = $('.playbackControlsView .trackArtist').text().trim();

}