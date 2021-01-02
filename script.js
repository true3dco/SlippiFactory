const { default: SlippiGame } = require('@slippi/slippi-js');
var fs = require('fs');

const game = new SlippiGame("test.slp");

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
keys.forEach(function(key){
    frameList.push(frames[key]);
});

const newGame = {
    settings: game.getSettings(),
    frames: frameList,
};
fs.writeFileSync('./newGame.json', JSON.stringify(newGame, null, 2) , 'utf-8');