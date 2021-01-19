var fs = require('fs');

var moveFrom = "D:/UnityProjects/SmashFactory/Assets/Resources/CharacterPrefabs/Fox/Animation/";





fs.readdir(moveFrom, function (err, files) {
    if (err) {
        console.error("Could not list the directory.", err);
        process.exit(1);
    }


    files.forEach((file, index) => {

        var newName = file;
        newName = newName.replace("PlyFox5K_Share_ACTION_", "");
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


//PlyFox5K_Share_ACTION_


var vals = {

    "fox": "PlyFox5K_Share_ACTION_",

}
