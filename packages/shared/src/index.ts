export function isObject(value: unknown): value is Record<any, any> {
  return typeof value === 'object' && value !== null
}

export function isFunction(value): boolean {
  return typeof value === 'function'
}
export function isString(value) {
  return typeof value === 'string'
}

export const enum ShapeFlags {
  ELEMENT = 1, // 元素
  FUNCTIONAL_COMPONENT = 1 << 1, // 函数式组件
  STATEFUL_COMPONENT = 1 << 2, // 普通组件
  TEXT_CHILDREN = 1 << 3, // 孩子是文本
  ARRAY_CHILDREN = 1 << 4, // 孩子是数组
  SLOTS_CHILDREN = 1 << 5, // 组件插槽
  TELEPORT = 1 << 6, // teleport组件
  SUSPENSE = 1 << 7, // suspense组件
  COMPONENT = ShapeFlags.STATEFUL_COMPONENT | ShapeFlags.FUNCTIONAL_COMPONENT 	// 组件
}
const hasOwnProperty = Object.prototype.hasOwnProperty
export const hasOwn = (value,key) => hasOwnProperty.call(value,key);
/*
let r = ShapeFlags.ELEMENT | ShapeFlags.FUNCTIONAL_COMPONENT; // r包含元素和函数式组件
// 我们像看r 是不是元素
(r & ShapeFlags.ELEMENT) > 0; // 说明包含元素
(r & ShapeFlags.FUNCTIONAL_COMPONENT) > 0
*/


  // 二进制  00000100  位移  | & 是做权限必备的一个操作 
  // | 来组合权限 & 来判断是否包含某个权限
//   001 |  010 => 011  =3    011 & 001 = 001   011 & 010 => 010   011 & 100  -> 000
  // 001
  // 010
  // 100

  export const isArray = Array.isArray
export const isNumber = (val) => typeof val === 'number'
// 判断key是不是整数
export const isIntegerKey = (key) => '' + parseInt(key) === key

export const hasChanged = (value, oldValue) => value === oldValue