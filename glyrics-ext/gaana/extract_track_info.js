//Get song information from Gaana.com page
function fetchTrackInfo(){
  var prevSongName=window.songName;
  window.songName = '';
  window.album = '';
  window.artists = '';

  songName = $('#stitle').first().text().trim()
  album = $('#atitle').first().text().trim()

  /* Ignore Gaana Promotional */
  if (songName === "Gaana Promotional"){
	  songName = prevSongName;
  }
  
  //if song changed and artist is null
  if (window.songName !== prevSongName){
	  window.firstArtist = '';
      //Look for artist elsewhere in the page
      extractTracksFromPage();
  }
}


/* 
Although artist name is not displayed, it might be available elsewhere in the page
This function finds all songs listed in the page and extracts the artist for the current song.
*/
function extractTracksFromPage(){
    var allSpans = document.getElementsByTagName("span");
    var songJSON=[];
    
    for (var i=0;i<allSpans.length;i++){
        if(allSpans[i].className.indexOf("sourcelist")>=0){
            songJSON.push(allSpans[i].innerText);
        }
    }
    
    for (i=0;i<songJSON.length;i++){
        var obj = eval("("+songJSON[i]+")");
        if (obj.title.trim() == window.songName){
            window.firstArtist = obj.artist.substring(0,obj.artist.indexOf("###"));
        }
        //console.log(obj.title+":"+obj.artist);
    }
}