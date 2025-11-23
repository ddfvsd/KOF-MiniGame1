import { AcGameObject } from '/KOF-MiniGame/static/js/ac_game_object/base.js';
//实现玩家
export class Player extends AcGameObject{
    constructor(root,info){
        super();
//人物的基本属性
        this.root = root; // 游戏根对象
        this.id = info.id; // 玩家ID (0或1)
        this.x = info.x; //x坐标
        this.y = info.y; // y坐标
        this.width = info.width;// 宽度
        this.height = info.height; // 高度
        this.color = info.color;// 颜色
//人物的移动属性
        this.direction = 1; // 朝向

        this.vx = 0;// x轴速度
        this.vy = 0; // y轴速度
        this.ctx = this.root.game_map.ctx;
        this.speedx =400; //水平速度
        this.speedy = -1000; // 跳起的初始速度
        this.gravity = 50; // 重力加速度
        this.pressed_keys = this.root.game_map.controller.pressed_keys;
        this.status = 3 ; // 0:idle , 1:x向前 2. 向后 3. 跳跃 4. 攻击 5.被打 6.死亡
        this.animations = new Map();//将状态的动作存到数组里面
        this.frame_current_cnt = 0;//当前记录多少帧
//人物的生命值设定
        this.hp = 100; //社为100生命值
        this.$hp = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);
        this.$hp_div = this.$hp.find('div');

       }

    start(){


    }

    update_control(){
        // 根据玩家ID分配不同的按键
        let w ,a ,d,space;
        if(this.id === 0){
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        }else{
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowrRight');
            space = this.pressed_keys.has('Enter');
        }
        //将人物的状态进行转变
        if (this.status === 0 || this.status === 1) {
            if (space) {
                this.status = 4; // 攻击
                this.vx = 0;
                this.frame_current_cnt = 0;
            } else if (w) {
                // 实现跳跃
                if (d) {
                    this.vx = this.speedx;
                } else if (a) {
                    this.vx = -this.speedx;
                } else {
                    this.vx = 0;
                }
                this.vy = this.speedy;
                this.status = 3;
                this.frame_current_cnt = 0;
            } else if (d) {
                //实现右移
                this.vx = this.speedx;
                this.status = 1;
            } else if (a) {
                //实现左移
                this.vx = -this.speedx;
                this.status = 1;
            } else {
                this.status = 0;
                this.vx = 0;
            }
        }
    }
    update_move(){
        this.vy += this.gravity;// 重力加速
        this.x += this.vx * this.timedelta / 1000;// x轴移动
        this.y += this.vy * this.timedelta / 1000;// y轴移动
//往下掉的时候不能持续向下，需定义一个指标
        if(this.y > 450){
            this.y = 450;
            this.vy = 0;
            this.status = 0;

            if (this.status === 3) this.status = 0;
        }
// 定义边界
        if(this.x< 0){
            this.x = 0;
        }else if (this.x + this.width > this.root.game_map.$canvas.width()){
            this.x = this.root.game_map.$canvas.width() - this.width;
        }
    }
//更新方向
    update_direction() {

        if (this.status === 6) return;

        let players = this.root.players;

        if (players[0] && players[1]) {
            let me = this, you = players[1 - this.id];
            if (me.x < you.x) me.direction = 1;// 对手在右边，朝右
            else me.direction = -1;
        }
    }
//被攻击后受伤跟生命值减少
    is_attack() {
        if (this.status === 6) return;

        this.status = 5;
        this.frame_current_cnt = 0;
        this.hp = Math.max(this.hp - 20, 0); // 实现扣血
// 改变血条动画
        this.$hp_div.animate({
            width: this.$hp.parent().width() * this.hp / 100,
        }, 300);

        this.$hp.animate({
            width: this.$hp.parent().width() * this.hp / 100,
        }, 600);

        //this.$hp.width(this.$hp.parent().width() * this.hp / 100);
// 死亡判断
        if (this.hp === 0) {
            this.status = 6;// 死亡状态
            this.frame_current_cnt = 0;
            this.vx = 0;
        }
    }
//检测是否被碰撞
    is_collition(r1, r2) {
        if (Math.max(r1.x1, r2.x1) > Math.min(r1.x2, r2.x2))
            return false;
        if (Math.max(r1.y1, r2.y1) > Math.min(r1.y2, r2.y2))
            return false;

        return true;
    }
//攻击
    update_attack() {
        // 在攻击动画的特定帧检测碰撞
        if (this.status === 4 && this.frame_current_cnt === 18) {
            let me = this, you = this.root.players[1 - this.id];
             // 创建攻击区域矩形
            let r1;
            if (this.direction > 0) {
                r1 = {
                    x1: me.x + 120,
                    y1: me.y + 43,
                    x2: me.x + 120 + 100,
                    y2: this.y + 43 + 20,
                }
            } else {
                r1 = {
                    x1: me.x - 100,
                    y1: this.y + 43,
                    x2: me.x - 100 + 100,
                    y2: me.y + 43 + 20,
                }
            }

            let r2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height,
            };
// 检测是否受到碰撞
            if (this.is_collition(r1, r2)) {// 对手受到攻击
                you.is_attack();
            }
        }
    }

    update() {
        this.update_control();
        this.update_move();
        this.update_direction();
        this.update_attack();

        this.render();
    }

    render(){
        // this.ctx.fillStyle = this.color;
        // this.ctx.fillRect(this.x, this.y, this.width, this.height);

        let status = this.status;

        if (status === 1 && this.direction * this.vx < 0) {
            status = 2;
        }

        let obj = this.animations.get(status);
        if (obj && obj.loaded) {
            if (this.direction > 0) {
                 // 朝右渲染
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            } else {
                this.ctx.save();
                this.ctx.scale(-1, 1);
                this.ctx.translate(-this.root.game_map.$canvas.width(), 0);

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.root.game_map.$canvas.width() - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

                this.ctx.restore();
            }
        }
   // 特殊状态动画结束处理
        if (status === 4 || status === 5 || status === 6) {
            if (this.frame_current_cnt === obj.frame_rate * (obj.frame_cnt - 1)) {
                if (status === 6) {
                    this.frame_current_cnt--;// 死亡状态保持最后一帧
                } else {
                    this.status = 0;// 回到待机状态
                }
            }
        }

        this.frame_current_cnt++;
    }
};
