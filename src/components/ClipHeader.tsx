import { CSSProperties } from 'react';
import StreamerName from './StreamerName';
import GameName from './GameName';
import ClipTitle from './ClipTitle';
import styled from 'styled-components';
import { Clip } from './TwitchClip';

const BackdropWrapper = styled.div`
  background: rgba(0, 0, 0, .25);
  color: white;
  padding: .5rem 0;
  position: absolute;
  text-align: center;
  width: 100%;
`;

export type ClipHeaderProps = {
    clip: Clip,
    showClipTitle?: boolean,
    showGameName?: boolean,
    showStreamerName?: boolean,
    classNames?: string,
    style?: CSSProperties,
}

const ClipHeader = ({clip, showClipTitle, showStreamerName, showGameName, classNames = ''}: ClipHeaderProps) => {
    return (
        <>
            {showStreamerName || showGameName || showClipTitle }
            <BackdropWrapper className={`randomizer_backdrop ${classNames}`}>
                {showStreamerName &&
                    <StreamerName
                        streamer={clip.broadcasterName}/>
                }
                {showGameName &&
                    <GameName game$={clip.getGame ? clip.getGame() : clip.game}/>
                }

                {showGameName && showClipTitle && ' - '}

                {showClipTitle &&
                    <ClipTitle clip={clip}/>
                }
            </BackdropWrapper>
        </>
    )
}

export default ClipHeader;
