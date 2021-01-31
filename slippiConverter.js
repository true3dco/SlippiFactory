const { default: SlippiGame } = require('@slippi/slippi-js');
var fs = require('fs');
const { dirname } = require('path');

var dir = "./Slippi/";
var outputDir = dir + "json/"



if (require.main === module) {
    console.log('called directly');

    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    fs.readdir(dir, function (err, filenames) {
        if (err) {
            onError(err);
            return;
        }
        filenames.forEach(function (filename) {
            if (filename.endsWith(".slp")) {
                convertFile(dir, filename);
            }
        });
    });
}

function convertFile(dir, filename) {
    const game = new SlippiGame(dir + filename);
    const baseFileName = filename.replace(".slp", "");

    // Get game settings – stage, characters, etc
    const settings = game.getSettings();
    console.log(settings.players[0].nametag);
    console.log(settings.players[1].nametag);

    // Get metadata - start time, platform played on, etc
    const metadata = game.getMetadata();
    console.log(metadata.players);

    // Get computed stats - openings / kill, conversions, etc
    const stats = game.getStats();
    //console.log(stats);

    // Get frames – animation state, inputs, etc
    // This is used to compute your own stats or get more frame-specific info (advanced)
    const frames = game.getFrames();
    //console.log(frames[0].players); // Print frame when timer starts counting down


    let frameList = convertFramesIntoOrderedFrameList(frames);
    console.log("Frame Length: " + (max - min));

    const newGame = {
        settings: game.getSettings(),
        metaData: metadata,
        frames: frameList,
    };
    fs.writeFileSync(outputDir + baseFileName + ".json", JSON.stringify(newGame, null, 2), 'utf-8');
}

function convertFramesIntoOrderedFrameList(frames){
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

    return frameList;
}

function getRelevantFrames(frames, start, framesToStream) {
    let frameList = [];
    let i = start;
    while (i < start + framesToStream) {
        frameList.push(frames[i]);
        i++;
    }
    return frameList;
}

function writeSlpInitFile(outputDir, settings) {
    // Write all the top level meta data to a slp file in a directory with the file name
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, {
            recursive: true
        });
    }
    const newGame = {
        settings: settings,
    };
    console.log("New Game Set");
    fs.writeFileSync(outputDir + "init" + ".json", JSON.stringify(newGame, null, 2), 'utf-8');
}

function writeSlpFrames(outputDir, frames, start, end, isFinal=false) {
    //let frameList = convertFramesIntoOrderedFrameList(frames);
    let frameList = getRelevantFrames(frames,start,end);
    console.log("start: "+ start);
    console.log("values to stream: " + end);

    const framesToStream = {
        frames: frameList,
    };
    let outputName = outputDir+start+"_"+ end;
    if (isFinal) {
         outputName += "_FINAL";
    }
    // Sort Frames then write as JSON
    fs.writeFileSync(outputName + ".json", JSON.stringify(framesToStream, null, 2), 'utf-8');
}

module.exports = {
    writeSlpInitFile,
    writeSlpFrames,
    convertFile,
    printing: function () { console.log("workING"); }
}
