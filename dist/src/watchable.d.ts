/**
 * Get a watchable object.
 * @param {*} target watched object
 * @param {*} watchers watchers
 * @returns
 */
export declare function watchable(target: any, watchers?: Function[]): any;
/**
 * Use a watcher function to watch target's specific route property.
 * @param target
 * @param route
 * @param watcher
 */
export declare function watch(target: any, route: string, watcher: Function): void;
/**
 * Stop using a watcher function to watch target's specific route property.
 * @param target
 * @param route
 * @param watcher
 */
export declare function unwatch(target: any, route: string, watcher: Function): void;
