/* jshint unused:false */

function ajax(url, verb, data={}, success=r=>console.log(r), dataType='html'){  //defaulting to html
    'use strict';
  $.ajax({url:url, type:verb, dataType:dataType, data:data, success:success});
}

(function(){

  'use strict';

  $(document).ready(init);

  function init(){
    // $('#new-recipe-content').hide();
    // $('.create-recipe').click(updatePage);
    $('.add-instruction').click(addInstruction);
    $('.add-prep').click(addPrep);



  }

  // function updatePage(){
  //   var obj = {};
  //   obj.title = $('.title').val();
  //   obj.description = $('.description').val();
  //   obj.brewMethodId = $('#brewMethod option:selected').val();
  //
  //   ajax(`/recipes`, 'POST', obj, h=>{
  //     console.log('=== html we are getting back ===');
  //     console.log(h);
  //     $('#new-recipe-info').empty().append(h);
  //     $('#new-recipe-content').show();
  //   });
  // }
  //
  function addInstruction(){
    var instructionStep = `<div class="step"><input type="text" name="step" required="true" placeholder="Pour 50g water..." autofocus><h6>Timer Event:</h6><input type="text" placeholder="1:30"><button class="remove-step button button-rounded button-flat">X</button><button class="move-step button button-rounded button-flat">Move</button></div>`;
    $('.steps').append(instructionStep);
  }

  function addPrep(){
    var prepStep = `<div class="prep-step"><input type="text" name="prep-step" required="true" placeholder="Boil water" autofocus><button class="remove-step button button-rounded button-flat">X</button><button class="move-step button button-rounded button-flat">Move</button></div>`;
    $('.prep-steps').append(prepStep);
  }

  // <input type="time" ampm="false" timeFormat="mm:ss" stepMinute="1" stepSecond="1">

  // function addInstruction(){
  //   var instructionType = $('.type-of-instruction:selected').value();
  //   var formElement;
  //   var unit = $('.unit:selected').value();
  //
  //   switch(instructionType){
  //   case 'fill':
  //     formElement = `<p>Fill up to</p><input type="number" name="fill-volume" autofocus><p>${unit}</p>`;
  //     break;
  //   case 'bloom':
  //     formElement = `<p>Let bloom for</p><input type="number" name="bloom" autofocus><p>seconds</p>`;
  //     break;
  //   case 'wait':
  //     formElement = `<p>Wait</p><input type="number" name="bloom" autofocus><select>seconds</select>`;
  //     break;
  //
  //
  //
  //   }
  // }

// <input type="time" name="timer" step="1">


})();
