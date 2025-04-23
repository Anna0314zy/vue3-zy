var VueReactivity = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // packages/reactivity/src/index.ts
  var src_exports = {};
  __export(src_exports, {
    effect: () => effect,
    reactive: () => reactive
  });

  // packages/reactivity/src/effect.ts
  function effect() {
    console.log("effect");
  }

  // packages/shared/src/index.ts
  var isObject = (val) => {
    return val !== null && typeof val === "object";
  };

  // packages/reactivity/src/handler.ts
  var mutableHandler = {
    get(target, key) {
      console.log("get", key);
      return Reflect.get(target, key);
    },
    set(target, key, value) {
      console.log("set", key, value);
      return Reflect.set(target, key, value);
    }
  };

  // packages/reactivity/src/reactive.ts
  console.log(isObject({}));
  var reactiveMap = /* @__PURE__ */ new WeakMap();
  function reactive(target) {
    return createReactiveObject(target);
  }
  function createReactiveObject(target) {
    if (!isObject(target)) {
      return target;
    }
    let existingProxy = reactiveMap.get(target);
    if (existingProxy) {
      return existingProxy;
    }
    const proxy = new Proxy(target, mutableHandler);
    reactiveMap.set(target, proxy);
    return proxy;
  }
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=reactivity.global.js.map
