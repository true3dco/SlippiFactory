const { default: SlippiGame } = require("@slippi/slippi-js");
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const chokidar = require("chokidar");
const _ = require("lodash");
const slippiConverter = require("./slippiConverter");
const listenPath = process.argv[2];
const baseOutputDir = process.argv[3];

if (!listenPath || !baseOutputDir) {
  console.error("Usage: readLiveFile.js <input_dir> <base_output_dir>");
  process.exit(1);
}

if (!fs.existsSync(listenPath) || !fs.statSync(listenPath).isDirectory) {
  console.error("Directory not found:", listenPath);
  process.exit(1);
}

try {
  mkdirp.sync(baseOutputDir);
} catch (err) {
  console.error("Failed to create output directory", baseOutputDir, "-", err.message);
  process.exit(1);
}


console.log(`Listening at: ${listenPath}`);

const watcher = chokidar.watch(listenPath, {
  persistent: true,
  usePolling: true,
  ignoreInitial: true,
});

const gameByPath = {};

let batchSize = 60;
let lastBatchSent = 0;
let earliestFrameinTheMatch = 10000000;
let outputDir = "";

watcher.on("change", (watchPath) => {
  const start = Date.now();

  let gameState, settings, stats, frames, latestFrame, gameEnd;
  try {
    let game = _.get(gameByPath, [watchPath, "game"]);
    if (!game) {
      console.log(`New file at: ${watchPath}`);
      // Make sure to enable `processOnTheFly` to get updated stats as the game progresses
      game = new SlippiGame(watchPath, { processOnTheFly: true });
        
      gameByPath[watchPath] = {
        game: game,
        state: {
          settings: null,
          detectedPunishes: {},
        },
      };
    }

    gameState = _.get(gameByPath, [watchPath, "state"]);

    settings = game.getSettings();

    // You can uncomment the stats calculation below to get complex stats in real-time. The problem
    // is that these calculations have not been made to operate only on new data yet so as
    // the game gets longer, the calculation will take longer and longer
    // stats = game.getStats();

    frames = game.getFrames();
    latestFrame = game.getLatestFrame();
    gameEnd = game.getGameEnd();
  } catch (err) {
    console.log(err);
    return;
  }

  if (!gameState.settings && settings) {
    console.log(`[Game Start] New game has started`);
    //console.log(settings);
    gameState.settings = settings;
      // Start Dans BS
      var filename = watchPath.replace(/^.*[\\\/]/, '');
      filename = filename.replace("Game_", "");
      filename = filename.replace(".slp", "");

      // Reset Vars
      outputDir = path.join(baseOutputDir, filename) + path.sep;
      lastBatchSent = 0;
      earliestFrameinTheMatch = 10000000;


      slippiConverter.writeSlpInitFile(outputDir, settings);
      console.log("Init File Written");
    // End Dans BS


  }

  // Dans BS
  let numberOfFrames = _.size(frames);
  let framesToStream = numberOfFrames - lastBatchSent;

  if (framesToStream >= batchSize) {
    console.log("LatestFrame: "+ latestFrame.frame);
    if (earliestFrameinTheMatch  > 0) {
      Object.keys(frames).forEach(frameNumber => {
        let frameNum = parseInt(frameNumber);
        if (frameNum  < earliestFrameinTheMatch) {
          earliestFrameinTheMatch = frameNum ;
        }
      });
    }
    
    slippiConverter.writeSlpFrames(outputDir, frames, lastBatchSent + earliestFrameinTheMatch, framesToStream);

    lastBatchSent = numberOfFrames;
  }

  // End Dans BS

  //console.log(`We have ${numberOfFrames} frames.`);



  //lastFrameStreamed = _.frames
  _.forEach(settings.players, (player) => {
    const frameData = _.get(latestFrame, ["players", player.playerIndex]);
    if (!frameData) {
      return;
    }

    // console.log(
    //   `[Port ${player.port}] ${frameData.post.percent.toFixed(1)}% | ` + `${frameData.post.stocksRemaining} stocks`,
    // );
  });

  

  if (gameEnd) {
    // NOTE: These values and the quitter index will not work until 2.0.0 recording code is
    // NOTE: used. This code has not been publicly released yet as it still has issues
    slippiConverter.writeSlpFrames(outputDir, frames, lastBatchSent + earliestFrameinTheMatch, framesToStream, true);

    const endTypes = {
      1: "TIME!",
      2: "GAME!",
      7: "No Contest",
    };

    const endMessage = _.get(endTypes, gameEnd.gameEndMethod) || "Unknown";

    const lrasText = gameEnd.gameEndMethod === 7 ? ` | Quitter Index: ${gameEnd.lrasInitiatorIndex}` : "";
    console.log(`[Game Complete] Type: ${endMessage}${lrasText}`);
  }

  // console.log(`Read took: ${Date.now() - start} ms`);


  lastLatestFrame = latestFrame;
  
});