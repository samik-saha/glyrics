//Get song information from Gaana.com page
function fetchTrackInfo(){
  var prevSongName=songName;
  songName = '';
  album = '';
  firstArtist = '';
  artists = '';

  div_trackInfo = document.getElementById('trackInfo');
  
  if (!div_trackInfo || div_trackInfo.children.length === 0){
      return;
  }
  

  //For Radio Mirchi
  songNames = div_trackInfo.getElementsByClassName("songName");
  if (songNames.length > 0){
      songName = songNames[0].innerText.trim();
      albumElement = div_trackInfo.getElementsByClassName("albumNamePl");
      album = (albumElement.length > 0)?albumElement[0].innerText.trim():"";
  }else {
      //Gaana.com default
      tx=$("#tx");
      if(tx.length === 0) return;
      songName = tx.get(0).firstChild.nodeValue.trim();
      album = tx.find("span").eq(0).find("a").text().trim();
      firstArtist = tx.find("span").eq(1).find("a").eq(0).text().trim();
  }

  /* Ignore Gaana Promotional */
  if (songName === "Gaana Promotional"){songName = prevSongName;}
  
  //if song changed and artist is null
  // 12/27/2013 -- This might no longer being required as artist name is now shown in the player
  if (songName !== prevSongName && !firstArtist){
      //Look for artist elsewhere in the page
      extractTracksFromPage();
  }
}


/* 
Although artist name is not displayed, it might be available elsewhere in the page
This function finds all songs listed in the page and extracts the artist for the current song.

12/27/2013 -- This might no longer be required as artist name is now shown in the player
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
        obj = eval("("+songJSON[i]+")");
        if (obj.title.trim() === songName.trim()){
            firstArtist = obj.artist.substring(0,obj.artist.indexOf("###"));
        }
        //console.log(obj.title+":"+obj.artist);
    }
}