let config = {
  villianNames: ["Baby McLeod", "Mr McLeod", "Professor McLeod", "Dr McLeod"],
  currentLevel: 0,
  timer:0,
  control:"stop",
  time: 200,
  dropSpeed: 100,
  health: 10,
  enabled: false
}


function startGame() {
  config.enabled = true;
  startSpawning()
  drop(10)
  updateHealth()

  // This code makes sure that the user can't lose focus on the movement slider.
  // This is so that they can use the arrow keys.
  // Basically, when the user looses focus, force them to focus it again.
  document.getElementById('slider').focus()
  document.getElementById('slider').addEventListener('focusout', function(){
    if(config.enabled == true){
      document.getElementById('slider').focus()
    }
  })
}


// The trash class has everything to do with the creation of the trash.
class Trash {
  // Assign variables
  constructor(type, size) {
    this.type = type;
    this.size = size;
  }
  // List the details of said garbage item
  details(){
    console.log(`Type: ${this.type}`);
    console.log(`Size: ${this.size}`);
    console.log(`Size(px): ${this.size * 4}px x ${this.size * 4}px`);
  }
  // Call this to spawn a piece of trash
  spawn(){
    var element = document.createElement('div');
    element.classList.add('trash');
    element.classList.add(this.type);
    element.style.top = "0%";
    element.style.width = `${this.size * 4}px`;
    element.style.height = `${this.size * 4}px`;

    element.style.left = Math.floor(Math.random() * Math.floor(89)) + "%"

    // Add the element to the gameArea
    document.getElementById('gameArea').prepend(element)
  }
}


// Debugging - Create a piece of garbage
// var trash1 = new Trash(5, "bottle", 10)
// trash1.details()
// trash1.spawn()

// This function just starts the whole spawning system
function startSpawning() {
  var loop = setInterval(function () {
    // check if the game is still in play
    if (config.enabled == true) {
      var types = ["bottle"];
      var type = types[Math.floor(Math.random()*types.length)];
      var size = (Math.random() * (14 - 8) + 8);
      var trash = new Trash(type, size)
      trash.spawn()
    }else {
      // If the game is not still in play, stop spawning
      clearInterval(loop)
    }
  }, 1500); // How many milliseconds between each spawn (1500 = 1 second)
}



// When the slider is moved, adjust the left value of the turtle
document.getElementById('slider').oninput = function() {
  document.getElementById('player').style.left = this.value + "%";
}


// Function to drop items
function drop(amm) {
  if (config.enabled == true) {
    if (amm > 0) {
      setTimeout(function () {
        dropTrash()
        amm = amm - 1
        drop(amm, config.dropSpeed)
      }, config.time);
    }else {
      drop(10, config.dropSpeed)
    }
  }
}

// Drop trash
function dropTrash() {
  // Find all tash elements
  var elements = document.getElementsByClassName('trash');
  for (var i = 0; i < elements.length; i++) {
    var leftText = elements[i].style.top.replace('%', '');
    var int = parseInt(leftText, 10)

    // Add 10 to the current element's top (making it go down.)
    int = int + 10
    elements[i].style.top = int + '%';

    if (elements[i].style.top == '100%') {

      // This variable stores how far left all the objects are,
      // we can compare this to how far the turtle is
      // If they are close, we will remove 1 life from the turtle.
      // It also stored how far the player has moved - 5 and + 5
      var positions = {}
      positions.trash = parseInt(elements[i].style.left,10);
      positions.player = parseInt(document.getElementById('player').style.left, 10);
      positions.playerPlus = positions.player + 5;
      positions.playerTake = positions.player - 5;

      // Detect if the trash fell within 5(%) of the player
      if (positions.trash <= positions.playerPlus && positions.trash >= positions.playerTake) {
        hurt()
      }




      elements[i].remove()
    }
  }
}




// function to hurt the player
function hurt(amm = 1) {
  config.health = config.health - amm;
  updateHealth();
  document.getElementById('playerImg').src = "assets/img/turtle_red.png";
  setTimeout(function () {
    document.getElementById('playerImg').src = "assets/img/turtle_green.png";
  }, 400);
}

// This will update the player's health
// Updating their hearts and if they have 0 or less, they will die
function updateHealth() {
  var hearts = document.querySelectorAll("#hearts img.full");
  // loop through the "hearts" var which is an array of all the
  // "heart" elements on the page, removes them all (Will be replaced later)
  for (var i = 0; i < hearts.length; i++) {
    hearts[i].remove()
  }
  // Repeats ${config.health} ammount and add a new heart element for each.
  for (var i = 0; i < config.health; i++) {
    var newHeart = document.createElement('img')
    newHeart.classList.add('full')
    newHeart.src =" assets/img/hearts/full.svg"
    newHeart.setAttribute('draggable', 'false')
    document.getElementById('hearts').appendChild(newHeart)
  }
  if (config.health <= 0) {
    stopGame()
  }
}


// When the user dies
function stopGame() {
  config.enabled = false;
  document.getElementById('game-over-modal').classList.remove('hidden');
}
