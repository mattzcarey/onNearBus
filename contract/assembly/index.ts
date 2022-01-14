/*
 * This is an example of an AssemblyScript smart contract with two simple,
 * symmetric functions:
 *
 * 1. setGreeting: accepts a greeting, such as "howdy", and records it for the
 *    user (account_id) who sent the request
 * 2. getGreeting: accepts an account_id and returns the greeting saved for it,
 *    defaulting to "Hello"
 *
 * Learn more about writing NEAR smart contracts with AssemblyScript:
 * https://docs.near.org/docs/develop/contracts/as/intro
 *
 */

import { context, Context, u128, ContractPromiseBatch, logging, storage } from 'near-sdk-as'
import { games, GameState, OnNearBus } from './game'
import { Deck } from './deck'

const WELCOME_MESSAGE: String = 'Welcome to On Near Bus: a blockchain adaptation of the popular drinking game.\n'
const round1: String = "\'red\' or \'black\'?"
const round2: String = "\'higher\' or \'lower\'?"
const round3: String = "\'inside\' or \'outside\'?"
const round4: String = "Last one, which suit is the next card? (hearts, clubs, diamonds, spades)"

export function newGame() : String{
  assert(!games.contains(context.sender), "Already in game, use \'play\'")
  const game = new OnNearBus();
  games.set(context.sender, game);
  game.deck.shuffle()
  game.gameState = GameState.RedOrBlack
  return(WELCOME_MESSAGE.toString() + round1)
}

export function play(answer: String) : String {
  assert(games.contains(context.sender), 'GameId not found');

  let game = games.getSome(context.sender);

  switch (game.gameState) {
    case GameState.RedOrBlack: {
      assert(answer === 'red' || 'black', 'Not a valid input, ' + round1)
      game.card1 = game.deck.pop()
      if (answer === game.card1.color) {
        game.gameState = GameState.HigherOrLower
        return('Success, your card is the ' + game.card1.value + ' of ' + game.card1.suit + '.\n' + round2)
      } else { 
        games.delete(context.sender)
        return('Your card is the ' + game.card1.value + ' of ' + game.card1.suit + '.\n Better luck next time :(' )
      }
    }
    case GameState.HigherOrLower: {
      assert(answer === 'higher' || 'lower', 'Not a valid input, ' + round2)
      game.card2 = game.deck.pop()
      if ((answer === 'higher' && game.card1.numValue < game.card2.numValue) || (answer === 'lower' && game.card1.numValue > game.card2.numValue)) {
        game.gameState = GameState.InsideOrOutside
        return('Success, your card is the ' + game.card2.value + ' of ' + game.card2.suit + '.\n' + round3)
      } else { 
        games.delete(context.sender)
        return('Your card is the ' + game.card2.value + ' of ' + game.card2.suit + '.\n Better luck next time :(' )
      }
    }
    case GameState.InsideOrOutside: {
      assert(answer === 'inside' || 'outside', 'Not a valid input, ' + round3)
      game.card3 = game.deck.pop()
      if ((Math.min(game.card1.numValue, game.card2.numValue) < game.card3.numValue) && game.card3.numValue < Math.max(game.card2.numValue, game.card1.numValue)) {
        // Card is inside
        if (answer === "inside"){
          game.gameState = GameState.WhichSuit
          return('Success, your card is the ' + game.card3.value + ' of ' + game.card3.suit + '.\n' + round4)
        } else { 
          games.delete(context.sender)
          return('Your card is the ' + game.card3.value + ' of ' + game.card3.suit + '.\n Better luck next time :(' )  
        }
      } else {
        // Card is outside
        if (answer === "outside"){
          game.gameState = GameState.WhichSuit
          return('Success, your card is the ' + game.card3.value + ' of ' + game.card3.suit + '.\n' + round4)
        } else { 
          games.delete(context.sender)
          return('Your card is the ' + game.card3.value + ' of ' + game.card3.suit + '.\n Better luck next time :(' )  
        }
      }
    }
    case GameState.WhichSuit: {
      assert(answer === 'hearts' || 'clubs' || 'diamonds' || 'spades', 'Not a valid input. ' + round4)
      game.card4 = game.deck.pop()
      if (answer === game.card4.suit) {
        game.gameState = GameState.Completed
        finishGame(game)
        return('Congratulations, the final card is the ' + game.card4.value + ' of ' + game.card4.suit + '.\n')
      } else { 
        games.delete(context.sender)
        return('The final card is the ' + game.card4.value + ' of ' + game.card4.suit + '.\n Better luck next time :(' )
      }
    }
    default: return('Noooooooooooo')
  }

}

function finishGame(game : OnNearBus) : String {
  const to_winner = ContractPromiseBatch.create(context.sender)
  const prize : u128  = new u128(i64(game.amount)*4)
  to_winner.transfer(prize)

  games.delete(context.sender)
  return('Congrats :) don\'t spend it all at once. Prize = ' + prize.toString)
}




// export function setGreeting(message: string): void {
//   const accountId = Context.sender
//   // Use logging.log to record logs permanently to the blockchain!
//   logging.log(`Saving greeting "${message}" for account "${accountId}"`)
//   storage.set(accountId, message)
// }
