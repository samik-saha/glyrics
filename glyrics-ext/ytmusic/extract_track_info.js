/* Extract track info from Wynk */
/* global $ */
function fetchTrackInfo() {
	window.songName = "";
	window.album = "";
	window.firstArtist = $(".subtitle.ytmusic-player-bar .byline a:first").text();
	window.artists = "";
	window.songName = $(".title.ytmusic-player-bar:first").text().trim();
	window.album = "";
}
