const state = {
    rowsAmount: 9,
    columnsAmount: 16,
    red: 0,
    green: 0,
    blue: 0,
}

const picker = new CP(document.getElementById('color-picker'));
picker.on("drag", function(color) {
    state.red = parseInt(color.substring(0,2), 16);
    state.green = parseInt(color.substring(2,4), 16);
    state.blue = parseInt(color.substring(4,6), 16);
    renderVisualizer();
});
    

const onRowsChange = (value) => {
    state.rowsAmount = value;
    renderVisualizer();

}
const onColumnsChange = (value) => {
    state.columnsAmount = value;
    renderVisualizer();
}

const renderVisualizer = () => {

    let file = document.getElementById("thefile");
    let audio = document.getElementById("audio");
    let visualizer = document.getElementById("visualizer");

    visualizer.style.gridTemplateColumns = `repeat(${state.columnsAmount}, 1fr)`;
    visualizer.style.gridTemplateRows = `repeat(${state.rowsAmount}, 1fr)`;
  
    file.onchange = function() {
        visualizer.style.display = 'grid';
        let files = this.files;
        audio.src = URL.createObjectURL(files[0]);
        audio.load();
        audio.play();
        let context = new AudioContext();
        let src = context.createMediaElementSource(audio);
        let analyser = context.createAnalyser();
    
        src.connect(analyser);
        analyser.connect(context.destination);
    
        let bufferLength = analyser.frequencyBinCount;
        let dataArray = new Uint8Array(bufferLength);
    
        function renderFrame() {
            requestAnimationFrame(renderFrame);
            visualizer.innerHTML = '';
            analyser.getByteFrequencyData(dataArray);
            for (var i = 0; i < state.columnsAmount * state.rowsAmount; i++) {
            let box = document.createElement('div');
            const frequencyValue = dataArray[i] / 2;
            box.style.backgroundColor = `rgb(${state.red + frequencyValue}, ${state.green + frequencyValue}, ${state.blue + frequencyValue})`;
            box.style.width = '50px';
            box.style.height = '50px';
            visualizer.appendChild(box); 
            }
        }
    
        audio.play();
        renderFrame();
    };
  };
  
window.onload = renderVisualizer;
