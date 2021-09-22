import React, { Component } from 'react';
import { IPlayer } from '../store';
import { observer } from 'mobx-react';

@observer
export class PlayerInfo extends Component<{ player: IPlayer }, {}> {
  render() {
    const { player } = this.props;

    return (
      <div className={`palyerInfo ${player.id === 1 ? 'palyerInfo__left' : 'palyerInfo__right'}`}>
        <div className={`circle ${player.isTurn? 'circle__isTurn':''}`}>
          <h3>Player {player.id}</h3>
          <span>{player.points}</span>
        </div>
      </div>
    );
  }
}
