const SUITS = [ 'hearts', 'clubs', 'diamonds', 'spades']
const VALUES = [ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace']

enum PictureCards {
    jack,
    queen,
    king,
    ace
}

export class Deck {
    // suits = [ 'hearts', 'clubs', 'diamonds', 'spades']
    // values = [ '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace']
    cards: Card[]
    constructor(cards : Card[] = initDeck()) {
        this.cards = cards
    }

    numberOfCards() : i32 {
        return this.cards.length
    }

    pop() : Card {
        return this.cards.shift()
    }

    shuffle() : void {
        for (let i = this.numberOfCards() - 1; i > 0; i--) {
            const newIndex : i32 = i32(Math.floor(Math.random() * (i + 1)))
            const oldValue = this.cards[newIndex]
            this.cards[newIndex] = this.cards[i]
            this.cards[i] = oldValue
        }
    }

}

export class Card {
    suit: String
    value: String
    color: String
    numValue: i32
    constructor(suit:String, value:String, numValue:i32) {
        this.suit = suit
        this.value = value
        this.numValue = numValue
        if (this.suit === 'hearts' || 'diamonds') {
            this.color = 'red'
        } else {
            this.color = 'black'
        }
    }
}

function initDeck():Card[] {
    
    return SUITS.map(suit => {
        return VALUES.map((value, index) => {
            return new Card(suit, value, index)
        })
    }).flat()


}


// let ourDeck :Deck = new Deck()

// console.log(ourDeck.numberOfCards().toString())