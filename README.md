# `recoil-persistent`

A very simple library for persisting recoil state.

## Installation

```sh
npm install recoil-persistent
```

## Usage

Pass `recoilPersistent()` to the Recoil's `effects_UNSTABLE` param. That's it!

```tsx
import { atom, useRecoilState, useResetRecoilState } from 'recoil';
import recoilPersistent from 'recoil-persistent';

type CounterAtom = number;

const counterAtom = atom<CounterAtom>({
  key: 'counterAtom',
  default: 0,
  effects_UNSTABLE: [recoilPersistent()], // 👈 All you need to do is just add this line.
});

export default function App() {
  const [count, setCount] = useRecoilState(counterAtom);
  const resetCount = useResetRecoilState(counterAtom);

  return (
    <div>
      <p>Counter: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}> +1 </button>
      <button onClick={() => setCount((prev) => prev - 1)}> -1 </button>
      <button onClick={() => resetCount()}>Reset</button>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  );
}
```

## Example

![example image](https://raw.githubusercontent.com/kanematsugaku/recoil-persistent/main/readme.gif)

## Option

By default, recoil-persistent use `window.sessionStorage` where to store persistent data.

If you want to use `window.localStorage`, pass it to argument.

```tsx
const counterAtom = atom<CounterAtom>({
  key: 'counterAtom',
  default: 0,
  effects_UNSTABLE: [recoilPersistent({ storage: window.localStorage })],
});
```
