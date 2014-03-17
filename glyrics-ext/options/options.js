(function () {
  // Saves options to localStorage.

  function save_options() {
    var fontClass=$('#fontList .selected').attr('fontClass');
    localStorage["fontClass"] = fontClass;
	
	var themeClass=$('#colorList .selected').attr('themeClass');
	localStorage["themeClass"] = themeClass;

    // Update status to let user know options were saved.
    var status = document.getElementById("status");
    status.innerHTML = "Options Saved.";
    setTimeout(function () {
      status.innerHTML = "";
    }, 750);
  }

  // Restores select box state to saved value from localStorage.
  function restore_options() {
    var fontClass = localStorage["fontClass"];
    if (fontClass) {
	  $('#lyrics-text').removeClass($('#fontList .selected').attr('fontClass'));
      $('#fontList .selected').removeClass('selected');
      $("div[fontClass='"+fontClass+"']").addClass('selected');
	  $('#lyrics-text').addClass(fontClass);
    }
	
	var themeClass = localStorage["themeClass"];
	if (themeClass) {
		$('#previewPane').removeClass($('#colorList .selected').attr('themeClass'));
        $('#colorList .selected').removeClass('selected');
        $("div[themeClass='"+themeClass+"']").addClass('selected');
		$('#previewPane').addClass(themeClass);
	}
  }

  
  document.addEventListener('DOMContentLoaded', restore_options);
  document.querySelector('#save').addEventListener('click', save_options);


  $('#fontList div').click(
    function(){
		$('#lyrics-text').removeClass($('#fontList .selected').attr('fontClass'));
        $('#fontList .selected').removeClass('selected');
        $(this).addClass('selected');
		$('#lyrics-text').addClass($(this).attr('fontClass'));
    });
	
    $('#colorList div').click(
    function(){
		$('#previewPane').removeClass($('#colorList .selected').attr('themeClass'));
        $('#colorList .selected').removeClass('selected');
        $(this).addClass('selected');
		$('#previewPane').addClass($(this).attr('themeClass'));
    });
})
();
