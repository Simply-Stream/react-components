import { createContext } from 'react';

export type PlayerState = 'playing' | 'stopped' | 'restart';

export enum PlayerMode {
    Randomizer,
    Shoutout
}

const RandomizerContext = createContext<{
    state: string,
    mode?: PlayerMode,
    setState?: any,
}>({state: 'playing', mode: PlayerMode.Randomizer, setState: null});

export const RandomizerProvider = RandomizerContext.Provider;

export default RandomizerContext;
