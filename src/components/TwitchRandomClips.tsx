import React, { CSSProperties, useEffect, useMemo, useState } from 'react';
import { ApiClient, HelixClip, HelixUser } from '@twurple/api';
import { AppTokenAuthProvider, StaticAuthProvider } from '@twurple/auth';
import TwitchClip from './TwitchClip';
import ClipHeader from './ClipHeader';

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
    quality?: string,
}

export type TwitchRandomClipsProps = {
    config: TwitchRandomClipsConfig,
    classNames?: string,
    style?: CSSProperties,
}

const TwitchRandomClips = ({config, classNames, style}: TwitchRandomClipsProps) => {
    let authProvider: StaticAuthProvider | AppTokenAuthProvider;
    const [streamers, setStreamers] = useState<HelixUser[]>([]);
    const [streamersIterable, setStreamersIterable] = useState<HelixUser[]>([]);
    const [index, setIndex] = useState<number | undefined>();
    const [clip, setClip] = useState<HelixClip>();

    const twitchApi = useMemo(() => {
        if ('accessToken' in config.authentication) {
            authProvider = new StaticAuthProvider(config.authentication.clientId, config.authentication.accessToken);
        } else {
            authProvider = new AppTokenAuthProvider(config.authentication.clientId, config.authentication.clientSecret);
        }
        return new ApiClient({authProvider: authProvider});
    }, [config.authentication])

    useMemo(async () => await twitchApi.users.getUsersByNames(config.streamers), [config.streamers])
        .then(users => setStreamers(users));

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

        twitchApi.clips.getClipsForBroadcaster(streamer.id, {limit: 100}).then((clip) =>
            setClip(clip.data[Math.floor(Math.random() * clip.data.length)]));
    }, [streamers, streamersIterable]);

    function onClipEnded(): void {
        streamersIterable.splice(index as number, 1);
        setStreamersIterable([...streamersIterable]);
    }

    return (
        <>
            {clip &&
                <TwitchClip key={clip.id} clip={clip} onClipEnded={onClipEnded}>
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
