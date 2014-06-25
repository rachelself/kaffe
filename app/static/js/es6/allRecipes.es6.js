/* jshint unused:false */

function ajax(url, verb, data={}, success=r=>console.log(r), dataType='html'){  //defaulting to html
  'use strict';
  $.ajax({url:url, type:verb, dataType:dataType, data:data, success:success});
}

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('select[id="brewMethod"]').change(filterRecipes);
    //$('#all-recipes').on('click', '.add-to-library', add);
  }

  function filterRecipes(){
    console.log('==== made it to on change function =====');
    //var brewMethodId = $('select[id="brewMethod"] :selected').val() * 1;
    var brewMethod = $('select[id="brewMethod"] :selected').val();

    if(brewMethod === 'All'){
      brewMethod = 'none';
    }


    ajax(`/recipes/filter/${brewMethod}`, 'GET', null, h=>{
      console.log('==== html coming back ====');
      console.log(h);
      $('#all-recipes').empty().append(h);
      $('select :selected').val(`${brewMethod}`);
    });
  }

  // function add(){
  //   var recipeId = $(this).closest('.recipe').attr('data-id');
  //   var recipeDiv = $(this).closest('.recipe');
  //   var index = $('#all-recipes').children().index(recipeDiv);
  //   console.log('=== index among childrens ===');
  //   console.log(index);
  //
  //   console.log('===== recipeID of what you clicked on');
  //   console.log(recipeId);
  //
  //   ajax(`/profile/recipeLibrary`, 'POST', {recipeId:recipeId}, h=>{
  //     console.log('==== html coming back ====');
  //     console.log(h);
  //     $('#all-recipes').children()[index].replaceWith(h);
  //     //$(recipeDiv).replaceWith(h);
  //     $('select :selected').val('All');
  //   });
  //
  //
  // }

  // function showAll(){
  //   ajax(`/recipes`, 'GET', null, h=>{
  //     console.log('==== html coming back ====');
  //     console.log(h);
  //     $('#all-recipes').empty().append(h);
  //     $('select :selected').val(`${brewMethod}`);
  //   });
  // }


})();
