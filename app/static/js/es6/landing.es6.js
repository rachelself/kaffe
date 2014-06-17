(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    toggleLoginSignup();
    $('.signup').click(showSignUpOptions);
    $('.showSignup').click(showSignUpOptions);
    $('.showLogin').click(showLoginOptions);
    $('#loginform > #email').focus();
    $('#signupform > #email').focus();

  }

  function toggleLoginSignup(){
    var url = window.location.pathname;
    if(url === '/'){
      $('.signupOptions').hide();
    }else if(url === '#login'){
      $('.signupOptions').hide();
      $('.loginOptions').show();
    }else if(url === '#signup'){
      $('.signupOptions').show();
      $('.loginOptions').hide();
    }else{
      $('.signupOptions').hide();
      $('.loginOptions').show();
    }
  }

  function showSignUpOptions(){
    $('.signupOptions').show();
    $('.loginOptions').hide();
  }

  function showLoginOptions(){
    $('.signupOptions').hide();
    $('.loginOptions').show();
  }

})();
