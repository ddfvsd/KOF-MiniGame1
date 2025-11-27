import { GameMap } from '/static/js/game_map/base.js';
import { Kyo } from '/static/js/player/kyo.js';

class KOF {
    constructor(id, selectedCharacters = ['kyo', 'kyo']) {
        this.$kof = $('#' + id);
        this.selectedCharacters = selectedCharacters;

        this.game_map = new GameMap(this);
        this.players = this.createPlayers();
    }

    createPlayers() {
        const players = [];

        // 创建玩家1
        players.push(this.createPlayer(0, this.selectedCharacters[0], {
            id: 0,
            x: 200,
            y: 0,
            width: 150,
            height: 200,
            color: 'blue',
        }));

        // 创建玩家2
        players.push(this.createPlayer(1, this.selectedCharacters[1], {
            id: 1,
            x: 500,
            y: 0,
            width: 150,
            height: 200,
            color: 'red',
        }));

        return players;
    }

    createPlayer(id, character, info) {
        // 根据选择的角色创建对应的玩家实例
        switch (character) {
            case 'kyo':
            default:
                return new Kyo(this, info);
        }
    }
}

export {
    KOF
}