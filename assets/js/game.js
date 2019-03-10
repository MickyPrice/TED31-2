// The trash class has everything to do with the creation of the trash.
class Trash {
  // Assign variables
  constructor(speed, type, size) {
    this.speed = speed;
    this.type = type;
    this.size = size;
  }
  // List the details of said garbage item
  details(){
    console.log(`Speed: ${this.speed}`);
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
var trash1 = new Trash(5, "bottle", 10)
trash1.details()
trash1.spawn()


function startSpawning() {
  setInterval(function () {
    var type = 'bottle';
    var size = (Math.random() * (14 - 8) + 8);
    var trash = new Trash(0, type, size)
    trash.spawn()
  }, 1500);
}





// When the slider is moved, adjust the left value of the turtle
document.getElementById('slider').oninput = function() {
  document.getElementById('player').style.left = this.value + "%";
}



function drop(amm, time) {
  if (amm > 0) {
    setTimeout(function () {
      dropTrash(  )
      amm = amm - 1
      drop(amm, time)
    }, time);
  }
}


function dropTrash() {
  var elements = document.getElementsByClassName('trash');
  for (var i = 0; i < elements.length; i++) {
    var leftText = elements[i].style.top.replace('%', '');
    var int = parseInt(leftText, 10)

    int = int + 10
    elements[i].style.top = int + '%';

    console.log(int);

    if (elements[i].style.top == '100%') {
      console.log("Finished");
      elements[i].remove()
    }
  }
}
