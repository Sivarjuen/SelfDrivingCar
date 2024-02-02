import { Game as MainGame } from "./game";

import { Game, Types } from "phaser";

//  Find out more information about the Game Config at:
//  https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config: Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 360,
    height: 1080,
    parent: "game-container",
    backgroundColor: "#028af8",
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [MainGame],
};

export default new Game(config);
