import { ReactiveFlags } from "./constants";
import { activeEffect,track,trigger } from "./effect";
import { isObject } from "@vue/shared";
import { reactive } from "./reactive";



export const mutableHandler = {
    get(target, key) {
        console.log("get", key);
        console.log("activeEffect",activeEffect)
        if(key === ReactiveFlags.IS_REACTIVE) {
            return true;
        }

    // TODO 递归代理  只有取值的时候 才去 代理 所以性能更好
    if(isObject(target[key])) {
        return reactive(target[key]);
    }
        // 依赖收集 

        const res = Reflect.get(target, key);

        track(target, key);
        return res
    },
    set(target, key, value) {
        let oldValue = target[key];
        console.log("set", key, value);
        const r =  Reflect.set(target, key, value);

        if(oldValue !== value) {
            // TODO 触发更新
            trigger(target, key,value,oldValue);
        }

        return r
    },
}


