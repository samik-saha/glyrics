/* Extract track info from Wynk */
/* global $ */
function fetchTrackInfo() {
	window.songName = "";
	window.album = "";
	window.firstArtist = "";
	window.artists = "";
	window.songName = $(".content-part .head a").first().text().trim();
	window.album = $(".content-part .sub a").first().text().trim();
}
