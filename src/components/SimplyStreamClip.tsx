import { FC, useEffect, useState } from 'react';
import { Streamer, TwitchRandomClipsConfig } from './TwitchRandomClips';
import TwitchClip from './TwitchClip';
import ClipHeader from './ClipHeader';
import { Clip } from '../types/Clip';

type SimplyStreamClipProps = {
    streamer?: Streamer,
    config: TwitchRandomClipsConfig,
    onClipEnded?: () => void,
}

const SimplyStreamClip: FC<SimplyStreamClipProps> = (
    {
        streamer,
        config,
        onClipEnded = () => {
        },
    }) => {
    const [clip, setClip] = useState<Clip>();
    const [show, setShow] = useState<boolean>(!config.skipClipOnError ?? true);

    useEffect(() => {
        if (!streamer || !streamer?.login) return;

        const controller = new AbortController();
        const params = new URLSearchParams({
            ...(config.startedAt && {started_at: config.startedAt.toString()}),
            ...(config.endedAt && {ended_at: config.endedAt.toString()}),
            ...(config.allowedGame && {game_id: config.allowedGame}),
            ...(config.deniedGame && {deny_games: config.deniedGame}),
            ...(config.allowedClipCreators && {allow: config.allowedClipCreators.join(',')}),
            ...(config.deniedClipCreators && {deny: config.deniedClipCreators.join(',')}),
            ...(config.quality && {quality: config.quality}),
        });

        fetch(`${config.host ?? 'https://api.simply-stream.com'}/api/twitch/users/${streamer?.login}/clips/random?${params}`, {signal: controller.signal})
            .then((response) => response.json())
            .then(data => {
                // @TODO: Retry with another clip or die after x-tries
                if (data['@type'] === 'hydra:Error') return;

                setClip(data);
            });

        return () => controller.abort();
    }, [streamer])

    function clipEnded() {
        if (config.skipClipOnError) setShow(false);

        if (onClipEnded) onClipEnded();
    }

    function onClipStarted() {
        if (config.skipClipOnError) setShow(true);
    }

    return (
        <>
            {clip &&
                <TwitchClip clip={clip} quality={config?.quality ?? '1080'} onClipEnded={clipEnded}
                            onClipStarted={onClipStarted} skipOnError={config.skipClipOnError}>
                    {show && !config.hideInfo &&
                        <ClipHeader clip={clip}
                                    showClipTitle={config?.information?.clip ?? false}
                                    showGameName={config?.information?.game ?? false}
                                    showStreamerName={config?.information?.streamer ?? false}/>
                    }
                </TwitchClip>
            }
        </>
    );
}

export default SimplyStreamClip;
