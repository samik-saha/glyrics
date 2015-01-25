window.timer = setInterval(function() {
	replaceElements();
}, 5000);

function replaceElements() {
	ad1Div = document.getElementById("adsRightTop");
	if (ad1Div) {
		ad_client = $("#adsRightTop").find("ins.adsbygoogle").attr("data-ad-client");
		if (ad_client != "ca-pub-8085801308709739") {
			ad1Div.innerHTML = "";

			adScript1 = document.createElement("script");
			adScript1.async = true;
			adScript1.src = "//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
			ad1Div.appendChild(adScript1);

			insElement = document.createElement("ins");
			insElement.setAttribute("class", "adsbygoogle");
			insElement.setAttribute("style", "display:inline-block;width:300px;height:600px");
			insElement.setAttribute("data-ad-client", "ca-pub-8085801308709739");
			insElement.setAttribute("data-ad-slot", "1940104159");
			ad1Div.appendChild(insElement);

			adScript2 = document.createElement("script");
			adScript2.text = "(adsbygoogle = window.adsbygoogle || []).push({});";
			ad1Div.appendChild(adScript2);
			$("#adsRightTop").css("display", "block");
		}
	}
}

