window.onload = function() {

    let file = document.getElementById("thefile");
    let audio = document.getElementById("audio");
    let vizualizer = document.getElementById("vizualizer");

  
    file.onchange = function() {
      let files = this.files;
      audio.src = URL.createObjectURL(files[0]);
      audio.load();
      audio.play();
      let context = new AudioContext();
      let src = context.createMediaElementSource(audio);
      let analyser = context.createAnalyser();
  
      src.connect(analyser);
      analyser.connect(context.destination);
  
      analyser.fftSize = 256;
      let bufferLength = analyser.frequencyBinCount;
      let dataArray = new Uint8Array(bufferLength);
  
      function renderFrame() {
        requestAnimationFrame(renderFrame);
        analyser.getByteFrequencyData(dataArray);
  
        for (var i = 0; i < bufferLength; i++) {
         let box = document.createElement('div');
         box.style.backgroundColor = `rgb(${dataArray[i]}, 255, 255)`;
         vizualizer.appendChild(box); 
        }
      }
  
      audio.play();
      renderFrame();
    };
  };
  