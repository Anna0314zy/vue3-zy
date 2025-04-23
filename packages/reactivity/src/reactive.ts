import { isObject } from "@vue/shared";
import { mutableHandler } from "./handler";
import { ReactiveFlags } from "./constants";
import { activeEffect } from "./effect";
console.log(isObject({})); // true
const reactiveMap = new WeakMap();


export function reactive(target) {
   
    return createReactiveObject(target);
}

function createReactiveObject(target) {

    if (!isObject(target)) {
        return target;
    }


    // 如果代理过了 就不需要再代理了
    if(target[ReactiveFlags.IS_REACTIVE]) {
        return target;
    }
    let existingProxy = reactiveMap.get(target);
    if (existingProxy) {
        return existingProxy;
    }
    const proxy =  new Proxy(target, mutableHandler);
    // TODO 做个缓存  如果已经被代理过 就不需要再代理了
    reactiveMap.set(target, proxy);
    return proxy;
}


export function isReactive(value) {
    return value[ReactiveFlags.IS_REACTIVE];
  }