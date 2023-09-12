import React, { useEffect, useMemo, useReducer } from 'react';
import ClipRandomizer, { ClipRandomizerAuthentication } from '../util/clip-randomizer';
import SimplyStreamClip from './SimplyStreamClip';
import TwitchRandomClip from './TwitchRandomClip';
import { GameFilter } from '../util/game-filter';
import CreatorFilter from '../util/creator-filter';
import { HelixUser } from '@twurple/api';

export type Quality = '1080' | '720' | '480' | '360' | '160';

export type TwitchRandomClipsConfig = {
    streamers: string[],
    authentication?: ClipRandomizerAuthentication,
    allowedClipCreators?: string[],
    deniedClipCreators?: string[],
    allowedGame?: string,
    deniedGame?: string,
    hideInfo?: boolean
    information?: {
        streamer?: boolean,
        game?: boolean,
        clip?: boolean
    },
    startedAt?: number,
    endedAt?: number,
    quality?: Quality,
    host?: string,
    skipClipOnError?: boolean
}

export type TwitchRandomClipsProps = {
    standalone?: boolean,
    config: TwitchRandomClipsConfig,
}

export type Streamer = {
    login: string,
    id?: string
};

function reducer(state: any, action: any) {
    switch (action.type) {
        case 'set_streamers_iterable':
            return ({
                ...state,
                streamers: [...action.streamers],
                streamersIterable: [...action.streamersIterable],
            });

        case 'set_streamer':
            return ({
                ...state,
                streamer: action.streamer,
                key: action.key,
                index: action.index,
            });

        default:
            return state;
    }
}

const TwitchRandomClips = ({standalone = true, config}: TwitchRandomClipsProps) => {
    const [state, dispatch] = useReducer(reducer, {
        key: null,
        index: null,
        streamer: null,
        streamers: [],
        streamersIterable: [],
    });

    let clipRandomizer: ClipRandomizer;
    if (standalone) {
        clipRandomizer = useMemo(() => {
                return new ClipRandomizer(
                    config.authentication!,
                    [
                        ...(config.allowedGame ? [new GameFilter(config.allowedGame)] : []),
                        ...(config.deniedGame ? [new GameFilter(config.deniedGame, true)] : []),
                        ...(config.allowedClipCreators ? [new CreatorFilter(config.allowedClipCreators)] : []),
                        ...(config.deniedClipCreators ? [new CreatorFilter(config.deniedClipCreators, true)] : []),
                    ],
                );
            },
            [config.authentication],
        );
    }

    useEffect(() => {
        if (standalone && clipRandomizer) {
            clipRandomizer
                .getUsers(config.streamers)
                .then(users => {
                    dispatch({
                        type: 'set_streamers_iterable',
                        streamers: users,
                        streamersIterable: users,
                    });
                });
        } else {
            dispatch({
                type: 'set_streamers_iterable',
                streamers: config.streamers.map((streamer: string) => ({login: streamer})),
                streamersIterable: config.streamers.map((streamer: string) => ({login: streamer})),
            });
        }
    }, [])

    useEffect(() => {
        if (state.streamers.length === 0) return;
        if (state.streamersIterable.length === 0) {
            dispatch({
                type: 'set_streamers_iterable',
                streamers: state.streamers,
                streamersIterable: state.streamers.map((streamer: Streamer | HelixUser) => (standalone ? streamer : streamer)),
                key: null,
            })
            return;
        }

        const idx = Math.floor(Math.random() * state.streamersIterable.length);
        dispatch({type: 'set_streamer', streamer: state.streamersIterable[idx], index: idx, key: Date.now()});
    }, [state.streamersIterable]);


    function onClipEnded(): void {
        const newIterableStreamers = state.streamersIterable;
        newIterableStreamers.splice(state.index, 1);
        dispatch({
            type: 'set_streamers_iterable',
            streamers: state.streamers,
            streamersIterable: newIterableStreamers,
            hide: config.skipClipOnError,
        });
    }

    return (
        <>
            {state.streamer && (standalone ?
                    <TwitchRandomClip
                        key={state.key}
                        streamer={state.streamer}
                        randomizer={clipRandomizer!}
                        config={config}
                        onClipEnded={onClipEnded}
                    /> :
                    <SimplyStreamClip
                        key={state.key}
                        streamer={state.streamer}
                        config={config}
                        onClipEnded={onClipEnded}
                    />
            )}
        </>
    );
}

export default TwitchRandomClips;
