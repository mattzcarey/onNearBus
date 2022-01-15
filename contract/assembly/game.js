"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.games = exports.OnNearBus = exports.GameState = void 0;
//import { ContractCodeView } from "near-api-js/lib/providers/provider";
var near_sdk_as_1 = require("near-sdk-as");
var GameState;
(function (GameState) {
    GameState[GameState["Created"] = 0] = "Created";
    GameState[GameState["RedOrBlack"] = 1] = "RedOrBlack";
    GameState[GameState["HigherOrLower"] = 2] = "HigherOrLower";
    GameState[GameState["InsideOrOutside"] = 3] = "InsideOrOutside";
    GameState[GameState["WhichSuit"] = 4] = "WhichSuit";
    GameState[GameState["Completed"] = 5] = "Completed";
})(GameState = exports.GameState || (exports.GameState = {}));
var OnNearBus = /** @class */ (function () {
    function OnNearBus() {
        var rng = new near_sdk_as_1.RNG(1, u32.MAX_VALUE);
        var roll = rng.next();
        this.gameId = roll;
        this.gameState = GameState.Created;
        this.player = near_sdk_as_1.context.sender;
        this.amount = near_sdk_as_1.context.attachedDeposit;
    }
    OnNearBus = __decorate([
        nearBindgen
    ], OnNearBus);
    return OnNearBus;
}());
exports.OnNearBus = OnNearBus;
exports.games = new near_sdk_as_1.PersistentMap("g");
