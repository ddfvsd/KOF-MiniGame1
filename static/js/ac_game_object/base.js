//为了将每个对象元素刷新一遍，则建一个数组
let AC_GAME_OBJECTS = [] ;

class AcGameObject{
    constructor(){
        AC_GAME_OBJECTS.push(this);

        this.timedalta = 0 ;//这一帧与上一帧的时间间隔
        this.has_call_start = false;
    }

    start(){ //初始执行一次

    }

    update(){ //每一帧执行一次（除了第一帧以外）

    }

    destory(){ //删除当前对象
        for(let i in AC_GAME_OBJECTS){
            if(AC_GAME_OBJECTS[i] === this){
                AC_GAME_OBJECTS.splice(i,1);//删除元素
                break;
            }
        }

    }
}

let last_timestap;

let AC_GAME_OBJECTS_FRAME = (timestap) => {
    for(let obj of AC_GAME_OBJECTS){
        if(!obj.has_call_start){
            obj.start();
            obj.has_call_start = true;
        } else {
            obj.timedalta = timestap - last_timestap;
            obj.update();
        }
    }

    last_timestap = timestap;
    requestAnimationFrame(AC_GAME_OBJECTS_FRAME);//递归

}

requestAnimationFrame(AC_GAME_OBJECTS_FRAME);

export{
    AcGameObject
}