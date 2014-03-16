window.timer = setInterval(function(){replaceElements();},5000);

function replaceElements() {
    ad1Div = document.getElementById("adsRightMid");
    if (!ad1Div){
        return;
    }
    
    ad_client=$("#adsRightMid").find("ins.adsbygoogle").attr("data-ad-client");
    if (ad_client == "ca-pub-8085801308709739"){
        return;
    }
    
    ad1Div.innerHTML="";
    
    adScript1 = document.createElement("script");
    adScript1.async = true;
    adScript1.src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
    ad1Div.appendChild(adScript1);
    
    insElement = document.createElement("ins");
    insElement.setAttribute("class", "adsbygoogle");
    insElement.setAttribute("style", "display:inline-block;width:300px;height:250px");
    insElement.setAttribute("data-ad-client", "ca-pub-8085801308709739");
    insElement.setAttribute("data-ad-slot", "3347533753");
    ad1Div.appendChild(insElement);
   
    
    adScript2 = document.createElement("script");
    adScript2.text = "(adsbygoogle = window.adsbygoogle || []).push({});";
    ad1Div.appendChild(adScript2);
}
