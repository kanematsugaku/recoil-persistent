import { atom, useRecoilState, useResetRecoilState } from 'recoil';
import recoilPersistent from './lib/main';

type CounterAtom = number;

const counterAtom = atom<CounterAtom>({
  key: 'counterAtom',
  default: 0,
  effects_UNSTABLE: [recoilPersistent()],
});

export default function App() {
  const [count, setCount] = useRecoilState(counterAtom);
  const resetCount = useResetRecoilState(counterAtom);

  return (
    <div style={{ padding: '32px' }}>
      <p>Counter: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}> +1 </button>
      <button onClick={() => setCount((prev) => prev - 1)}> -1 </button>
      <button onClick={() => resetCount()}>Reset</button>
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  );
}
