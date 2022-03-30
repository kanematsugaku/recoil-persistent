/**
 * This code is inspired by the following.
 *
 * Copyright (c) 2020 Ivan Menshykov
 * Released under the MIT license
 * https://github.com/polemius/recoil-persist
 */

import type { AtomEffect } from 'recoil';

export type Storage = {
  setItem(key: string, value: string): void | Promise<void>;
  getItem(key: string): null | string | Promise<string>;
};

export type Config = {
  storage?: Storage;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PersistAtomEffect = AtomEffect<any>;

/**
 * Recoil module to persist state to storage.
 *
 * @param config Optional configuration object.
 * @param config.storage Where to store persistent data. default is "sessionStorage".
 * @return Atom Effects to set to "effects_UNSTABLE" param.
 */
export default function recoilPersistent(config: Config = {}): PersistAtomEffect {
  if (typeof window === 'undefined') {
    const persistAtomFallback: PersistAtomEffect = () => {
      // Empty.
    };
    return persistAtomFallback;
  }

  const { storage = window.sessionStorage } = config;

  const persistAtom: PersistAtomEffect = ({ onSet, node, trigger, setSelf }) => {
    if (trigger === 'get') {
      const state = getFromStorage(node.key);
      if (Object.hasOwn(state, node.key)) {
        setSelf(state[node.key]);
      }
    }
    onSet((newValue, _, isReset) => {
      const state = getFromStorage(node.key);
      updateStateInStorage(newValue, state, node.key, isReset);
    });
  };

  const isRecord = (arg: unknown): arg is Record<string, unknown> => {
    return arg !== null && typeof arg === 'object';
  };

  const parseFromJson = (state: string): unknown => {
    try {
      return JSON.parse(state);
    } catch (e) {
      console.error(e);
      return {};
    }
  };

  const getFromStorage = (key: string): Record<string, unknown> => {
    const persistedState = storage.getItem(key);
    if (typeof persistedState === 'string') {
      const parsedState = parseFromJson(persistedState);
      if (isRecord(parsedState)) {
        return parsedState;
      }
    }
    return {};
  };

  const updateStateInStorage = (
    newValue: unknown,
    state: unknown,
    key: string,
    isReset: boolean,
  ): void => {
    if (isRecord(state)) {
      if (isReset) {
        delete state[key];
      } else {
        state[key] = newValue;
      }
    }
    setToStorage(key, state);
  };

  const setToStorage = (key: string, state: unknown): void => {
    storage.setItem(key, JSON.stringify(state))?.catch(console.error);
  };

  return persistAtom;
}
