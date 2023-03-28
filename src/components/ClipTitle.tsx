import { HelixClip } from '@twurple/api';
import styled from 'styled-components';

const Clip = styled.span`
  font-size: 125%;
  text-shadow: 1px 1px 2px black;
`;

const ClipTitle = ({clip}: { clip: HelixClip }) => {
    return (
        <Clip>{clip.title}</Clip>
    );
}

export default ClipTitle;
