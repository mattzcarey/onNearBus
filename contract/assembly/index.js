"use strict";
exports.__esModule = true;
exports.play = exports.newGame = void 0;
var near_sdk_as_1 = require("near-sdk-as");
var game_1 = require("./game");
var WELCOME_MESSAGE = 'Welcome to On Near Bus: a blockchain adaptation of the popular drinking game.\n';
var round1 = "\'red\' or \'black\'?";
var round2 = "\'higher\' or \'lower\'?";
var round3 = "\'inside\' or \'outside\'?";
var round4 = "Last one, which suit is the next card? (hearts, clubs, diamonds, spades)";
function newGame() {
    assert(!game_1.games.contains(near_sdk_as_1.context.sender), "Already in game, use \'play\'");
    var game = new game_1.OnNearBus();
    game_1.games.set(near_sdk_as_1.context.sender, game);
    game.deck.shuffle();
    game.gameState = game_1.GameState.RedOrBlack;
    return (WELCOME_MESSAGE.toString() + round1);
}
exports.newGame = newGame;
function play(answer) {
    assert(game_1.games.contains(near_sdk_as_1.context.sender), 'GameId not found');
    var game = game_1.games.getSome(near_sdk_as_1.context.sender);
    switch (game.gameState) {
        case game_1.GameState.RedOrBlack: {
            assert(answer === 'red' || 'black', 'Not a valid input, ' + round1);
            game.card1 = game.deck.pop();
            if (answer === game.card1.color) {
                game.gameState = game_1.GameState.HigherOrLower;
                return ('Success, your card is the ' + game.card1.value + ' of ' + game.card1.suit + '.\n' + round2);
            }
            else {
                game_1.games["delete"](near_sdk_as_1.context.sender);
                return ('Your card is the ' + game.card1.value + ' of ' + game.card1.suit + '.\n Better luck next time :(');
            }
        }
        case game_1.GameState.HigherOrLower: {
            assert(answer === 'higher' || 'lower', 'Not a valid input, ' + round2);
            game.card2 = game.deck.pop();
            if ((answer === 'higher' && game.card1.numValue < game.card2.numValue) || (answer === 'lower' && game.card1.numValue > game.card2.numValue)) {
                game.gameState = game_1.GameState.InsideOrOutside;
                return ('Success, your card is the ' + game.card2.value + ' of ' + game.card2.suit + '.\n' + round3);
            }
            else {
                game_1.games["delete"](near_sdk_as_1.context.sender);
                return ('Your card is the ' + game.card2.value + ' of ' + game.card2.suit + '.\n Better luck next time :(');
            }
        }
        case game_1.GameState.InsideOrOutside: {
            assert(answer === 'inside' || 'outside', 'Not a valid input, ' + round3);
            game.card3 = game.deck.pop();
            if ((Math.min(game.card1.numValue, game.card2.numValue) < game.card3.numValue) && game.card3.numValue < Math.max(game.card2.numValue, game.card1.numValue)) {
                // Card is inside
                if (answer === "inside") {
                    game.gameState = game_1.GameState.WhichSuit;
                    return ('Success, your card is the ' + game.card3.value + ' of ' + game.card3.suit + '.\n' + round4);
                }
                else {
                    game_1.games["delete"](near_sdk_as_1.context.sender);
                    return ('Your card is the ' + game.card3.value + ' of ' + game.card3.suit + '.\n Better luck next time :(');
                }
            }
            else {
                // Card is outside
                if (answer === "outside") {
                    game.gameState = game_1.GameState.WhichSuit;
                    return ('Success, your card is the ' + game.card3.value + ' of ' + game.card3.suit + '.\n' + round4);
                }
                else {
                    game_1.games["delete"](near_sdk_as_1.context.sender);
                    return ('Your card is the ' + game.card3.value + ' of ' + game.card3.suit + '.\n Better luck next time :(');
                }
            }
        }
        case game_1.GameState.WhichSuit: {
            assert(answer === 'hearts' || 'clubs' || 'diamonds' || 'spades', 'Not a valid input. ' + round4);
            game.card4 = game.deck.pop();
            if (answer === game.card4.suit) {
                game.gameState = game_1.GameState.Completed;
                finishGame(game);
                return ('Congratulations, the final card is the ' + game.card4.value + ' of ' + game.card4.suit + '.\n');
            }
            else {
                game_1.games["delete"](near_sdk_as_1.context.sender);
                return ('The final card is the ' + game.card4.value + ' of ' + game.card4.suit + '.\n Better luck next time :(');
            }
        }
        default: return ('Noooooooooooo');
    }
}
exports.play = play;
function finishGame(game) {
    var to_winner = near_sdk_as_1.ContractPromiseBatch.create(near_sdk_as_1.context.sender);
    var prize = game.amount;
    to_winner.transfer(prize);
    game_1.games["delete"](near_sdk_as_1.context.sender);
    return ('Congrats :) don\'t spend it all at once. Prize = ' + prize.toString());
}
// export function setGreeting(message: string): void {
//   const accountId = Context.sender
//   // Use logging.log to record logs permanently to the blockchain!
//   logging.log(`Saving greeting "${message}" for account "${accountId}"`)
//   storage.set(accountId, message)
// }
