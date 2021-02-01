var fs = require('fs');

var character= "Young_Link";
var prefixToRemove ="Clink";
var moveFrom = "D:/Repo/SlippiUnityVisualizer/Assets/Resources/CharacterPrefabs/" +character+ "/Animation/";




fs.readdir(moveFrom, function (err, files) {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }


    files.forEach((file, index) => {

        var newName = file;
        var prefix = "Ply" + prefixToRemove + "5K_Share_ACTION_";
        //console.log(prefix);
        newName = newName.replace(prefix, "");
        newName = newName.replace("_figatree", "");
        console.log(newName);
        fs.rename(moveFrom +file, moveFrom + newName, function (error) {
            if (error) {
                console.error("File moving error.", error);
            } else {
                console.log("Moved file '%s' to '%s'.", file, newName);
            }});

    });
});

