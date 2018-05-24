window.onload = function(){
  var sound = document.getElementById('sound');
  var title = document.getElementById('title');
  title.style.opacity = 1;
  var content = document.getElementById('text');

  var audioState = setInterval(function(){
    if(sound.readyState === 4){
      fadeAudio();
      fadeOutTitle();
      animateContent();
      clearInterval(audioState)
    }
  }, 200)

  var fadeAudio = function(){
    setInterval(function () {
      if ((sound.currentTime >= 77) && (sound.volume >= 0.1)) {
        sound.volume -= 0.1;
      }
      if ((sound.currentTime >= 10) && (sound.volume <= 0.1)) {
        sound.volume = 0.0;
      }
      if (sound.volume === 0.0) {
        clearInterval(fadeAudio);
      }
    }, 200);
  }

  var fadeOutTitle = function(){
    setTimeout(function(){
      setInterval(function(){
        if(title.style.opacity >= 0.1){
          title.style.opacity -= 0.1
        } else {
          title.style.opacity = 0;
        }
      }, 10)
    }, 4000)
  }

  var animateContent = function(){
    setTimeout(function(){
      content.className += 'animated'
    }, 6000)
  }

}
