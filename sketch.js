/***********************************************************************************
  Echo
  by An Duong

  
------------------------------------------------------------------------------------
***********************************************************************************/

// adventure manager global  
var adventureManager;

// p5.play
var playerSprite;
var playerAnimation;

// Clickables: the manager class
var clickablesManager;    // the manager class
var clickables;           // an array of clickable objects

// indexes into the clickable array (constants)
const playGameIndex = 0;


var catRingCollected;
var taserCollected;
var phoneCollected;

// Allocate Adventure Manager with states table and interaction tables
function preload() {
  clickablesManager = new ClickableManager('data/clickableLayout.csv');
  adventureManager = new AdventureManager('data/adventureStates.csv', 'data/interactionTable.csv', 'data/clickableLayout.csv');

  chonkoFont = loadFont('assets/CHONKO_DISPLAY.ttf');
  considerationFont = loadFont('assets/Conseration.ttf');
}

// Setup the adventure manager
function setup() {
  createCanvas(windowWidth, windowHeight);

  // setup the clickables = this will allocate the array
  clickables = clickablesManager.setup();

  batSprite = createSprite(width/3 + 650, height/2);
  batSprite.addAnimation('regular', loadAnimation('assets/bat.png'));

  bunnySprite = createSprite(width/3 + 300, height/2 + 150);
  bunnySprite.addAnimation('regular', loadAnimation('assets/bunny.png'));

  owlSprite = createSprite(width/3 + 50, height/2 - 50);
  owlSprite.addAnimation('regular', loadAnimation('assets/owl.png'));

  clockSprite = createSprite(width/2 + 500, height/2);
  clockSprite.addAnimation('regular', loadAnimation('assets/clockOut.png'));

  catRingSprite = createSprite(width/2, height/2 + 40);
  catRingSprite.addAnimation('regular', loadAnimation('assets/catRing.png'));

  phoneSprite = createSprite(width/2 + 350, height/2 + 40);
  phoneSprite.addAnimation('regular', loadAnimation('assets/phone.png'));

  taserSprite = createSprite(width/2 - 350, height/2 + 40);
  taserSprite.addAnimation('regular', loadAnimation('assets/taser.png'));

  wolfSprite = createSprite(width/2, height/2+ 150, 80, 80);

  wolfSprite.addAnimation('moving', loadAnimation('assets/avatars/man1.png', 'assets/avatars/man2.png', 'assets/avatars/man3.png', 'assets/avatars/man4.png'));
  wolfSprite.velocity.x = 3;

  // create a sprite and add the 3 animations
  playerSprite = createSprite(width/2, height/2 + 200, 80, 80);

  // every animation needs a descriptor, since we aren't switching animations, this string value doesn't matter
  playerSprite.addAnimation('regular', loadAnimation('assets/avatars/littleRed1.png', 'assets/avatars/littleRed3.png', 'assets/avatars/littleRed4.png', 'assets/avatars/littleRed5.png', 'assets/avatars/littleRed1.png'));
  playerSprite.addAnimation('still', loadAnimation('assets/avatars/littleRed6.png'));
  playerSprite.addAnimation('upDown', loadAnimation('assets/avatars/littleRed6.png'));

  text1 = loadImage('assets/text1.png');
  text2 = loadImage('assets/text2.png');
  text3 = loadImage('assets/text3.png');
  text4 = loadImage('assets/text4.png');
  text5 = loadImage('assets/text5.png');
  text6 = loadImage('assets/text6.png');
  text7 = loadImage('assets/text7.png');
  text8 = loadImage('assets/text8.png');
  text9 = loadImage('assets/text9.png');

  werewolf = loadImage('assets/werewolf.png');

  taserCollected = false;
  catRingCollected = false;
  phoneCollected = false;

  // use this to track movement from toom to room in adventureManager.draw()
  adventureManager.setPlayerSprite(playerSprite);

  // this is optional but will manage turning visibility of buttons on/off
  // based on the state name in the clickableLayout
  adventureManager.setClickableManager(clickablesManager);

    // This will load the images, go through state and interation tables, etc
  adventureManager.setup();

  // call OUR function to setup additional information about the p5.clickables
  // that are not in the array 
  setupClickables(); 
}

// Adventure manager handles it all!
function draw() {
  // draws background rooms and handles movement from one to another
  adventureManager.draw();

  // draw the p5.clickables, in front of the mazes but behind the sprites 
  clickablesManager.draw();

  // No avatar for Splash screen or Instructions screen
  if( adventureManager.getStateName() !== "Splash" && 
      adventureManager.getStateName() !== "Instructions" &&
      adventureManager.getStateName() !== "Village" &&
      adventureManager.getStateName() !== "Bakery2" &&
      adventureManager.getStateName() !== "Forest1" ) {
    
  } 
}

// pass to adventure manager, this do the draw / undraw events
function keyPressed() {
  // toggle fullscreen mode
  if( key === 'f') {
    fs = fullscreen();
    fullscreen(!fs);
    return;
  }

  // dispatch key events for adventure manager to move from state to 
  // state or do special actions - this can be disabled for NPC conversations
  // or text entry   

  // dispatch to elsewhere
  adventureManager.keyPressed(key); 
}

function mouseReleased() {
  adventureManager.mouseReleased();
}

//-------------- YOUR SPRITE MOVEMENT CODE HERE  ---------------//
// 
//-------------- CLICKABLE CODE  ---------------//

function setupClickables() {
  // All clickables to have same effects
  for( let i = 0; i < clickables.length; i++ ) {
    clickables[i].onHover = clickableButtonHover;
    clickables[i].onOutside = clickableButtonOnOutside;
    clickables[i].onPress = clickableButtonPressed;
  }
}

// tint when mouse is over
clickableButtonHover = function () {
  this.color = "#FFFFFF";
  this.noTint = false;
  this.tint = "#A3C6FF";
}

// color a light gray if off
clickableButtonOnOutside = function () {
  // backto our gray color
  this.color = "#A3C6FF";
}

clickableButtonPressed = function() {
  // these clickables are ones that change your state
  // so they route to the adventure manager to do this
  adventureManager.clickablePressed(this.name); 
}

//-------------- SUBCLASSES / YOUR DRAW CODE CAN GO HERE ---------------//


// Instructions screen has a backgrounnd image, loaded from the adventureStates table
// It is sublcassed from PNGRoom, which means all the loading, unloading and drawing of that
// class can be used. We call super() to call the super class's function as needed
class InstructionsScreen extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
    // These are out variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*4;
    this.textBoxHeight = (height/6)*4; 

    // hard-coded, but this could be loaded from a file if we wanted to be more elegant
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
    // tint down background image so text is more readable
      
    // this calls PNGRoom.draw()
    super.draw();
      
    // text draw settings
    fill(255);
    textAlign(CENTER);
    textSize(60);
    textFont(considerationFont);

    // Draw text in a box
    text(this.instructionsText, width/6, height/6, this.textBoxWidth, this.textBoxHeight );
  }
}

class characterPage extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
  }
}

class charliPage1 extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
    // These are out variables in the InstructionsScreen class
    this.textBoxWidth = (width/6)*2;
    this.textBoxHeight = (height/6)*4; 

    // hard-coded, but this could be loaded from a file if we wanted to be more elegant
    // this.instructionsText = "Time to clock out for the night. It's 5PM and the sun is beginning to set. Hurry home before it gets too dark outside.";
  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();

  }
}

class allenPage1 extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
 }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
      }
}

class gwenPage1 extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {

  }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
   
   }
}

class mattPage1 extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
   }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();


  }
}

class CharliPage2 extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
   }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();

  }
}

class CharliPage3 extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
   }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
  }
}

class antiEchoPage extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
   }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
  }
}

class petitionPage1 extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
   }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
  }
}

class petitionPage2 extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
   }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
  }
}

class mattPage2 extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
   }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
  }
}

class threadPage1 extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
   }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
  }
}

class releasePage extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
   }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
  }
}

class exposedPage extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
   }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
  }
}

class errorPage extends PNGRoom {
  // preload is where we define OUR variables
  // Best not to use constructor() functions for sublcasses of PNGRoom
  // AdventureManager calls preload() one time, during startup
  preload() {
   }

  // call the PNGRoom superclass's draw function to draw the background image
  // and draw our instructions on top of this
  draw() {
      
    // this calls PNGRoom.draw()
    super.draw();
  }
}
