import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import { HelixClip, HelixUser } from '@twurple/api';
import TwitchClip from './TwitchClip';
import ClipHeader from './ClipHeader';
import ClipRandomizer from '../util/clip-randomizer';
import { GameFilter } from '../util/game-filter';
import CreatorFilter from '../util/creator-filter';

export type Quality = '1080' | '720' | '480' | '360' | '160';

export type TwitchRandomClipsConfig = {
    streamers: string[],
    authentication: { clientId: string, accessToken: string } | { clientId: string, clientSecret: string },
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
    config: TwitchRandomClipsConfig,
    classNames?: string,
    style?: CSSProperties,
}

const TwitchRandomClips = ({config, classNames, style}: TwitchRandomClipsProps) => {
    const [streamers, setStreamers] = useState<HelixUser[]>([]);
    const [streamersIterable, setStreamersIterable] = useState<HelixUser[]>([]);
    const [index, setIndex] = useState<number | undefined>();
    const [clip, setClip] = useState<HelixClip>();

    const clipRandomizer = useMemo(() => {
            return new ClipRandomizer(
                config.authentication,
                // @TODO: Maybe we'll change this to a more descriptive way in the future ...
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
    useMemo(() => clipRandomizer.getUsers(config.streamers), [config.streamers]).then(setStreamers);

    useEffect(() => {
        if (streamers?.length === 0) return;
        if (streamersIterable.length === 0) {
            setStreamersIterable([...streamers]);
            return;
        }

        const idx = Math.floor(Math.random() * streamersIterable.length);
        const streamer = streamersIterable[idx];
        setIndex(idx);

        if (!streamer) return;
        clipRandomizer.getRandomClip(streamer).then(clip => {
            if (!clip) {
                // Skip the streamer if there's no clip that suits our requirements
                onClipEnded(idx);
                return;
            }

            setClip(clip);
        });
    }, [streamers, streamersIterable]);

    function onClipEnded(idx?: number): void {
        streamersIterable.splice(idx ?? index as number, 1);
        setStreamersIterable([...streamersIterable]);
    }

    return (
        <>
            {clip &&
                <TwitchClip key={clip.id} clip={clip} onClipEnded={onClipEnded} quality={config.quality}>
                    <ClipHeader clip={clip}
                                showClipTitle={config.information?.clip}
                                showGameName={config.information?.game}
                                showStreamerName={config.information?.streamer}/>
                </TwitchClip>
            }
        </>
    );
}

export default TwitchRandomClips;
