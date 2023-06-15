import React, { CSSProperties, useEffect, useReducer } from 'react';
import { ClipRandomizerAuthentication } from '../util/clip-randomizer';
import SimplyStreamClip from './SimplyStreamClip';

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
}

export type TwitchRandomClipsProps = {
    standalone?: boolean,
    config: TwitchRandomClipsConfig,
    classNames?: string,
    style?: CSSProperties,
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

const TwitchRandomClips = ({standalone = true, config, classNames, style}: TwitchRandomClipsProps) => {
    const [state, dispatch] = useReducer(reducer, {
        streamers: config.streamers.map(streamer => ({login: streamer})),
        streamer: null,
        key: null,
        streamersIterable: config.streamers.map(streamer => ({login: streamer})),
        index: null,
    });

    useEffect(() => {
        if (state.streamersIterable.length === 0) {
            dispatch({
                type: 'set_streamers_iterable',
                streamersIterable: [...state.streamers],
            })
            return;
        }
        const idx = Math.floor(Math.random() * state.streamersIterable.length);
        dispatch({type: 'set_streamer', streamer: state.streamersIterable[idx], index: idx, key: Date.now()});
    }, [state.streamersIterable, config]);


    function onClipEnded(): void {
        const newIterableStreamers = state.streamersIterable;
        newIterableStreamers.splice(state.index, 1);
        dispatch({
            type: 'set_streamers_iterable',
            streamersIterable: [...newIterableStreamers],
        });
    }

    return state.streamer && (standalone ?
        null :
        <SimplyStreamClip key={state.key}
                          streamer={state.streamer}
                          onClipEnded={onClipEnded}
                          showClipTitle={config.information?.clip}
                          showGameName={config.information?.game}
                          showStreamerName={config.information?.streamer}/>);
}

export default TwitchRandomClips;
