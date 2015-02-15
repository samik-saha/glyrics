function fetchTrackInfo() {
    window.songName = '';
    window.album = '';
    window.firstArtist = '';
    window.artists = '';

    songName = $("span.text_metadata a.song_title").text().trim();
    firstArtist = $("span.text_metadata a.artist_title").text().trim();

}