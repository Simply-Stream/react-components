import styled from 'styled-components';

const Streamer = styled.div`
  font-weight: bold;
  font-size: 150%;
  text-shadow: 1px 1px 2px black;
`;

const StreamerName = ({streamer}: { streamer: string }) => {
    return (
        <Streamer>
            {streamer}
        </Streamer>
    );
}

export default StreamerName;
