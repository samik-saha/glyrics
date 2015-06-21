//Get song information from jango.com page
function fetchTrackInfo() {
    window.songName = '';
    window.album = '';
    window.firstArtist = '';
    window.artists = '';

    /* JQuery is not working on the page. Don't know why */
    var frameDocument = document.getElementsByName("content")[0].contentWindow.document;

    window.songName = frameDocument.getElementById("current-song").innerHTML.trim();
    window.firstArtist = frameDocument.getElementById("player_current_artist").children[1].innerHTML.trim();
}