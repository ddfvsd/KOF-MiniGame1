//为了将每个对象元素刷新一遍，则建一个数组，设置全局数组，可以
let AC_GAME_OBJECTS = [] ;

class AcGameObject{
    constructor(){
        AC_GAME_OBJECTS.push(this);//这个可以实现每个新建的对象自动加入开始定义的全局数组中

        this.timedalta = 0 ;//这一帧与上一帧的时间间隔
        this.has_call_start = false;//这个start有没有被调用
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
//实现一个动画循环
let AC_GAME_OBJECTS_FRAME = (timestap) => {
    for(let obj of AC_GAME_OBJECTS){
        //判断有没有执行过
        if(!obj.has_call_start){
            obj.start();//如果没有的话首次执行初始化
            obj.has_call_start = true;
        } else {
            obj.timedalta = timestap - last_timestap;//来计算时间差
            obj.update();
        }
    }

    last_timestap = timestap;
    requestAnimationFrame(AC_GAME_OBJECTS_FRAME);//递归

}

requestAnimationFrame(AC_GAME_OBJECTS_FRAME);
//将其抛出
export{
    AcGameObject
}
