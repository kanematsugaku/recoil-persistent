/**
 * This code is inspired by the following.
 *
 * Copyright (c) 2020 Ivan Menshykov
 * Released under the MIT license
 * https://github.com/polemius/recoil-persist
 */

import type { AtomEffect } from 'recoil';

export type Storage = {
  setItem(key: string, value: string): void;
  getItem(key: string): null | string;
  removeItem(key: string): void;
};

export type Config = {
  storage?: Storage;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PersistAtomEffect = AtomEffect<any>;

/**
 * Recoil module to persist state to storage.
 *
 * @param storage Where to store persistent data. default is "sessionStorage".
 * @return Atom Effects to set to "effects" param.
 */
export default function recoilPersistent(
  storage: Storage = window.sessionStorage,
): PersistAtomEffect {
  if (typeof window === 'undefined') {
    const persistAtomEffectFallback: PersistAtomEffect = () => {
      // Empty.
    };
    return persistAtomEffectFallback;
  }

  const isRecord = (arg: unknown): arg is Record<string, unknown> => {
    return arg !== null && typeof arg === 'object';
  };

  const parseFromJson = (state: string): unknown => {
    try {
      return JSON.parse(state);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      return {};
    }
  };

  const getFromStorage = (storage_: Storage, key: string): Record<string, unknown> => {
    const persistedState = storage_.getItem(key);
    if (typeof persistedState === 'string') {
      const parsedState = parseFromJson(persistedState);
      if (isRecord(parsedState)) {
        return parsedState;
      }
    }
    return {};
  };

  const setToStorage = (storage_: Storage, key: string, newValue: unknown): void => {
    storage_.setItem(key, JSON.stringify({ [key]: newValue }));
  };

  const removeFromStorage = (storage_: Storage, key: string): void => {
    storage_.removeItem(key);
  };

  const persistAtomEffect: PersistAtomEffect = ({ onSet, node, trigger, setSelf }) => {
    if (trigger === 'get') {
      const state = getFromStorage(storage, node.key);
      if (Object.hasOwn(state, node.key)) {
        setSelf(state[node.key]);
      }
    }
    onSet((newValue, _, isReset) => {
      if (isReset) {
        removeFromStorage(storage, node.key);
      } else {
        setToStorage(storage, node.key, newValue);
      }
    });
  };

  return persistAtomEffect;
}
