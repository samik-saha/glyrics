/*
 Content Script - Gaana Lyrics Extension

 Injected on supported music services. The purpose of this script is to detect changes in playing track, setup lyrics
 display popup and show lyrics when available. This script is also responsible for informing the Gaana Lyrics App of
 the currently playing track.
 */

/* Boolean variable to track if the lyrics pop up is active */
var isLyricWindowVisible = false;
/* Tracks the current track title */
var songName = '';
/* Tracks the current track's album if available */
var album = '';
/* Tracks the artist of current track, if multiple artists are involved, stores the first artist */
var firstArtist = '';
/* Tracks the artist or artists of the current track */
var artists = '';
/* Holds the artist of the displayed lyrics, which could be different in case the user followed a suggested track link*/
var lyricArtist = '';
/* Holds the title of the displayed lyrics, which could be different in case the user followed a suggested track link*/
var lyricTitle = '';
/* Holds the root div element of the lyrics pop up. Removed from DOM when the pop is closed */
var div;
/* element to display search results */
var searchElement;
/* link element to the music page specific CSS file. Removed from document when the pop up is closed. */
var autoStyle;

/*
 * Set up a timer to detect track changes. If a track change is detected it
 * sends out messages to extension background page and the related app. This
 * timer runs as long as the page is open.
 */
var iframe = $("<iframe id='glyrics'>").css('display','none').appendTo(document.body);
// document.body is used instead of "body" above because jango.com uses a frameset as a body

iframe[0].contentWindow.setInterval(checkTrackChange,3000);

/* Set Up a Message Listener */
chrome.runtime.onMessage.addListener(function (request) {
    /* function call handler */
    if (request.functionName) {
        //console.log("GLyrics: request received to call function:"+request.functionName);
        var target = this[request.functionName];
        if (typeof target === 'function') {
            target.apply(this, request.args);
        }
    }

    /* lyrics returned from background page */
    else if (request.msgType === "lyrics") {
        contentDiv.innerHTML = '<div id="glyrics-text">' + request.lyrics + '</div>';
        lyricsHeader.innerHTML = 'Lyrics | ' + lyricTitle + ' <em>by</em> '
        + lyricArtist;
        addAd(contentDiv);
    }
    /* error information returned from background page */
    else if (request.msgType === "displayError") {
        contentDiv.innerHTML = request.message;
        if (request.msgAction === 'searchOnLyricWiki') {
            searchOnLiricWiki(songName);
        }
    }
    /* search result returned from background page */
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

        switch (window.location.hostname) {
            case "www.jango.com":
                // jango.com uses a frameset as a body. Adding the div inside frameset doesn't work
                document.body.parentNode.appendChild(div);
                break;
            default:
                document.body.appendChild(div);
        }

        // set initial size
        div.style.height = '500px';
        div.style.width = '340px';

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

/*
 Adds a CSS link element with the music page specific CSS file
 */
function addAutoStyleCSSLink() {
    autoStyle = document.createElement("link");
    autoStyle.setAttribute("rel", "stylesheet");
    autoStyle.setAttribute("type", "text/css");
    var autoStyleURL = "";
    switch (window.location.hostname) {
        case "gaana.com":
            autoStyleURL = chrome.extension.getURL("gaana/gaana.css");
            break;
        case "play.spotify.com":
        case "player.spotify.com":
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
        case "play.raaga.com":
            autoStyleURL = chrome.extension.getURL("raaga/raaga.css");
            break;
        case "www.rdio.com":
            autoStyleURL = chrome.extension.getURL("rdio/rdio.css");
            break;
        case "plex.tv":
        case "127.0.0.1":
        case "localhost":
            autoStyleURL = chrome.extension.getURL("plex/plex.css");
            break;
        case "app.rhapsody.com":
            autoStyleURL = chrome.extension.getURL("rhapsody/rhapsody.css");
            break;
        case "www.accuradio.com":
            autoStyleURL = chrome.extension.getURL("AccuRadio/AccuRadio.css");
            break;
        case "www.slacker.com":
            autoStyleURL = chrome.extension.getURL("slacker/slacker.css");
            break;
        case "www.jango.com":
            autoStyleURL = chrome.extension.getURL("jango/jango.css");
            break;
        case "www.deezer.com":
            autoStyleURL = chrome.extension.getURL("deezer/deezer.css");
            break;
        case "8tracks.com":
            autoStyleURL = chrome.extension.getURL("8tracks/8tracks.css");
            break;
    }
    autoStyle.setAttribute("href", autoStyleURL);
    document.body.appendChild(autoStyle);
}

/*
 Adds a style element with color details as per the configurations chosen by user
 */
function addUserColorStyle(settings) {
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
        .appendTo(document.body);//document.body used instead of "body" because jango.com uses a frameset as a body
}

/*
 Adds a style element with font properties as per the defined settings
 */
function addUserFontStyle(settings) {
    $("<style class='glyrics-userstyle'>")
        .prop("type", "text/css")
        .html('#glyrics-text {'
        + 'font-family:' + settings.fontFamily + ';'
        + 'font-size:' + settings.defaultFontSize + ';}')
        .appendTo(document.body);//document.body used instead of "body" because jango.com uses a frameset as a body
}

/*
 Takes chrome storage object as parameter and adds necessary CSS links or style elements
 */
function applyStyle(object) {
    var settings = object.settings;

    if (settings) {
        if (settings.autoColorScheme === true) addAutoStyleCSSLink();
        else if (settings.color) addUserColorStyle(settings);
        addUserFontStyle(settings);

        /* Load Google Fonts only if any non-default Font is chosen */
        if (settings.fontClass !== "DefaultFont")
            $("<style class='glyrics-userstyle'>")
                .prop("type", "text/css")
                .html('@font-face{'
                + 'font-family: '+settings.fontFamily+';'
                + 'src: url('+chrome.extension.getURL('fonts/'+settings.fontFamily+'.ttf')+');}')
                .appendTo(document.body);//document.body used instead of "body" because jango.com uses a frameset as a body
    }
    else addAutoStyleCSSLink();
    showLyrics();
}

/*
 Gets the currently playing music if any, and checks with the songName variable to determine if the track has changed
 */
function checkTrackChange() {
    //console.log("ping From checkTrackChange");
    var prevSongName = songName;
    fetchTrackInfo();
    if (songName !== prevSongName) {
        //console.log('GLyrics:: detected track change!');
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

/*
Removes lyrics popup and related styles
 */
function closeLyricsWindow() {
    if (autoStyle) autoStyle.remove();
    $('.glyrics-userstyle').remove();
    div.remove();
    isLyricWindowVisible = false;
}

/*
Call background script function sendSearchRequest with the track title.
*/
function searchOnLiricWiki(title) {
    searchElement = document.createElement('div');
    contentDiv.innerHTML = contentDiv.innerHTML
    + '<br><br><b>Possible Matches</b>';
    contentDiv.appendChild(searchElement);
    searchElement.innerHTML = 'Searching with "' + title + '" ...';

    callBackgroundScript("sendSearchRequest", [title]);
}

/*
Displays search results returned from background script
 */
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
                var elementText = event.srcElement.innerText;
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
        + ' (<a target="_blank" href="https://www.google.com/search?q='
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

/*
Re-sends request for lyrics
*/
function reload() {
    songName = "";
    fetchTrackInfo();
    getLyrics(firstArtist, songName, album);
}

/*
Send a message to background script with function name and arguments, in the hope that the background script will
call the corresponding function
 */
function callBackgroundScript(targetFunction, args) {
    var message = {functionName: targetFunction, args: args};
    chrome.runtime.sendMessage(message);
}

function addAd(parent){
    var adDiv=document.createElement("div");
    parent.appendChild(adDiv);

    var adScript1 = document.createElement("script");
    adScript1.async = true;
    adScript1.src = "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
    adDiv.appendChild(adScript1);

    var insElement = document.createElement("ins");
    insElement.setAttribute("class", "adsbygoogle");
    insElement.setAttribute("style", "display:inline-block;width:320px;height:100px");
    insElement.setAttribute("data-ad-client", "ca-pub-8085801308709739");
    insElement.setAttribute("data-ad-slot", "3851731750");
    adDiv.appendChild(insElement);

    var adScript2 = document.createElement("script");
    adScript2.text = "(adsbygoogle = window.adsbygoogle || []).push({});";
    adDiv.appendChild(adScript2);
}