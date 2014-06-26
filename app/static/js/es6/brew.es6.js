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
    //$('.calculate').hide();
    setCalculate();
    $('.select-brew-method').on('click', '.thumbnail:not(selected)', getRecipes);
    $('.select-recipe').on('change', 'select[id=recipeLibrary]', getPrep);
    $('#by-coffee-amount').click(toggleEnable);
    $('#by-drink-size').click(toggleEnable);
    $('.calculate').click(getCalculations);
    //$('#calculation-output').on('click', '.ready', getTimer);
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

  function setCalculate()
  {
    $('.calculate:first-child').show();
    $('.coffee-amount > .u-1of3:nth-child(1)').addClass('selected');
    $('.coffee-amount > .u-1of3:nth-child(2)').addClass('disabled');
    // $('.selected > button.calcuate').show();
    // $('.disabled > button.calculate').hide();


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
        // getCalculations();
      });
    }else{
      return;
    }
  }

  function toggleEnable(){
    $('.selected').removeClass('selected');
    $('.disabled').removeClass('disabled');
    // console.log('==== what you clicked on! ====');
    // console.log(selected);

    var selected = $(this);
    selected.addClass('selected');
    var notSelected = $('.coffee-amount > .u-1of3:not(.selected)');

    notSelected.addClass('disabled');
    $('.disabled > input').val('');
    //$('.selected > button.calcuate').show();
    //$('.disabled > button.calculate').hide();
  }

  function getCalculations(){
    console.log('===== getting calculations =====');
    var selectedRecipeId = $('select[id=recipeLibrary] :selected').val();
    var unit;

    if($('.selected > input').hasClass('amnt')){
      var coffeeToUse = $('.selected > input').val() * 1;
      unit = $('.selected > select[id=unit] :selected').val();
      // console.log('===== unit =====');
      // console.log(unit);
      // console.log('===== coffeeToUse box =====');
      // console.log(coffeeToUse);

      ajax(`/brew/calculate`, 'GET', {recipeId:selectedRecipeId, coffeeToUse:coffeeToUse, unit:unit}, h=>{
        console.log('===== html coming back =====');
        console.log(h);
        $('#calculation-output').empty().append(h);
      });

    }else{
      var drinkSize = $('.selected > input').val() * 1;
      unit = $('.selected > select[id=unit] :selected').val();
      // console.log('===== drinkSize box =====');
      // console.log(drinkSize);

      ajax(`/brew/calculate`, 'GET', {recipeId:selectedRecipeId, drinkSize:drinkSize, unit:unit}, h=>{
        console.log('===== html coming back =====');
        console.log(h);
        $('#calculation-output').empty().append(h);
      });
    }
  }

  // function getTimer(){
  //   var selectedRecipeId = $('select[id=recipeLibrary] :selected').val();
  //
  //   ajax(`/brew/timer`, 'GET', {recipeId:selectedRecipeId}, )
  // }


})();
