/* Extract track info from Wynk */
/* global $ */
function fetchTrackInfo() {
	window.songName = "";
	window.album = "";
	window.firstArtist = $('div.songlist-lhs:has(div.song-current) .songlist-info span').text().split("-")[0].trim();
	window.artists = "";
	window.songName = $('div.songlist-lhs:has(div.song-current) .songlist-info p a').text().trim();
	window.album = $(".wynk-nplayer-wrap.mob-player-bottom div.nplayerinfo-lhs p span").text().trim();
}
