"use strict";
exports.__esModule = true;
exports.Card = exports.Deck = void 0;
var SUITS = ['hearts', 'clubs', 'diamonds', 'spades'];
var VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'];
var PictureCards;
(function (PictureCards) {
    PictureCards[PictureCards["jack"] = 0] = "jack";
    PictureCards[PictureCards["queen"] = 1] = "queen";
    PictureCards[PictureCards["king"] = 2] = "king";
    PictureCards[PictureCards["ace"] = 3] = "ace";
})(PictureCards || (PictureCards = {}));
var Deck = /** @class */ (function () {
    function Deck(cards) {
        if (cards === void 0) { cards = initDeck(); }
        this.cards = cards;
    }
    Deck.prototype.numberOfCards = function () {
        return this.cards.length;
    };
    Deck.prototype.pop = function () {
        return this.cards.shift();
    };
    Deck.prototype.shuffle = function () {
        for (var i = this.numberOfCards() - 1; i > 0; i--) {
            var newIndex = i32(Math.floor(Math.random() * (i + 1)));
            var oldValue = this.cards[newIndex];
            this.cards[newIndex] = this.cards[i];
            this.cards[i] = oldValue;
        }
    };
    return Deck;
}());
exports.Deck = Deck;
var Card = /** @class */ (function () {
    function Card(suit, value, numValue) {
        this.suit = suit;
        this.value = value;
        this.numValue = numValue;
        if (this.suit === 'hearts' || 'diamonds') {
            this.color = 'red';
        }
        else {
            this.color = 'black';
        }
    }
    return Card;
}());
exports.Card = Card;
function initDeck() {
    return SUITS.map(function (suit) {
        return VALUES.map(function (value, index) {
            return new Card(suit, value, index);
        });
    }).flat();
}
// let ourDeck :Deck = new Deck()
// console.log(ourDeck.numberOfCards().toString())
