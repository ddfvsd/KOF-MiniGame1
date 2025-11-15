import { Player } from '/static/js/player/base.js';
import { GIF } from '/static/js/utils/gif.js';

export class Kyo extends Player {
    constructor(root, info) {
        super(root, info);

        this.init_animation();
    }

    init_animation() {
        let outer = this;
        let offsets = [0, -22, -22, -140, 0, 0, 0];
        for (let i = 0; i < 7; i++) {
            let gif = GIF();
            gif.load(`/KOF-MiniGame/static/images/player/kyo/${i}.gif`);
            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,//存多少帧
                frame_rate: 10,//每秒涮帧速率
                offset_y: offsets[i],//偏移量
                loaded: false,//有没有被加载出来
                scale: 2,//放大多少倍
            });

            gif.onload = function () {
                let obj = outer.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;
            }
        }
    }
};
