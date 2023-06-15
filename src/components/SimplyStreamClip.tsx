import { FC, useEffect, useState } from 'react';
import { Streamer } from './TwitchRandomClips';
import TwitchClip from './TwitchClip';
import ClipHeader from './ClipHeader';
import { Clip } from '../types/Clip';

type SimplyStreamClipProps = {
    streamer?: Streamer,
    host?: string,
    showClipTitle?: boolean,
    showGameName?: boolean,
    showStreamerName?: boolean,
    onClipEnded?: () => void,
}

const SimplyStreamClip: FC<SimplyStreamClipProps> = (
    {
        streamer,
        host = 'https://api.simply-stream.com',
        showClipTitle = false,
        showGameName = false,
        showStreamerName = false,
        onClipEnded = () => {
        },
    }) => {
    const [clip, setClip] = useState<Clip>();

    useEffect(() => {
        if (!streamer?.login) return;
        const controller = new AbortController();

        fetch(`${host}/api/twitch/users/${streamer?.login}/clips/random`, {signal: controller.signal})
            .then((response) => response.json())
            .then(data => setClip(data));

        return () => controller.abort();
    }, [streamer])

    return clip &&
        <TwitchClip clip={clip} onClipEnded={onClipEnded}>
            <ClipHeader clip={clip}
                        showClipTitle={showClipTitle}
                        showGameName={showGameName}
                        showStreamerName={showStreamerName}/>
        </TwitchClip>;
}

export default SimplyStreamClip;
