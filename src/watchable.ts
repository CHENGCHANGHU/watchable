const _ListenersMap = new Map();
const WatchedSymbol = Symbol('watched');

/**
 * Get the proxy object of the route target.
 * In other word, get the parent proxy of the route target.
 * @param {*} target proxy
 * @param {*} route target route
 * @returns 
 */
function findProxy(target: any, route?: string) {
  let proxy = target;
  let prop = route;
  if (typeof route === 'string' && route.includes('.')) {
    const props = route.split('.');
    proxy = props.slice(0, -1).reduce((acc, curr) => Reflect.get(acc, curr, acc), target);
    prop = props[props.length - 1];
  }
  return { proxy, prop };
}

/**
 * Get a watchable object.
 * @param {*} target watched object
 * @param {*} watchers watchers
 * @returns 
 */
export function watchable(target: any, watchers?: Function[]) {
  if (typeof target !== 'object') {
    // Only support object type target
    throw new Error('First parameter target is not an object!');
  }
  Object.entries(target).forEach(([k, v]: [any, any]) => {
    if (typeof v === 'object' && !v[WatchedSymbol]) {
      // If target is not watched, watch it recursively.
      target[k] = watchable(v);
    }
  });
  const handler = {
    get(t: any, p: string, r: any) {
      if (typeof p === 'string' && p.includes('.')) {
        return p.split('.').reduce((acc, curr) => Reflect.get(acc, curr, r), t);
      }
      return Reflect.get(t, p, r);
    },
    set(t: any, p: string, v: any, r: any) {
      // Get the specified property and its parent proxy
      const { proxy, prop } = findProxy(r, p);
      // Get the key of specified property and its parent proxy
      const targetListenersKey = [..._ListenersMap.keys()].find(
        ({ proxy: _proxy, prop: _prop }) => proxy === _proxy && prop === _prop
      );
      if (targetListenersKey) {
        // Execute watcher function
        // Is there any need to solve async function?
        _ListenersMap.get(targetListenersKey).forEach((watcher: Function) => {
          Reflect.apply(watcher, undefined, [v, Reflect.get(proxy, prop, proxy)]);
        });
      }
      Reflect.set(t, prop, v, proxy);
      return true;
    }
  };

  // Create proxy
  const proxy = new Proxy(target, handler);

  // Handle watcher array
  if (Array.isArray(watchers)) {
    watchers.forEach(({ route, watcher }: any) => {
      if (!route || !watcher || !(watcher instanceof Function)) {
        throw new Error('Invalid route or watcher!');
      }
      watch(proxy, route, watcher);
    });
  }

  Reflect.defineProperty(proxy, WatchedSymbol, {
    value: true,
    writable: false,
    enumerable: false,
    configurable: false,
  });
  return proxy;
}

/**
 * Use a watcher function to watch target's specific route property.
 * @param target 
 * @param route 
 * @param watcher 
 */
export function watch(target: any, route: string, watcher: Function) {
  const { proxy, prop } = findProxy(target, route);
  const targetListenersKey = [..._ListenersMap.keys()].find(
    ({ proxy: _proxy, prop: _prop }) => _proxy === proxy && _prop === prop
  );
  if (targetListenersKey) {
    _ListenersMap.get(targetListenersKey).push(watcher);
  } else {
    _ListenersMap.set({ proxy, prop }, [watcher]);
  }
}

/**
 * Stop using a watcher function to watch target's specific route property.
 * @param target 
 * @param route 
 * @param watcher 
 */
export function unwatch(target: any, route: string, watcher: Function) {
  const { proxy, prop } = findProxy(target, route);
  const targetListenersKey = [..._ListenersMap.keys()].find(
    ({ proxy: _proxy, prop: _prop }) => _proxy === proxy && _prop === prop
  );
  if (targetListenersKey) {
    const watchers = _ListenersMap.get(targetListenersKey);
    if (watchers.includes(watcher)) {
      watchers.splice(watchers.indexOf(watcher), 1);
    }
  }
}
