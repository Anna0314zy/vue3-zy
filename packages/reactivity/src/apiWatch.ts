// watch api 用法很多，常见写法就是监控一个函数的返回值，根据返回值的变化触发对应的函数
// watch 可以传递一个响应式对象，可以监控到对象的变化触发回调

import { isFunction, isObject } from "@vue/shared";
import { isReactive } from "./reactive";
import { ReactiveEffect } from "./effect";
// = 深拷贝, seen防止死循环
function traverse(value, seen = new Set()) {
   if (!isObject(value)) {
      return value;
    }
    // 如果已经循环了这个对象，那么在循环会导致死循环
    if (seen.has(value)) {
      return value;
    }
    seen.add(value);
    for (const key in value) {
      traverse(value[key], seen); // 触发属性的hetter
    }
    return value;
}

// 必须监听的是响应式对象
export function watch(source,cb) {
let getter;
   if(isReactive(source)) {
      // 对所有对象的属性进行监听
      getter = () => traverse(source); // 👈 深度触发依赖收集

   }else if(isFunction(source)) {
       // 监听函数
        getter = source;
   }
   let oldValue;

   console.log('wacth',getter,source,cb)

   // TODO 数据变化会执行对应的schedule getter fn  收集当前的依赖
   const effect = new ReactiveEffect(getter,() => {
      // TODO 数据变化之后 会执行
      const newValue = effect.run(); // 需要手动执行
      cb(newValue,oldValue);

    
   
   })
   oldValue = effect.run();
}