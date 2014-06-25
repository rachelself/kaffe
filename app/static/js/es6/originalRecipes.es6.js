/* jshint unused:false */

function ajax(url, verb, data={}, success=r=>console.log(r), dataType='html'){  //defaulting to html
  'use strict';
  $.ajax({url:url, type:verb, dataType:dataType, data:data, success:success});
}

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    //$('.recipes').on('click', '.view', showRecipe);
  }

  // function showRecipe(){
  //   var recipeId = $(this).parent().parent().attr('data-id');
  //
  //   ajax(`/recipes/${recipeId}`, 'GET', null)
  // }


})();
