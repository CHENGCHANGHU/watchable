# @golden-tiger/watchable

## Functions

- `watchable`: Get a watchable object.
- `watch`: Use a watcher function to watch target's specific route property.
- `unwatch`: Stop using a watcher function to watch target's specific route property.

## Examples

```js
function simpleWatcher(newValue, oldValue) {
  console.log('watcher:', newValue, oldValue);
}

const w1 = watchable(
  {
    a: 'a',
    b: { c: 'c' },
    d: [1, 2, 3],
  },
  [
    { route: 'a', watcher: simpleWatcher, },
    { route: 'b.c', watcher: simpleWatcher, },
    { route: 'd.0', watcher: simpleWatcher, },
  ]
);

w1.a = 'new-a'; // watcher: new-a a
w1.b.c = 'new-c'; // watcher: new-c c
w1.d[0] = 10; // watcher: 10 1
console.log(w1); // { a: 'new-a', b: { c: 'new-c' }, d: [ 10, 2, 3 ] }
```

```js
const value1 = watchable({ id: 1, value: true });
const value2 = watchable({ id: 2, value: true });

// and gate
const andGate = watchable({
  dependencies: [value1, value2],
  value: value1.value && value2.value,
});

andGate.dependencies.forEach((dep) => {
  watch(dep, 'value', (newValue, oldValue) => {
    andGate.value = andGate.dependencies.reduce((acc, curr) => {
      if (curr === dep) {
        return newValue && acc;
      }
      return curr.value && acc;
    }, true);
  });
});

// or gate
const orGate = watchable({
  dependencies: [value1, value2],
  value: value1.value || value2.value,
});

orGate.dependencies.forEach((dep) => {
  watch(dep, 'value', (newValue, oldValue) => {
    orGate.value = orGate.dependencies.reduce((acc, curr) => {
      if (curr === dep) {
        return newValue || acc;
      }
      return curr.value || acc;
    }, false);
  });
});

console.log(andGate.value, orGate.value); // true true

value1.value = false;
console.log(andGate.value, orGate.value); // false true

value2.value = false;
console.log(andGate.value, orGate.value); // false false

value1.value = true;
console.log(andGate.value, orGate.value); // false true

value2.value = true;
console.log(andGate.value, orGate.value); // true true
```
