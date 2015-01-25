/*
Content Script - Gaana Lyrics Extension

Injected on supported music services. The purpose of this script is to detect changes in playing track, setup lyrics
display popup and show lyrics when available. This script is also responsible for informing the Gaana Lyrics App of
the currently playing track.


 */


var isLyricWindowVisible = false;
var songName = '';
var album = '';
var firstArtist = '';
var fontClass;
var artists = '';
var lyricArtist = ''; // Artist of displayed lyric
var lyricTitle = ''; // Title of the displayed lyric
var div;
var searchElement;
var autoStyle;

/*
 * Set up a timer to detect track changes. If a track change is detected it
 * sends out messages to extension background page and the related app. This
 * timer runs as long as user is on the page.
 */
setInterval(function () {
    checkTrackChange();
}, 3000);

/* Set Up a Message Listener */
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    /* function call handler */
    if (request.functionName) {
        //console.log("GLyrics: request received to call function:"+request.functionName);
        target = this[request.functionName];
        if (typeof target === 'function') {
            target.apply(this, request.args);
        }
    }

    /* lyrics returned from background page */
    else if (request.msgType === "lyrics") {
        contentDiv.innerHTML = '<div id="glyrics-text">' + request.lyrics + '</div>';
        lyricsHeader.innerHTML = 'Lyrics | ' + lyricTitle + ' <em>by</em> '
        + lyricArtist;
    }
    /* error information returned from background page */
    else if (request.msgType === "displayError") {
        contentDiv.innerHTML = request.message;
        if (request.msgAction === 'searchOnLyricWiki') {
            searchOnLiricWiki(songName);
        }
    }

    else if (request.msgType === "searchResult") {
        displaySearchResults(request.results);
    }
});

/*
Called when the PageIcon is clicked.Closes if the popup is visible and gets user settings. On retrieving settings the
applyStyle method adds necessary CSS and calls the showLyrics method to build the popup UI.
 */
function pageIconClicked() {
    if (isLyricWindowVisible) closeLyricsWindow();

    /* get user preferences and set style */
    chrome.storage.sync.get('settings', applyStyle);
}

/*
Build the popup UI
*/
function showLyrics() {
    //console.log("GLyrics: showLyrics called");
    isLyricWindowVisible = true;

    /* Add a lyrics overlay window to the page */
    div = document.getElementById('lyrics-container');
    if (!div) {
        div = document.createElement('div');
        div.setAttribute('id', 'lyrics-container');
        div.setAttribute('class', 'glyrics');

        window.topBar = document.createElement('div');
        topBar.setAttribute('id', 'lyrics-topbar');
        topBar.innerHTML = ''
        + '<table id="lyrics-header-tb">'
        + '<tbody>'
        + '	<tr>'
        + '  <td id="lyrics-header">Lyrics</td>'
        + '  <td class="glyrics-btn">'
        + '	  <img id="lyrics-settings-btn" class="glyrics-btn-img"></td>'
        + '  <td class="glyrics-btn">'
        + '	  <img id="lyrics-reload-btn" class="glyrics-btn-img"></td>'
        + '  <td class="glyrics-btn">'
        + '	  <img id="lyrics-close-btn" class="glyrics-btn-img">'
        + '  </td>'
        + ' </tr>'
        + '</tbody>'
        + '</table>';
        div.appendChild(topBar);

        window.contentDiv = document.createElement('div');
        contentDiv.setAttribute('id', 'glyrics-content');
        div.appendChild(contentDiv);
        contentDiv.innerHTML = 'Hi there! Try playing a song!';

        document.body.appendChild(div);

        // set initial size
        div.style.height = '500px';
        div.style.width = '330px';

        var reloadBtn = document.getElementById("lyrics-reload-btn");
        reloadBtn.addEventListener('click', reload, false);

        var lyricsCloseBtn = document.getElementById("lyrics-close-btn");
        lyricsCloseBtn.addEventListener('click', closeLyricsWindow, false);

        lyricsCloseBtn = document.getElementById("lyrics-settings-btn");
        lyricsCloseBtn.addEventListener('click', function () {
            window.open(chrome.extension.getURL("options/options.html"));
        }, false);

        window.lyricsHeader = document.getElementById("lyrics-header");

        document.getElementById("lyrics-close-btn").src = chrome.extension
            .getURL("images/Close-16.png");
        document.getElementById("lyrics-reload-btn").src = chrome.extension
            .getURL("images/Refresh-16.png");
        document.getElementById("lyrics-settings-btn").src = chrome.extension
            .getURL("images/Settings-16.png");

        $(function () {
            $("#lyrics-container")
                .resizable()
                .draggable({
                    handle: "#lyrics-topbar",
                    containment: "window",
                    scroll: false
                });
        });

        lyricsHeader.innerHTML = "Lyrics";
        getLyrics(firstArtist, songName, album);
    }

    // reposition lyrics window
    div.style.position = 'fixed';
    div.style.left = 'auto';
    div.style.top = (window.innerHeight / 6) + 'px';
    div.style.right = (window.innerWidth / 6) + 'px';
}

var applyStyle = function (object) {
    settings = object.settings;

    if (settings.autoColorScheme === true) {
        autoStyle = document.createElement("link");
        autoStyle.setAttribute("rel", "stylesheet");
        autoStyle.setAttribute("type", "text/css");
        var autoStyleURL = "";
        switch (window.location.hostname) {
            case "gaana.com":
                autoStyleURL = chrome.extension.getURL("gaana/gaana.css");
                break;
            case "grooveshark.com":
                autoStyleURL = chrome.extension.getURL("grooveshark/grooveshark.css");
                break;
            case "play.spotify.com":
                autoStyleURL = chrome.extension.getURL("spotify/spotify.css");
                break;
            case "www.pandora.com":
                autoStyleURL = chrome.extension.getURL("pandora/pandora.css");
                break;
            case "www.amazon.com":
                autoStyleURL = chrome.extension.getURL("amazonmusic/amazonmusic.css");
                break;
            case "soundcloud.com":
                autoStyleURL = chrome.extension.getURL("soundcloud/soundcloud.css");
                break;
            case "www.saavn.com":
                autoStyleURL = chrome.extension.getURL("saavn/saavn.css");
                break;
            case "www.earbits.com":
                autoStyleURL = chrome.extension.getURL("earbits/earbits.css");
                break;
            case "bop.fm":
                autoStyleURL = chrome.extension.getURL("bop.fm/bop.fm.css");
                break;
            case "play.google.com":
                autoStyleURL = chrome.extension.getURL("googlemusic/googlemusic.css");
                break;
        }
        autoStyle.setAttribute("href", autoStyleURL);
        document.body.appendChild(autoStyle);
    }
    else if (settings.color) {
        $("<style class='glyrics-userstyle'>")
            .prop("type", "text/css")
            .html(''
            + '#lyrics-container {'
            + '	background-color:' + settings.color.bodyBackground + ';'
            + ' border-color:' + settings.color.border + ';}'
            + '#lyrics-topbar {background-color:' + settings.color.headerBackground + ';}'
            + '#glyrics-content, #glyrics-content *{color:' + settings.color.bodyText + ';}'
            + '#glyrics-content a:LINK {color:' + settings.color.link + ';}'
            + '#glyrics-content a:VISITED {color:' + settings.color.visitedLink + ';}'
            + '#glyrics-content::-webkit-scrollbar-track {'
            + ' background-color:' + settings.color.scrollBarBackground + ';}'
            + '#glyrics-content::-webkit-scrollbar-thumb {'
            + ' background-color:' + settings.color.scrollBarThumb + ';'
            + ' border-color:' + settings.color.scrollBarThumb + ';}'
        )
            .appendTo("body");
    }
    $("<link>")
        .prop("rel", "stylesheet")
        .prop("type", "text/css")
        .prop("href", ('https:' == document.location.protocol ? 'https' : 'http') +
        "://fonts.googleapis.com/css?family=Crafty+Girls|Walter+Turncoat|Gloria+Hallelujah|Calligraffitti|Inconsolata|Courgette|Slabo+27px")
        .appendTo("body");
    $("<style class='glyrics-userstyle'>")
        .prop("type", "text/css")
        .html('#glyrics-text {'
        + 'font-family:' + settings.fontFamily + ';'
        + 'font-size:' + settings.defaultFontSize + ';}')
        .appendTo("body");
    showLyrics();
}

function checkTrackChange() {
    var prevSongName = songName;
    fetchTrackInfo();
    if (songName !== prevSongName) {
        console.log('GLyrics:: detected track change!');
        if (isLyricWindowVisible) {
            lyricsHeader.innerHTML = "Lyrics | " + songName;
            getLyrics(firstArtist, songName, album);
        }
        /* send out track information to background page */
        var pass_data = {
            'msgType': 'trackInfo',
            'artist': firstArtist,
            'title': songName,
            'album': album
        };
        chrome.runtime.sendMessage(pass_data);
    }
}

function closeLyricsWindow() {
    if (autoStyle) autoStyle.remove();
    $('.glyrics-userstyle').remove();
    div.remove();
    isLyricWindowVisible = false;
}

function searchOnLiricWiki(title) {
    searchElement = document.createElement('div');
    contentDiv.innerHTML = contentDiv.innerHTML
    + '<br><br><b>Possible Matches</b>';
    contentDiv.appendChild(searchElement);
    searchElement.innerHTML = 'Searching with "' + title + '" ...';

    callBackgroundScript("sendSearchRequest", [title]);
}

function displaySearchResults(lwSearchResults) {
    if (lwSearchResults.length === 0) {
        searchElement.innerHTML = 'No match found for "' + songName + '".';
    } else {
        searchElement.innerHTML = '';
        var ol = document.createElement('ol');
        searchElement.appendChild(ol);
        for (var i = 0; i < lwSearchResults.length; i++) {
            var li = document.createElement('li');
            var result = document.createElement('a');
            result.setAttribute('href', lwSearchResults[i].link);
            result.setAttribute('target', '_blank');
            result.innerHTML = lwSearchResults[i].title;
            result.onclick = function () {
                // do not follow the link
                event.returnValue = false;
                // Set lyricArtist and lyricTitle to be displayed on header
                elementText = event.srcElement.innerText;
                lyricArtist = elementText.substr(0, elementText.indexOf(':'));
                lyricTitle = elementText.substr(elementText.indexOf(':') + 1);

                callBackgroundScript("getLyricsFromLyricWikiURL", [event.srcElement.getAttribute('href')]);
            };
            li.appendChild(result);
            ol.appendChild(li);
        }
    }
}

/*
Validates artist and title and calls the background page function getLyricURL to fetch the lyrics page URL for us.
This is because, the lyrics service does not always support request from music page. Also, direct HTTP requests
are blocked if the music page is loaded over HTTPS.
 */
function getLyrics(artist, title, album) {
    // check if title is present
    if (!title) {
        contentDiv.innerHTML = 'Song title is missing. Cannot search for lyrics.';
        return;
    }

    /* If artist is missing try to get artist name from MusicBrainz */
    if (!artist) {
        contentDiv.innerHTML = 'Artist is missing! Searching for Artist Name on MusicBrainz...';
        callBackgroundScript("getArtistFromMusicBrainz", [title, album]);
        return;
    }

    // Artist could not be retrieved from MusicBrainz as well
    if (artist === 'Not Found') {
        contentDiv.innerHTML = 'Artist not found! Cannot locate lyrics for <b>'
        + title
        + '</b>'
        + '(<a target="_blank" href="https://www.google.com/search?q='
        + title + ' lyrics">Search Google</a>).';

        searchOnLiricWiki(title);
        return;
    }

    lyricsHeader.innerHTML = "Lyrics | " + title + ' <em>by</em> ' + artist;
    contentDiv.innerHTML = 'Searching lyrics for "' + title + '" by "'
    + artist + '" ...';

    lyricArtist = artist;
    lyricTitle = title;

    callBackgroundScript("getLyricURL", [artist, title]);
}

function reload() {
    songName = "";
    fetchTrackInfo();
    getLyrics(firstArtist, songName, album);
    callBackgroundScript("reload", ["abc", "cde"]);
}

function callBackgroundScript(targetFunction, args) {
    var message = {functionName: targetFunction, args: args};
    chrome.runtime.sendMessage(message);
}
