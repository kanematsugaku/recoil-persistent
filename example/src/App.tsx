import { atom, useRecoilState, useResetRecoilState } from 'recoil';
import recoilPersistent from './lib/main';

type CounterAtom = number;

type UserAtom = {
  name: string;
  age: number | undefined;
};

const counterAtom = atom<CounterAtom>({
  key: 'counterAtom',
  default: 0,
  effects_UNSTABLE: [recoilPersistent()],
});

const userAtom = atom<UserAtom>({
  key: 'userAtom',
  default: { name: '', age: undefined },
  effects_UNSTABLE: [recoilPersistent()],
});

export default function App() {
  const [count, setCount] = useRecoilState(counterAtom);
  const resetCount = useResetRecoilState(counterAtom);

  const [user, setUser] = useRecoilState(userAtom);
  const resetUser = useResetRecoilState(userAtom);

  return (
    <div style={{ padding: '32px' }}>
      <p>Counter: {count}</p>
      <button onClick={() => setCount((prev) => prev + 1)}> +1 </button>
      <button onClick={() => setCount((prev) => prev - 1)}> -1 </button>
      <button onClick={() => resetCount()}>Reset</button>
      <hr />
      <p>
        Name: {user.name} / Age: {user.age}
      </p>
      <input
        type="text"
        value={user.name}
        onChange={(e) => setUser((prev) => ({ ...prev, name: e.currentTarget.value }))}
      />
      <input
        type="number"
        value={user.age ?? ''}
        onChange={(e) => setUser((prev) => ({ ...prev, age: Number(e.currentTarget.value) }))}
      />
      <button onClick={() => resetUser()}>Reset</button>
      <hr />
      <button onClick={() => window.location.reload()}>Reload</button>
    </div>
  );
}
