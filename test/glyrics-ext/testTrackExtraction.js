const puppeteer = require('puppeteer');
var expect = require('chai').expect;

describe('track details extraction', function(){
    describe('wynk',function(){
        var trackTitle;
        var artist;
        var album;
        before(async function(){
            this.timeout(10000);
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('https://wynk.in/music/song/Girls-Like-You/um_00602567683223-USUM71805272?page=0', {waitUntil: "networkidle2"});
            //Inject JQuery
            await page.addScriptTag({path:"glyrics-ext/jquery-3.3.1.min.js"});
            //Inject js file
            await page.addScriptTag({path:"glyrics-ext/wynk/extract_track_info.js"});
            await page.click('button[play-song]');
            await sleep(2000);
            trackTitle = await page.evaluate('fetchTrackInfo();window.songName');
            album = await page.evaluate('window.album');
            artist = await page.evaluate('window.firstArtist');
            await browser.close();
        });
        it('track', async function(){
            expect(trackTitle).to.equal('Girls Like You');
        });

        it('artist', async function(){
            expect(artist).to.equal('Maroon 5');
        });
    });

    describe('soundcloud',function(){
        var trackTitle;
        var artist;
        var album;
        before(async function(){
            this.timeout(15000);
            const browser = await puppeteer.launch();
            const page = await browser.newPage();
            await page.goto('https://soundcloud.com/postmalone/candy-paint', {waitUntil: "networkidle2"});
            //Inject JQuery
            await page.addScriptTag({path:"glyrics-ext/jquery-3.3.1.min.js"});
            //Inject js file
            await page.addScriptTag({path:"glyrics-ext/soundcloud/extract_track_info.js"});
            //await page.click('button[play-song]');
            //await sleep(2000);
            trackTitle = await page.evaluate('fetchTrackInfo();window.songName');
            album = await page.evaluate('window.album');
            artist = await page.evaluate('window.firstArtist');
            await browser.close();
        });
        it('track', async function(){
            expect(trackTitle).to.equal('Candy Paint');
        });

        it('artist', async function(){
            expect(artist).to.equal('Post Malone');
        });
    });
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}