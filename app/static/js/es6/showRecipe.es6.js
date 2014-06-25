/* jshint unused:false */

function ajax(url, verb, data={}, success=r=>console.log(r), dataType='html'){  //defaulting to html
  'use strict';
  $.ajax({url:url, type:verb, dataType:dataType, data:data, success:success});
}

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('.main').on('click', '.add-to-library', addToLibrary);
  }

  function addToLibrary(){
    console.log('==== FUNCTION CALLED =====');
    var recipe = $(this).parent();
    var recipeId = recipe.attr('data-id');
    var button = $(this);

    console.log('===== recipeID of what you clicked on');
    console.log(recipeId);

    console.log('===== button we are going to replace');
    console.log(button);

    ajax(`/profile/recipeLibrary`, 'POST', {recipeId:recipeId}, h=>{
      console.log('==== html coming back ====');
      console.log(h);
      button.replaceWith(h);
    });
  }



})();
