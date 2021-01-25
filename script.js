const { default: SlippiGame } = require('@slippi/slippi-js');
var fs = require('fs');
const { dirname } = require('path');

var dir = "";
var outputDir = dir + "json/"
if (!fs.existsSync(outputDir )){
    fs.mkdirSync(outputDir);
}
fs.readdir(dir, function (err, filenames) {
    if (err) {
        onError(err);
        return;
    }
    filenames.forEach(function (filename) {
        if (filename.endsWith(".slp")){
            convertFile(dir, filename);
        }
        
    });
});


function convertFile( dir,  filename) {
    const game = new SlippiGame(dir + filename);
    const baseFileName =  filename.replace(".slp", "");

    // Get game settings – stage, characters, etc
    const settings = game.getSettings();

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


    let frameList = [];

    var keys = Object.keys(frames);
    var min = 100000;
    var max = -10000000;

    keys.forEach(key => {
        var frameNumber = parseInt(key);
        if (frameNumber > max) {
            max = frameNumber;
        }
        if (frameNumber < min) {
            min = frameNumber;
        }
    });

    var i = min;
    while (i <= max) {

        frameList.push(frames[i]);
        i++;
    }
    console.log("Frame Length: " + (max - min));

    const newGame = {
        settings: game.getSettings(),
        frames: frameList,
    };
    fs.writeFileSync(outputDir + baseFileName + ".json", JSON.stringify(newGame, null, 2), 'utf-8'); 
}
