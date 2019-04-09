// This object contains all the game data.
// If you wish to edit any part of the game, you can through here.
let CONFIG = {
  // All the villians that can be played (Their names should match their image name in the /assets/Josh/ file,
  // images should be in .png format. Also, their names should match their names with spaced replaced with underscores)
  villianNames: ["Baby_Josh", "Mr_Lees", "Dr_Lees", "Professor_Lees", "Lord_Lees"],
  // This var holds what villian the user is currently up to
  currentVillian: 0,
  // If the game is being played or not
  enabled: false,
  // Time it takes for the trash to fall
  time: 200,
  // The user's current health
  health: 5,
  // The user's max health
  maxHealth: 5
};

// This function sets up all variables and runs all functions to start the game.
function startGame() {
  CONFIG.enabled = true;
  startSpawning();
  setTimeout(function () {
    startSpawning();
  }, 1000);
  drop(10);
  updateHealth();

  // This code makes sure that the user can't lose focus on the movement slider.
  // This is so that they can use the arrow keys.
  // Basically, when the user looses focus, force them to focus it again.
  document.getElementById('slider').focus();
  document.getElementById('slider').addEventListener('focusout', function(){
    if(CONFIG.enabled == true){
      document.getElementById('slider').focus();
    }
  })


  // Every 20 seconds, upgrade villian
  var time = 1;
  var interval = setInterval(function() {
    if (CONFIG.enabled == true) {
       if (time <= CONFIG.villianNames.length) {
          upgradeVillian();
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

    element.style.left = Math.floor(Math.random() * Math.floor(89)) + "%";

    // Add the element to the gameArea
    document.getElementById('gameArea').prepend(element);
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
    if (CONFIG.enabled == true) {
      var types = ["bottle", "plastic_bag", "can"];
      var type = types[Math.floor(Math.random()*types.length)];
      var size = (Math.random() * (14 - 8) + 8);
      var trash = new Trash(type, size);
      trash.spawn();
    }else {
      // If the game is not still in play, stop spawning
      clearInterval(loop);
    }
  }, 1500); // How many milliseconds between each spawn (1500 = 1 second)
}


// When the slider is moved, adjust the left value of the turtle
document.getElementById('slider').oninput = function() {
  if (this.value > 89) {
    // If the user's input is too far right
    document.getElementById('player').style.left =  "89%";
    this.value = "89";
  }else if(this.value < 1){
    // If the user's input is too far left
    document.getElementById('player').style.left =  "1%";
    this.value = "1";
  }else {
    // User's input is in bounds
    document.getElementById('player').style.left = this.value + "%";
  }
}


// Function to drop items
function drop(amm) {
  if (CONFIG.enabled == true) {
    if (amm > 0) {
      setTimeout(function () {
        dropTrash();
        amm = amm - 1;
        drop(amm);
      }, CONFIG.time);
    }else {
      drop(10);
    }
  }
}

// Drop trash
function dropTrash() {
  // Find all tash elements
  var elements = document.getElementsByClassName('trash');
  for (var i = 0; i < elements.length; i++) {
    var leftText = elements[i].style.top.replace('%', '');
    var int = parseInt(leftText, 10);

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
        hurt();
      }

      elements[i].remove();
    }
  }
}




// function to hurt the player
function hurt(amm = 1) {
  CONFIG.health = CONFIG.health - amm;
  updateHealth();
  document.getElementById('playerImg').src = "assets/img/turtle_red.png";
  setTimeout(function () {
    document.getElementById('playerImg').src = "assets/img/turtle_green.png";
  }, 400);
}

// This will update the player's health
// Updating their hearts and if they have 0 or less, they will die
function updateHealth() {

  // Check if max health is more than min health
  if (CONFIG.health <= CONFIG.maxHealth) {

    var hearts = document.querySelectorAll("#hearts img.full");
    var emptyHearts = document.querySelectorAll("#hearts img.empty");
    // loop through the "hearts" var which is an array of all the
    // "heart" elements on the page, removes them all (Will be replaced later)
    for (var i = 0; i < hearts.length; i++) {hearts[i].remove()}
    for (var i = 0; i < emptyHearts.length; i++) {emptyHearts[i].remove()}
    // Repeats ${CONFIG.health} ammount and add a new heart element for each.
    for (var i = 0; i < CONFIG.health; i++) {
      var newHeart = document.createElement('img');
      newHeart.classList.add('full');
      newHeart.src =" assets/img/hearts/full.svg";
      newHeart.setAttribute('draggable', 'false');
      document.getElementById('hearts').appendChild(newHeart);
    }
    // Add the empty hearts
    var dif = CONFIG.maxHealth - CONFIG.health;
    if (dif.maxHealth !== 0){
      for (var i = 0; i < dif; i++) {
        var newHeart = document.createElement('img');
        newHeart.classList.add('empty');
        newHeart.src =" assets/img/hearts/empty.svg";
        newHeart.setAttribute('draggable', 'false');
        document.getElementById('hearts').appendChild(newHeart);
      }
    }
    if (CONFIG.health <= 0) {
      stopGame();
    }

  }else {
    // Set max health to current health if max health isn't more than health
    CONFIG.maxHealth = CONFIG.health;
  }


}


// When the user dies
function stopGame() {
  CONFIG.enabled = false;
  document.getElementById('game-over-modal').classList.remove('hidden');
}





// Upgrading villians
function upgradeVillian() {
  // Add 1 to the villian count
  CONFIG.currentVillian++;
  // If the villian exists in the list of villians
  if (CONFIG.villianNames[CONFIG.currentVillian]) {
    // Update elements on site
    document.getElementById('villian-image').src = `assets/img/Josh/${CONFIG.villianNames[CONFIG.currentVillian]}.png`;
    document.getElementById('villian-name').innerText = CONFIG.villianNames[CONFIG.currentVillian].replace('_', ' ');

    // Increase spawn rates
    startSpawning();
    setTimeout(function () {
      startSpawning();
    }, 1000);
  }else {
    // User has won!
    document.getElementById('game-youWin-modal').classList.remove('hidden');
    CONFIG.enabled = false;
  }
}
