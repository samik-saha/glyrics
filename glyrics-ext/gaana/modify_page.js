window.timer = setInterval(function() {
	replaceElements();
}, 5000);

function replaceElements() {
	var ad1Div = document.getElementById("adsRightTop");
	if (ad1Div) {
		var ad_client = document.getElementById("div-gpt-ad-1437311530561-0");
		if (!ad_client) {
			ad1Div.innerHTML = "";

            var adScript0=document.createElement("script");
            adScript0.text="var googletag = googletag || {};"+
            "googletag.cmd = googletag.cmd || [];"+
            "(function () {"+
            "var gads = document.createElement('script');"+
            "gads.async = false;"+
            "gads.type = 'text/javascript';"+
            "var useSSL = 'https:' == document.location.protocol;"+
            "gads.src = (useSSL ? 'https:' : 'http:') +"+
            "'//www.googletagservices.com/tag/js/gpt.js';"+
            "var node = document.getElementsByTagName('script')[0];"+
            "node.parentNode.insertBefore(gads, node);"+
            "})();";
            ad1Div.appendChild(adScript0);


            var adScript1 = document.createElement("script");
            adScript1.text = "googletag.cmd.push(function() {" +
            "googletag.defineSlot('/40095566/glyrics_300x600', [300, 600], 'div-gpt-ad-1437311530561-0').addService(googletag.pubads());" +
            "googletag.enableServices();" +
            "});";
            ad1Div.appendChild(adScript1);

            var adHolder = document.createElement("div");
            adHolder.id = 'div-gpt-ad-1437311530561-0';
            adHolder.setAttribute("style", "height:600px; width:300px;");

            var adScript2 = document.createElement("script");
            adScript2.text = "googletag.cmd.push(function() { googletag.display('div-gpt-ad-1437311530561-0'); });";

			ad1Div.appendChild(adHolder);
			adHolder.appendChild(adScript2);
			$("#adsRightTop").css("display", "block");
		}
	}
}

