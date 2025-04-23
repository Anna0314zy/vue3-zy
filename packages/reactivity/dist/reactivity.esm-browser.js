// packages/reactivity/src/effect.ts
var activeEffect = void 0;
function cleanUpEffect(effect2) {
  for (let i = 0; i < effect2.deps.length; i++) {
    const dep = effect2.deps[i];
    dep.delete(effect2);
  }
  effect2.deps.length = 0;
}
var ReactiveEffect = class {
  constructor(fn, scheduler) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.parent = void 0;
    this.deps = [];
    this.active = true;
    this.fn = fn;
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      cleanUpEffect(this);
      return this.fn();
    } finally {
      activeEffect = this.parent;
      this.parent = void 0;
    }
  }
  stop() {
    console.log("stop");
    if (this.active) {
      this.active = false;
      cleanUpEffect(this);
    }
  }
};
function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler);
  _effect.run();
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
var targetMap = /* @__PURE__ */ new WeakMap();
function track(target, key) {
  console.log("activeEffect", activeEffect);
  if (activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = /* @__PURE__ */ new Set());
    }
    let shouldTrack = !dep.has(activeEffect);
    if (shouldTrack) {
      dep.add(activeEffect);
      activeEffect.deps.push(dep);
    }
  }
  console.log("targetMap", targetMap);
}
function trigger(target, key, value, oldValue) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const dep = depsMap.get(key);
  if (!dep) {
    return;
  }
  const effects = [...dep];
  effects.forEach((effect2) => {
    if (effect2 !== activeEffect) {
      if (effect2.scheduler) {
        effect2.scheduler();
      } else {
        effect2.run();
      }
    }
  });
}

// packages/shared/src/index.ts
var isObject = (value) => {
  return value != null && typeof value === "object";
};

// packages/reactivity/src/handler.ts
var mutableHandler = {
  get(target, key) {
    console.log("get", key);
    console.log("activeEffect", activeEffect);
    if (key === "__v_isReactive" /* IS_REACTIVE */) {
      return true;
    }
    if (isObject(target[key])) {
      return reactive(target[key]);
    }
    const res = Reflect.get(target, key);
    track(target, key);
    return res;
  },
  set(target, key, value) {
    let oldValue = target[key];
    console.log("set", key, value);
    const r = Reflect.set(target, key, value);
    if (oldValue !== value) {
      trigger(target, key, value, oldValue);
    }
    return r;
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
  if (target["__v_isReactive" /* IS_REACTIVE */]) {
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
function isReactive(value) {
  return value["__v_isReactive" /* IS_REACTIVE */];
}
export {
  ReactiveEffect,
  activeEffect,
  effect,
  isReactive,
  reactive,
  track,
  trigger
};
//# sourceMappingURL=reactivity.esm-browser.js.map
