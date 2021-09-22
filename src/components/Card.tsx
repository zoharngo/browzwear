import { Component, createRef } from 'react';
import browzwear from '../images/browzwear.png';
import { ICard, Store } from '../store';
import { inject, observer } from 'mobx-react';

const CARD_BACK = browzwear as string;

@inject('store')
@observer
export class Card extends Component<{ card: ICard; store?: Store }, {}> {
  private cancelRevealCall: React.RefObject<any>;

  constructor(props: { card: ICard; store?: Store }) {
    super(props);
    this.cancelRevealCall = createRef();
  }

  handleClick = () => {
    const {
      card: { id },
    } = this.props;

    const { revealCard } = this.props.store as Store;

    revealCard(id);
  };

  render() {
    const { card } = this.props;
    const src = card.isRevealed ? card.src : card.isMatched ? card.src : CARD_BACK;
    return (
      <div className='card' onClick={this.handleClick}>
        <img src={src} alt='' />
      </div>
    );
  }
}
