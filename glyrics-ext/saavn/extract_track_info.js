//Get song information from grooveshark.com page
function fetchTrackInfo() {
	songName = '';
	album = '';
	firstArtist = '';
	artists = '';

	songName = document.getElementById('player-track-name').innerText;
	album = document.getElementById('player-album-name').innerText;
	extractTracksFromPage();
}

function extractTracksFromPage() {
	songJSONDivs = $(".song-json");
	for (var i = 0; i < songJSONDivs.length; i++) {
		obj = eval("(" + songJSONDivs[i].innerText + ")");
		if (obj.title.trim() === songName.trim()) {
			singers = obj.singers;
			commaIndex = singers.indexOf(",");
			firstArtist = (commaIndex === -1)?singers:singers.substring(0, commaIndex);
		}
	}
}