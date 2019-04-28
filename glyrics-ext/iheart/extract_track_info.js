/* Extract track info from Wynk */
/* global $ */
function fetchTrackInfo() {
	window.songName = "";
	window.album = "";
	window.firstArtist = $("div[data-test='mini-player-description-text']").text().trim();
	window.artists = "";
	window.songName = $("div[data-test='mini-player-track-text']").text().trim();
	window.album = "";
}
