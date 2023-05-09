let currentCallback;

function signal(value) {
  const callbacks = [];
  function getter() {
    if (currentCallback) { callbacks.push(currentCallback) }
    return value;
  }

  getter.set = (newValue) => {
    value = newValue;
    callbacks.forEach(cb => cb());
  }
  
  return getter;
}

function effect(callback) {
  currentCallback = callback;
  callback();
  currentCallback = undefined;
}

const a = signal(0);
const b = signal('a');

effect(() => console.log(`This effect depends from a: ${a()}`));
effect(() => console.log(`This effect depends from b: ${b()}`));
effect(() => console.log(`This effect depends from a: ${a()} and b: ${b()}`));

a.set(1);
b.set('b');

function computed(fn) {
  const s = signal(null);
  effect(() => s.set(fn()))
  return s;
}

const num = signal(0);
const isEven = computed(() => num() % 2 ? 'odd' : 'event')

effect(() => console.log(`Number ${num()} is ${isEven()}`));
