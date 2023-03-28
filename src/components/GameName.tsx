import { useEffect, useState } from 'react';
import { HelixGame } from '@twurple/api';
import styled from 'styled-components';

const Game = styled.span`
  font-size: 125%;
  text-shadow: 1px 1px 2px black;
`;

export type GameNameProps = {
    game$?: Promise<HelixGame | null> | string,
}

const GameName = ({game$}: GameNameProps) => {
    const [game, setGame] = useState<HelixGame | { name: string }>();

    useEffect(() => {
        if (!game$) return;

        if (typeof game$ === 'string') {
            setGame({name: game$});
        } else {
            game$.then(game => {
                if (!game) return;

                setGame(game);
            })
        }
    }, [game$])
    return (
        <>
            {game &&
                <Game>{game.name}</Game>
            }
        </>
    );
}

export default GameName;
