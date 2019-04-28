//Get song information from AccuRadio.com page
function fetchTrackInfo() {
    songName = '';
    album = '';
    firstArtist = '';
    artists = '';

    songName = $(".track-title").text().split(" · ")[0].trim();
    firstArtist = $(".track-title").text().split(" · ")[1].trim();

}