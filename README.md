# SlippiFactory
A collection of scripts that are useful for working with slippi files and related assets


`script.js` - Turns `slp` into `json` files that are deserializable  by Unity
`renameAnimation.js` - rename animations to a standard naming system across characters
`fbxConverter.js` - convert `.anims` to `.fbx` in maya 2020

## Usage
0. `npm install`
1. Update the code in `script.js` to point to the `.slp` you want to convert in the `Slippi` folder
2. run `node script`
3. observe the output json in the `json` folder
