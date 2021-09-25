import { action, observable, computed, reaction, makeAutoObservable } from 'mobx';
import { pics } from './images/cards';

export interface IPlayer {
  id: number;
  isTurn: boolean;
  points: number;
  isWinner: boolean;
}

export interface ICard {
  id: string;
  src: string;
  isRevealed: boolean;
  isMatched: boolean;
  type: string;
}

/* ============================== */

const playersArray: IPlayer[] = [
  { id: 1, isTurn: true, points: 0, isWinner: false },
  { id: 2, isTurn: false, points: 0, isWinner: false },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cardNames: string[] = Object.keys(pics);

/* ============================== */

export class Store {
  @observable players: IPlayer[] = [];
  @observable cards: ICard[] = [];

  constructor() {
    makeAutoObservable(this);
    this._initGame();
  }

  @action _initGame = (): void => {
    this.cards = [];
    this.players = [];
    playersArray.forEach((p) => this.players.push(p));
    cardNames.forEach((name, index) => {
      const card1: ICard = {
        id: `${index}_${name}`,
        type: name,
        src: pics[name],
        isRevealed: false,
        isMatched: false,
      };
      const card2: ICard = {
        id: `${index + 1}_${name}`,
        type: name,
        src: pics[name],
        isRevealed: false,
        isMatched: false,
      };
      this.cards.push(card1);
      this.cards.push(card2);
    });

    //this.cards.sort(() => Math.random() - 0.5);
  };

  @action revealCard = (cardId: string): void => {
    if (this.revealedCards.length < 2) {
      this.cards.find(({ id }) => id === cardId)!.isRevealed = true;
    }
  };

  @action startOver = () => {
    this._initGame();
  };

  @action setMatchCard = (cardId: string) => {
    this.cards.find((card) => card.id === cardId)!.isMatched = true;
  };

  @action increametPlayerPoints = (playerId: number) => {
    this.players.find((player) => player.id === playerId)!.points += 1;
  };

  @action resetCardsIsRevealed = (cardId: string) => {
    this.cards.find((card) => card.id === cardId)!.isRevealed = false;
  };

  @action setNextPlayerTurn = (nextPlayerId: number, prevPlayerId: number) => {
    this.players.find((player) => player.id === nextPlayerId)!.isTurn = true;
    this.players.find((player) => player.id === prevPlayerId)!.isTurn = false;
  };

  @action setWinner = (playerId: number) => {
    this.players.find((player) => player.id === playerId)!.isWinner = true;
  };
  /**
   * @description filter revealed and not matched card
   */
  @computed get revealedCards(): ICard[] {
    return this.cards.filter(({ isRevealed, isMatched }) => isRevealed && !isMatched);
  }

  @computed get even(): boolean {
    return this.players.filter(({ points }) => points === 3).length === 2;
  }

  @computed get winner(): IPlayer | undefined {
    return this.players.find(({ isWinner }) => isWinner);
  }
}

const store = new Store();

reaction(
  () => store.revealedCards,
  (revealedCards) => {
    if (revealedCards.length === 2) {
      const currnetTurnPlayer = store.players.find(({ isTurn }) => isTurn);
      const nextTurnPlayer = store.players.find(({ isTurn }) => !isTurn);

      if (revealedCards[0].type === revealedCards[1].type) {
        store.setMatchCard(revealedCards[0].id);
        store.setMatchCard(revealedCards[1].id);

        store.increametPlayerPoints(currnetTurnPlayer!.id);
      }
      setTimeout(() => {
        store.resetCardsIsRevealed(revealedCards[0].id);
        store.resetCardsIsRevealed(revealedCards[1].id);
      }, 1000);
      store.setNextPlayerTurn(nextTurnPlayer!.id, currnetTurnPlayer!.id);

      if (store.cards.every((card) => card.isMatched)) {
        if (currnetTurnPlayer!.points > nextTurnPlayer!.points) {
          store.setWinner(currnetTurnPlayer!.id);
        } else if (currnetTurnPlayer!.points < nextTurnPlayer!.points) {
          store.setWinner(nextTurnPlayer!.id);
        }
      }
    }

    /*
     * @todo: implement game logic from the point a card is revealed,
     *  you have the number of revealed cards
     * - is there a match?
     * - is it the last pair?
     * - who won?
     */
  }
);
export default store;
