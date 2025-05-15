import { isTracking, trackEffects, triggerEffects,activeEffect } from "./effect";
import { toReactive } from "./reactive";
import { isArray,hasChanged } from "@vue/shared";
class RefImpl{
  public dep;
  public __v_isRef;
  public _value;
  constructor(public _rawValue){ // 原来的值
      // _rawValue如果用户传进来的值 是一个对象 我需要将对象转化成响应式
      this._value = toReactive(_rawValue)
  }


  // 类的属性访问器 最终会变成deifneProperty
  get value(){ // 取值的时候进行依赖收集
      if(isTracking()){
          trackEffects(this.dep || (this.dep = new Set()));
      }
      return this._value;
  }
  set value(newValue){ // 设置的时候触发更新
      if(newValue !== this._rawValue){
          // 先看一下之前之后是否一样
          this._rawValue = newValue;
          this._value =  toReactive(newValue);
          triggerEffects(this.dep);
      }
  }
}


function createRef(value){

    return new RefImpl(value);
}


export function ref(value){
    return createRef(value);
}
/* 
实现toRef
*/
export function toRef(target, key) {
    return new ObjectRefImpl(target,key)
  }
  class ObjectRefImpl{
    public __v_isRef = true // 标识， 是ref
    constructor(public target, public key) {
       // 出入的值
    }
    get value() {
      return this.target[this.key] // 获取值
    }
    set value(newValue) {
      this.target[this.key] = newValue
    }
  }
  /* 
   实现toRefs
  */
  export function toRefs(target) {
    // 遍历
    let ret = isArray(target) ?new Array(target.length):{}
    for(let key in target) {
      ret[key] = toRef(target,key)
    }
    return ret
  }
  