import styled from 'styled-components';
import { Clip } from '../types/Clip';
import { HelixClip } from '@twurple/api';

const ClipTitleContainer = styled.span`
  font-size: 125%;
  text-shadow: 1px 1px 2px black;
`;

export type ClipTitleProps = {
    clip: Clip | HelixClip
}

const ClipTitle = ({clip}: ClipTitleProps) => {
    return (
        <ClipTitleContainer>{clip.title}</ClipTitleContainer>
    );
}

export default ClipTitle;
