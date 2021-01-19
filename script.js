const { default: SlippiGame } = require('@slippi/slippi-js');
var fs = require('fs');
var fileName = "Game_SFATvHungryBox";
const game = new SlippiGame("./Slippi/"+fileName + ".slp");

// Get game settings – stage, characters, etc
const settings = game.getSettings();
console.log(settings);

// Get metadata - start time, platform played on, etc
const metadata = game.getMetadata();
//console.log(metadata);

// Get computed stats - openings / kill, conversions, etc
const stats = game.getStats();
//console.log(stats);

// Get frames – animation state, inputs, etc
// This is used to compute your own stats or get more frame-specific info (advanced)
const frames = game.getFrames();
//console.log(frames[0].players); // Print frame when timer starts counting down
console.log(game.getFrames()[500].players);


let frameList = [];

var keys = Object.keys(frames);
var min = 100000;
var max = -10000000;
console.log(keys);

keys.forEach( key=> {
    var frameNumber = parseInt(key);
    if (frameNumber > max){
        max = frameNumber;
    }
    if (frameNumber < min) {
        min = frameNumber;
    }
});

console.log(min);
console.log(max);
var i = min;
while (i <= max) {

    frameList.push(frames[i]);
    i++;
}
console.log( "Frame Length: " + (max - min));

const newGame = {
    settings: game.getSettings(),
    frames: frameList,
};
fs.writeFileSync('./Json/' + fileName+ ".json", JSON.stringify(newGame, null, 2) , 'utf-8');``