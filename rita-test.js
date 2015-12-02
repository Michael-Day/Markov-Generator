/* Markov Text Generator Thing
 * Michael Day, 2 Dec 2015
 * @mday
 *
 * This thing opens up a .txt of your choice and creates a single
 * sentence from a Markov chain using the RiTa library. [https://rednoise.org/rita/]
 * Most of the code is developed from the example on their page.
 * The display part of it uses the p5.js library. http://p5js.org/
 * Have fun with it!
 */
var lines, data, x = 160, y = 240;
var markov;
var para;
var openBrackets = 0;
var closeBrackets = 0;
var quotes = 0;
var textURL = "bartleby.txt";

// Uncomment this if you want it to regenerate on a timed basis.
//setInterval(regenerate, 10000);

function setup(){
  // This uses p5.js to set up the divs and so on in the HTML page.
  // (There must be a more efficient way of doing this!)
  instructs = createDiv();
  instructs.class("instructions");
  instructs.html("Please enter the filename of your text & click the button.");
  gap0 = createDiv();
  gap0.html(" ");
  gap0.class("instructions");
  gap1 = createDiv();
  gap1.class("instructions");
  gap1.html("Once loaded, press space to regenerate the text.");
  gap2 = createDiv();
  gap2.html(" ");
  gap2.class("instructions");
  input = createInput("bartleby.txt");
  input.size(350);
  input.class("instructions");
  button = createButton("Load text");
  button.class("instructions");

  // Loads in the text file when the button is pressed.
  // (No error checking at present.)
  button.mousePressed(loadText);
}

function loadText(){
  console.log("Loading file \'" + input.value() + "\'");
  textURL = input.value();
  data = loadStrings(textURL, doSetup);
}

function doSetup(){
  // These lines move the button, input, and instructions off-screen.
  input.position(-200, -200);
  button.position(-200, -200);
  instructs.position(-300, -300);
  gap1.position(-300, -300);
  gap0.position(-300, -300);
  gap2.position(-300, -300);

  lines = ["start"];
  // You can change this argument from 2 to whatever you want.
  // 2 is the minimum, your results will vary depending on your text.
  markov = new RiMarkov(2);
  markov.loadText(data.join(' '));
  para = createDiv(generateIt());
  para.id("textt");
  windowResized();
}

function generateIt() {
  lines = markov.generateSentences(1);
  console.log(lines[0]);

  //check for punctuation errors: trim out single ' and ( or ) chars
  for(var q = 0; q < lines[0].length; q++){
    if(lines[0].charAt(q) == "\'") {
      if(lines[0].charAt(q+1) != 's' ){
        if(lines[0].charAt(q+1) != 'm'){
          if(lines[0].charAt(q+1) != 't'){
            quotes++;
          }
        }
      }
    }
    if(lines[0].charAt(q) == "\(") {
      openBrackets++;
    }
    if(lines[0].charAt(q) == "\)") {
      closeBrackets++;
    }
  }
  if (closeBrackets != openBrackets){
    if(openBrackets > closeBrackets){
      console.log("* removed an open bracket");
      lines[0] = lines[0].split('\(').join('');
    } else {
      console.log("* removed a close bracket");
      lines[0] = lines[0].split('\)').join('');
    }

  }
  if (quotes % 2 != 0){
    //    console.log("quotes % 2 != 0 " + (quotes % 2));
    console.log("* quotes " + quotes + "; removing the quote");
    lines[0] = lines[0].replace('\'', ''); // Remove the first one
  }
  openBrackets = 0;
  closeBrackets = 0;
  quotes = 0;
  return(lines[0]);
}

function windowResized() {
  // sets the type size depending on the window size
  if(para){
    if(windowWidth > 1000){
      para.style("font-size","2.6em");
    } else if (windowWidth > 500) {
      para.style("font-size","2.1em");
    } else if (windowWidth < 499) {
      para.style("font-size","1.7em");
    }
  }
}
function keyReleased(){
  // press the spacebar to regenerate the text.
  if (key == " "){
    regenerate();
  }
}
function regenerate() {
  if(para){
    para.html(generateIt());
  }
}
