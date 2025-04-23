// TODO 全局变量 让 属性 跟 effect 关联起来
export let activeEffect = undefined

function cleanUpEffect(effect) {
    // TODO 清除依赖 清理上一次的依赖避免死循环 先删除 后加上
   for(let i = 0; i < effect.deps.length; i++) {
        const dep = effect.deps[i];
        dep.delete(effect);
    }
    effect.deps.length = 0;
}

export class ReactiveEffect{
    // 默认 会将 fn 挂在到类的实例上
    constructor(private fn, public scheduler?) {
       this.fn = fn;
    }
    parent = undefined;
    deps = [] //TODO  我依赖了哪些属性
    active = true; // 是否激活

    run() {
        // 不收集依赖
      if(!this.active) {
        return this.fn();
      }
      try{
        this.parent = activeEffect;
        activeEffect = this;
        // TODO cleanUpEffect(this); 先删除所有依赖
        cleanUpEffect(this);
        return this.fn();
      }finally{
        activeEffect = this.parent;
        this.parent = undefined
      }
    }

    stop() {
        console.log('stop')
      // 虽然这里亭子了
        if(this.active) {
            this.active = false;
            cleanUpEffect(this)
        }
    }
}




//TODO  effect 调度
export function effect(fn,options:any = {}) {


    // 创建一个响应式的effect 并且让它执行

    const _effect = new ReactiveEffect(fn,options.scheduler);
    _effect.run();
    // 
    // 把runner 方法直接给用户
    const runner = _effect.run.bind(_effect);
    //TODO  可以通过runner.effect 访问到 effect 的实例
    runner.effect = _effect;
    return runner
}
const targetMap = new WeakMap();
export function track(target,key) {
    // 让这个对象上的属性 记录当前的activeEffect

    console.log('activeEffect',activeEffect)

    if(activeEffect) { // 说明用户在effect 使用数据

        let depsMap = targetMap.get(target);
        // 如果没有 创建一个映射表
        if(!depsMap) {
            targetMap.set(target, (depsMap = new Map()));
        }


        let dep = depsMap.get(key);
        if(!dep) {
            depsMap.set(key, (dep = new Set()));
        }

        let shouldTrack = !dep.has(activeEffect);
        // 看下 set 里 是否有这个effect
        if(shouldTrack) {
            dep.add(activeEffect);
            activeEffect.deps.push(dep);
        }



    }

    console.log('targetMap',targetMap)
    
}

export function trigger(target,key,value,oldValue) {
    // 通过对象上的属性 让这个属性对应的effect 重新执行


    const depsMap = targetMap.get(target)

    if(!depsMap) {
        return;
    }
    const dep = depsMap.get(key);
    if(!dep) {
        return;
    }
    const effects = [...dep]
    effects.forEach((effect:any) => {

        if(effect !== activeEffect) {
            // TODO  避免无限循环  如果不是当前的effect 就执行
            // 让这个 effect 执行
            // TODO 调度
            if(effect.scheduler) {
                effect.scheduler();
            }else {
                effect.run();
            }
        }
    })

}