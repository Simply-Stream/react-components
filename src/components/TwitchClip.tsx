import React, { CSSProperties, PropsWithChildren, useEffect, useRef } from "react";
import { HelixClip } from '@twurple/api';
import styled from 'styled-components';
import { Quality } from './TwitchRandomClips';

const VideoWrapper = styled.div`
`;

export type TwitchClipProps = {
    clip: HelixClip,
    onClipStarted?: () => void,
    isLoading?: (loading: boolean) => void,
    onClipEnded?: () => void,
    classNames?: string,
    quality?: Quality,
    style?: CSSProperties
}

const TwitchClip = (
    {
        clip,
        onClipStarted = () => null,
        isLoading = () => null,
        onClipEnded = () => null,
        children,
        classNames = '',
        style,
        quality,
    }: PropsWithChildren<TwitchClipProps>) => {
    const videoRef = useRef(null);
    let url = clip.thumbnailUrl;

    if (quality && quality !== '1080' && url.indexOf('AT-cm%7C') === -1) {
        const lastSegment = url.split('/').at(-1) ?? '';
        url = url.replace(lastSegment, 'AT-cm%7C' + lastSegment);
    }
    url = url.replace('-preview-480x272.jpg', '.mp4');

    useEffect(() => {
        if (!videoRef || !videoRef.current) return;
        const video: HTMLVideoElement = videoRef.current;

        video.load();
        video.onplay = onClipStarted;
        video.onwaiting = () => isLoading(true);
        video.onplaying = () => isLoading(false);
        video.onended = onClipEnded;
        video.oncanplaythrough = () => video.play();
    }, [videoRef])

    return (
        <VideoWrapper className={`${classNames}`}>
            {children}
            <video height={'100%'} width={'100%'} ref={videoRef} poster={clip.thumbnailUrl} src={url}/>
        </VideoWrapper>
    )
}

export default TwitchClip;
