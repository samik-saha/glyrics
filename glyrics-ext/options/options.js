(function () {
    var glyrics_appid = "paiehomgejkdifojcddmbinmophkibac";
    var settings = {};
    var appWindowChecked;

    var colorSlider = $("#color-slider").slider({
        min: 0,
        max: 360,
        slide: function (ev, ui) {
            setColorSettings(360 - ui.value);
            previewAppearance();
        }
    });

    // Saves options to localStorage.
    function save_options() {
        chrome.storage.sync.set({'settings': settings}, function () {
            var status = document.getElementById("status");
            status.innerHTML = "Your settings have been saved";
            status.style.display = 'block';
            setTimeout(function () {
                status.innerHTML = "";
                status.style.display = 'none';
            }, 3000);
        });

        localStorage["appWindow"] = $("#appCheckBox").prop("checked");


    }

    var setDefaultSettings = function(){
        /* Setup Default Settings */
        settings.hue = 167;
        settings.autoColorScheme = true;
        settings.background = "tinted";
        settings.color = getSchemeColors(167, "tinted");
        settings.defaultFontSize = '14px';
        settings.fontClass = "DefaultFont";
        settings.fontFamily = "'Trebuchet MS', Arial, Helvetica, sans-serif";
        appWindowChecked=false;
    };

    var setAllUISettings=function(){
        /* Set UI settings */
        if (settings.autoColorScheme === true) {
            $("input[name='theme'][value='auto']:radio").prop("checked", true);
            $("#color-slider").slider("disable");
            $("input[name='background']").prop("disabled", true);
        } else {
            $("input[name='theme'][value='user']:radio").prop("checked", true);
        }
        $("input[name='background'][value='" + settings.background + "']:radio").prop("checked", true);

        colorSlider.slider("option", "value", 360 - settings.hue);
        $('#fontSize').val(settings.defaultFontSize);
        /* select font */
        $('#fontList .selected').removeClass('selected');
        $("div[fontClass='" + settings.fontClass + "']").addClass('selected');

        if(appWindowChecked !== undefined) {
            $('#appCheckBox').prop('checked', appWindowChecked);
        }
        previewContent();
        previewAppearance();
    };

    // Restores select box state to saved value from localStorage.
    function restore_options() {
        /* everything is stored as string in localStorage */
        appWindowChecked = localStorage["appWindow"]=='true';

        chrome.storage.sync.get("settings", function (object) {
            if (object.settings) {
                settings = object.settings
            }
            else {
                setDefaultSettings();
            }
            setAllUISettings();
        });

        checkAppInstalled();
    }

    /* Event Listeners */
    $(document).on('DOMContentLoaded', restore_options);

    $('#save').click(save_options);

    $("input[name='theme']:radio").change(function () {
        switch ($("input[name='theme']:checked").val()) {
            case "auto":
                colorSlider.slider("disable");
                $("input[name='background']").prop("disabled", true);
                settings.autoColorScheme = true;
                break;
            case "user":
                colorSlider.slider("enable");
                $("input[name='background']").prop("disabled", false);
                settings.autoColorScheme = false;
                break;
        }
    });

    $("input[name='background']:radio").change(function () {
        settings.background = $("input[name='background']:checked").val();
        switch (settings.background) {
            case "tinted":
                settings.color = getSchemeColors(settings.hue, "tinted");
                break;
            case "white":
                settings.color = getSchemeColors(settings.hue, "white");
                break;
            case "black":
                settings.color = getSchemeColors(settings.hue, "black");
                break;
        }
        previewAppearance();
    });

    $('#fontSize').change(function () {
        settings.defaultFontSize = $(this).val();
        previewContent();
    });

    $('#close').click(function () {
        window.close();
    });

    $('#reset').click(function () {
        setDefaultSettings();
        setAllUISettings();
    });

    $('#fontList div').click(
        function () {
            $('#fontList .selected').removeClass('selected');
            $(this).addClass('selected');
            settings.fontClass = $(this).attr('fontClass');
            settings.fontFamily = $(this).css('font-family');
            previewContent();
        });

    function checkAppInstalled() {
        chrome.runtime.sendMessage(
            glyrics_appid, {msgType: "Version"},
            function (response) {
                if (response)
                    if (response.version > 1) {
                        document.getElementById("appNotInstalledWarning").style.display = "none";
                    }
            });
    }

    var previewAppearance = function () {
        $('#lyrics-container').css({
            'background-color': settings.color.bodyBackground,
            'border-color': settings.color.border
        });
        $('#lyrics-topbar').css('background-color', settings.color.headerBackground);
        $('#glyrics-content, #glyrics-content *').css('color', settings.color.bodyText);
        $('#glyrics-content a:LINK').css('color', settings.color.link);
        $('#glyrics-content a:VISITED').css('color', settings.color.visitedLink);
        for (var i = 0; i < document.styleSheets.length; i++) {
            var sheet = document.styleSheets[i];
            if (sheet.title == 'option') {
                for (var j = 0; j < sheet.rules.length; j++) {
                    var rule = sheet.rules[j];
                    if (rule.cssText.match("#glyrics-content::-webkit-scrollbar-track")) {
                        rule.style.backgroundColor = settings.color.scrollBarBackground;
                    } else if (rule.cssText.match("#glyrics-content::-webkit-scrollbar-thumb")) {
                        rule.style.backgroundColor = settings.color.scrollBarThumb;
                        rule.style.borderColor = settings.color.scrollBarThumb;
                    }
                }
            }
        }
    };

    var previewContent = function () {
        $('#glyrics-content').css({
            'font-size': settings.defaultFontSize,
            'font-family': settings.fontFamily
        });
    };

    var setColorSettings = function (hue) {
        settings.hue = hue;
        colors = getSchemeColors(hue, settings.background);
        settings.color = colors;
    };


})();
