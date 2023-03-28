import { CSSProperties } from 'react';
import { HelixClip } from '@twurple/api';
import StreamerName from './StreamerName';
import GameName from './GameName';
import ClipTitle from './ClipTitle';
import styled from 'styled-components';

const BackdropWrapper = styled.div`
  background: rgba(0, 0, 0, .25);
  color: white;
  padding: .5rem 0;
  position: absolute;
  text-align: center;
  width: 100%;
`;

export type ClipHeaderProps = {
    clip: HelixClip,
    showClipTitle?: boolean,
    showGameName?: boolean,
    showStreamerName?: boolean,
    classNames?: string,
    style?: CSSProperties,
}

const ClipHeader = ({clip, showClipTitle, showStreamerName, showGameName, classNames = ''}: ClipHeaderProps) => {
    return (
        <BackdropWrapper className={`randomizer_backdrop ${classNames}`}>
            {showStreamerName &&
                <StreamerName streamer={clip.broadcasterDisplayName}/>
            }
            {showGameName &&
                <GameName game$={clip.getGame()}/>
            }

            {showGameName && showClipTitle && ' - '}

            {showClipTitle &&
                <ClipTitle clip={clip}/>
            }
        </BackdropWrapper>
    )
}

export default ClipHeader;
