let config = {
  villianNames: ["Baby_McLeod", "Mr_McLeod", "Dr_McLeod", "Professor_McLeod"],
  currentVillian: 0,
  timer:0,
  control:"stop",
  time: 200,
  dropSpeed: 500,
  health: 10,
  enabled: false,
  maxHealth: 10,
}


function startGame() {
  config.enabled = true;
  startSpawning()
  setTimeout(function () {
    startSpawning();
  }, 1000);
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



  // Every 20 seconds, upgrade villian
  var time = 1;
  var interval = setInterval(function() {
    if (config.enabled == true) {
       if (time <= config.villianNames.length) {
          upgradeVillian()
          time++;
       }
       else {
          clearInterval(interval);
       }
    }else {
      clearInterval(interval);
    }
  }, 20000);


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
      var types = ["bottle", "plastic_bag", "can"];
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
        drop(amm )
      }, config.time);
    }else {
      drop(10 )
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
  var emptyHearts = document.querySelectorAll("#hearts img.empty");
  // loop through the "hearts" var which is an array of all the
  // "heart" elements on the page, removes them all (Will be replaced later)
  for (var i = 0; i < hearts.length; i++) {hearts[i].remove()}
  for (var i = 0; i < emptyHearts.length; i++) {emptyHearts[i].remove()}
  // Repeats ${config.health} ammount and add a new heart element for each.
  for (var i = 0; i < config.health; i++) {
    var newHeart = document.createElement('img')
    newHeart.classList.add('full')
    newHeart.src =" assets/img/hearts/full.svg"
    newHeart.setAttribute('draggable', 'false')
    document.getElementById('hearts').appendChild(newHeart)
  }
  // Add the empty hearts
  var dif = config.maxHealth - config.health;
  if (dif.maxHealth !== 0){
    for (var i = 0; i < dif; i++) {
      var newHeart = document.createElement('img')
      newHeart.classList.add('empty')
      newHeart.src =" assets/img/hearts/empty.svg"
      newHeart.setAttribute('draggable', 'false')
      document.getElementById('hearts').appendChild(newHeart)
    }
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





// Upgrading villians
function upgradeVillian() {
  // Add 1 to the villian count
  config.currentVillian++;
  // If the villian exists in the list of villians
  if (config.villianNames[config.currentVillian]) {
    // Update elements on site
    document.getElementById('villian-image').src = `assets/img/McLeod/${config.villianNames[config.currentVillian]}.png`;
    document.getElementById('villian-name').innerText = config.villianNames[config.currentVillian].replace('_', ' ');

    // Increase spawn rates
    startSpawning();
    setTimeout(function () {
      startSpawning();
    }, 1000);
  }else {
    // User has won!
    document.getElementById('game-youWin-modal').classList.remove('hidden');
    config.enabled = false;
  }
}
