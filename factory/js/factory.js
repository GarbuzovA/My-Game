const canvas = document.getElementById('canvas'); // document canvas html
const ctx = canvas.getContext('2d'); //bird species
//images(standart)
// let img = new Image();
let bird = new Image();
let pipeTop = new Image();
let pipeBottom = new Image();
let backGround = new Image();
let bl = new Image();


//standart
// img.src = "https://i.ibb.co/Q9yv5Jk/flappy-bird-set.png";
bird.src = "images-factory/bird-factory.png";
pipeTop.src = "images-factory/metalpipeTop.png";
pipeBottom.src = "images-factory/metalpipeBottom.png";
backGround.src = "images-factory/backGroundFactory.jpg";
bl.src = "images-factory/bl.png";


//audio
let score_audio = new Audio();
let fail_audio = new Audio();

score_audio.src = "audio-factory/score.mp3";
fail_audio.src = "audio-factory/fail.mp3";

// general settings
let gamePlaying = false;
const gravity = .5;   
const speed = 5.2; //6.2
const size = [54, 42];// 51 (36) bird
const jump = -11.5;
const cTenth = (canvas.width / 20); //position bird

let index = 0,
    bestScore = 0, 
    flight, 
    flyHeight, 
    currentScore, 
    pipe;
    

// pipe settings
const pipeWidth = 78; //ширина
const pipeGap = 270; //зазор между трубами 
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth; //разположение труб

const setup = () => {
  currentScore = 0;
  flight = jump;
  
  

  // set initial flyHeight (middle of screen - size of the bird)
  flyHeight = (canvas.height / 2) - (size[1] / 2);
  

  // setup first 3 pipes
  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

const render = () => {
  // make the pipe and bird moving 
  index++;
  

  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background first part 
  ctx.drawImage(backGround, 0, 0, canvas.width, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
  // background second part
  ctx.drawImage(backGround, 0, 0, canvas.width, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);
  
  // pipe display
  if (gamePlaying){
    pipes.map(pipe => {
      // pipe moving
      pipe[0] -= speed;

      // top pipe
      ctx.drawImage(pipeTop, 0, 500 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]); //500 высота
      // bottom pipe
      ctx.drawImage(pipeBottom, 0, 0, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      // give 1 point & create new pipe
      if(pipe[0] <= -pipeWidth){
        currentScore++;
        score_audio.play();
        // check if it's the best score
        bestScore = Math.max(bestScore, currentScore);
        
        // remove & create new pipe
        pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
        console.log(pipes);
      }
    
      // if hit the pipe, end
      if ([
        pipe[0] <= cTenth + size[0], 
        pipe[0] + pipeWidth >= cTenth, 
        pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
      ].every(elem => elem)) {
        gamePlaying = false;
        setup();
        fail_audio.play();
      }
    })
  }

  
  //bottom line
  ctx.drawImage(bl, 0, canvas.height - bl.height);

  //if hit the bottom line, end
    if (flyHeight + size[1] >= canvas.height - bl.height) {
        gamePlaying = false;
        setup();
        fail_audio.play();
    }
  

  // draw bird
  if (gamePlaying) {
    ctx.drawImage(bird, 0, Math.floor((index % 30) / 10) * size[1], ...size, cTenth, flyHeight, ...size);
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
    ctx.drawImage(bird, 0, Math.floor((index % 30) / 10) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, ...size);
    flyHeight = (canvas.height / 2) - (size[1] / 2);


  

    
    
    // text accueil
    ctx.fillText(`Best score : ${bestScore}`, 85, 245);
    ctx.fillText('Click to play', 90, 535);
    ctx.font = "bold 30px courier";
  }

  document.getElementById('bestScore').innerHTML = `Best : ${bestScore}`;
  document.getElementById('currentScore').innerHTML = `Current : ${currentScore}`;

  // tell the browser to perform anim
  window.requestAnimationFrame(render);
}

// launch setup
setup();
render();

// start game
canvas.addEventListener("click", () => {
    if (!gamePlaying) { 
        gamePlaying = true;
    }
    else {
        flight = jump;
    }
});






