import React, { Component } from "react";
import axios from "axios";
import Card from "./Card";
import "./Deck.css";
const API_BASE_URL = "https://deckofcardsapi.com/api/deck";

export default class Deck extends Component {
  constructor(props) {
    super(props);
    this.state = { deck: null, drawn: [] };
    this.getCard = this.getCard.bind(this);
  }
  async componentDidMount() {
    let deck = await axios.get(`${API_BASE_URL}/new/shuffle/`);
    this.setState({ deck: deck.data });
  }
  async getCard() {
    let deck_id = this.state.deck.deck_id;
    try {
      let cardUrl = `${API_BASE_URL}/${deck_id}/draw/`;
      let cardRes = await axios.get(cardUrl);
      if (!cardRes.data.success) {
        throw new Error("No card remaining");
      }
      let card = cardRes.data.cards[0];

      this.setState(oldState => ({
        drawn: [
          ...oldState.drawn,
          {
            id: card.code,
            image: card.image,
            name: `${card.value} of ${card.suit}`,
          },
        ],
      }));
    } catch (err) {
      alert(err);
    }
  }

  render() {
    const cards = this.state.drawn.map(card => (
      <Card key={card.id} name={card.name} image={card.image} />
    ));
    let diamondEmoji = (
      <span className="Deck-emoji" role="img" aria-label="Diamond">
        ♦️
      </span>
    );
    return (
      <div className="Deck">
        <h1 className="Deck-title">
          {diamondEmoji} Card Dealer {diamondEmoji}
        </h1>
        <h2 className="Deck-title subtitle">
          {diamondEmoji} A simple app made with React {diamondEmoji}
        </h2>
        <button className="Deck-button" onClick={this.getCard}>
          Get Card!
        </button>
        <div className="Deck-cardArea">{cards}</div>
      </div>
    );
  }
}
