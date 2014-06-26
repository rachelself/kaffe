/* jshint unused:false */

function ajax(url, verb, data={}, success=r=>console.log(r), dataType='html'){  //defaulting to html
  'use strict';
  $.ajax({url:url, type:verb, dataType:dataType, data:data, success:success});
}

(function(){
  'use strict';

  $(document).ready(init);

  var isOn = false;
  var minutesLabel = document.getElementById('minutes');
  var secondsLabel = document.getElementById('seconds');
  var totalSeconds = 0;

  function init(){
    $('.start').click(startTimer);
    $('.stop').click(stopTimer);
  }

  function startTimer(){
    isOn = !isOn;

    $('.instruction:first-child').addClass('on');
    setInterval(setTime, 1000);

  }

  function setTime(){
    if(isOn){
      totalSeconds++;
      secondsLabel.innerHTML = pad(totalSeconds % 60);
      minutesLabel.innerHTML = pad(parseInt(totalSeconds/60));
      console.log(totalSeconds);

      checkTimerEvents(totalSeconds);
    }
  }

  function pad(val){
    var valString = val + '';
    if(valString.length < 2){
      return '0' + valString;
    }else{
      return valString;
    }
  }

  //var timerEvents = [];

  function checkTimerEvents(totalSeconds){
    var timerEvents = $('.timer');
    timerEvents.map(pullTimers);
    console.log(timerEvents);
  }

  function pullTimers(t){
    var time = $(t).attr('data-timer') * 1;
    console.log(time);
    return time;
  }

  function stopTimer(){
    isOn = false;
    totalSeconds = 0;
    clearTimeout();
    clearInterval();
  }

  // function stopTime(){
  //   secondsLabel.innerHTML = pad(totalSeconds % 60);
  //   minutesLabel.innerHTML = pad(parseInt(totalSeconds/60));
  // }




  // function init(){
  //
  // }



  // var isOn = false;
  // var timer;
  // var clock;

  // function init(){
  //   //$('.start').click(startTimer);
  //   //$('.stop').click(stopTimer);
  //   //$('.pause').click(pauseTimer);
  // }

  // function startTimer(){
  //   var h = 0;
  //   var m = 0;
  //   var s = 0;
  //   alert('timer started');
  //   isOn = !isOn;
  //
  //   if(isOn){
  //     $('.instruction:first-child').addClass('on');
  //     start();
  //   }
  // }
  //
  // function start(){
  //   clearInterval(timer);
  //   clock = $('.clock').data('time') * 1;
  //   timer = setInterval(updateClock, 1000);
  // }
  //
  // function updateClock(){
  //   clock++;
  //   $('.clock').text(clock);
  // }
  //
  // function stopTimer(){
  //   isOn = false;
  //   $('.clock').text('00:00');
  //   clock = 0;
  //   clearInterval(timer);
  // }







  // function startTimer(){
  //   var today = new Date();
  //   var h = today.getHours();
  //   var m = today.getMinutes();
  //   var s = today.getSeconds();
  //   m = checkTime(m);
  //   s = checkTime(s);
  //   document.getElementById('clock').innerHTML = m+':'+s;
  //   var t = setTimeout(function(){
  //     startTimer();
  //     },500);
  //
  // }
  //
  // function checkTime(i){
  //   if(i<10){
  //     i = '0' + i;
  //   }
  //   return i;
  // }


  // function pauseTimer(){
  //   isOn = !isOn;
  //   timer = setInterval(pauseClock, 1000);
  // }
  //
  // function pauseClock(){
  //   clock = clock;
  //   $('.clock').text(clock);
  //   $('.clock').data('time', clock);
  // }


})();
