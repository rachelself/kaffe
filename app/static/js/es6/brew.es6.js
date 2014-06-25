/* jshint unused:false */

function ajax(url, verb, data={}, success=r=>console.log(r), dataType='html'){  //defaulting to html
  'use strict';
  $.ajax({url:url, type:verb, dataType:dataType, data:data, success:success});
}

(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('.select-recipe').hide();
    $('.coffee-amount').hide();
    $('.select-brew-method').on('click', '.thumbnail:not(selected)', getRecipes);
    $('.select-recipe').on('change', 'select[id=recipeLibrary]', getPrep);
  }

  function getRecipes(){
    $('.select-recipe').show();
    //console.log('========= function firing ==========');
    $('.selected').removeClass('selected');
    var brewImg = $(this);
    // console.log('==== image you clicked on =====');
    // console.log(brewImg);
    var brewMethod = $(this).closest('.method');
    var brewMethodId = brewMethod.attr('data-id');
    var prep = $('.preparations');

    ajax(`/brew/filterLibrary`, 'GET', {brewMethodId:brewMethodId}, h=>{
      // console.log('==== html coming back =====');
      // console.log(h);
      prep.empty();
      $('.selection').empty().append(h);
      brewImg.addClass('selected');

      if($('select[id=recipeLibrary]').length){
        getPrep();
      }else{
        $('.coffee-amount').hide();
      }
    });
  }

  function getPrep(){
    $('.coffee-amount').show();
    //console.log('===== select box changed =====');
    var prep = $('.preparations');
    var selectedRecipeId = $('select[id=recipeLibrary] :selected').val();
    //console.log('==== selection ====');
    //console.log(selectedRecipeId);

    if(selectedRecipeId !== undefined){
      ajax(`/brew/prep`, 'GET', {selectedRecipeId:selectedRecipeId}, h=>{
        // console.log('===== html coming back =====');
        // console.log(h);
        prep.empty().append(h);
        getCalculations();
      });
    }else{
      return;
    }
  }

  function getCalculations(){
    console.log('===== getting calculations =====');
  }


})();
