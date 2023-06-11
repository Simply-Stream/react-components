import styled from 'styled-components';
import { Clip } from './TwitchClip';

const Clip = styled.span`
  font-size: 125%;
  text-shadow: 1px 1px 2px black;
`;

const ClipTitle = ({clip}: { clip: Clip }) => {
    return (
        <Clip>{clip.title}</Clip>
    );
}

export default ClipTitle;
