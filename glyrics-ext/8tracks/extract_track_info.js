//Get song information from AccuRadio.com page
function fetchTrackInfo() {
    songName = '';
    album = '';
    firstArtist = '';
    artists = '';

    songName = $("#now_playing div.title_artist span.t").text().trim();
    firstArtist = $("#now_playing div.title_artist span.a").text().trim();

}