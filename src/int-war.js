/** 
 * Game States - 
 *  - Deal half of the cards to each player.
 *  - 
 */
"use strict";
/* global cards, window */

function toTheVictor(winnersSpoils, callback) {
	player_hand.deal(1, [winnersSpoils], 100);
	comp_hand.deal(1, [winnersSpoils], 100, function() {
		callback();
	});
}

function warVictor(winnersSpoils, callback){
	player_hand.deal(1, [winnersSpoils], 150);
	comp_hand.deal(1, [winnersSpoils], 150, function() {
		player_war_stakes.deal(2, [winnersSpoils], 300);
		comp_war_stakes.deal(2, [winnersSpoils], 300, function() {
			player_war_hand.deal(1, [winnersSpoils], 150);
			comp_war_hand.deal(1, [winnersSpoils], 150, function() {
				callback();
			});
		});
	});
}

var GAME_STATES = {
	BUSY: 'busy',
	READY: 'ready',
	COMPARE: 'compare',
	WAR_START: 'war_start',
	WAR_END: 'war_end'
}

var POS = {
	player: {x: 200, y: 320},
	player_hand: {x: 300, y: 320},
	player_spoils: {x: 450, y: 320},
	player_spoils: {x: 450, y: 320},
	comp: {x: 200, y:80},
	comp_hand: {x: 300, y:80},
	comp_spoils: {x: 450, y:80}
}

function cardIntValue (card) {
	// Clubs / Spades / Black Joker
	var pSuits = ['c', 's', 'bj'];
	// Diamonds / Hearts / Red Joker
	var nSuits = ['d', 'h', 'rj'];

	// If it's a black card it's positive
	var positiveNumber = (pSuits.indexOf(card.suit) >= 0);

	var value = card.rank;
	// Aces, jokers, face cards are value 10
	if (value < 2 || value > 10) {
		value = 10;
	}

	if (positiveNumber) {
		return value;
	} else {
		return value * -1;
	}
}

function diffCards(playerCard, compCard) {
	return cardIntValue(playerCard) - cardIntValue(compCard);
}

function testCards(playerCard, compCard) {
	var diff = diffCards(playerCard, compCard);
	if (diff > 0) {
		return 'Player Wins!';
	} else if (diff < 0) {
		return 'Computer Wins!';
	}
	else {
		return "It's a tie! This means war!";
	}
}

/**
 * 
 * @param {*} gameState  - busy (no buttons), ready (deal), compare (win states)
 */
function setButtonState(gameState) {
	switch (gameState) {
		case GAME_STATES.BUSY:
			$('#warButton').hide();
			$('#compInstructions').hide();
			$('#deal').hide();
			break;
		case GAME_STATES.READY:
			$('#warButton').hide();
			$('#compInstructions').hide();
			$('#deal').show();
			break;
		case GAME_STATES.COMPARE:
			$('#warButton').show();
			$('#compInstructions').show();
			$('#deal').hide();
			break;
		case GAME_STATES.WAR_START:
			$('#warButton').hide();
			$('#compInstructions').show();
			$('#deal').hide();

			player_hand.x = POS.player_hand.x;
			player_hand.y += 50;

			player_spoils.x += 100;
			player_spoils.y += 50;

			comp_hand.x = POS.comp_hand.x;
			comp_hand.y -= 50;

			comp_spoils.x += 100;
			comp_spoils.y -= 50;

			player_hand.render();
			player_spoils.render();
			comp_hand.render();
			comp_spoils.render();


			break;
		case GAME_STATES.WAR_END:
			$('#compInstructions').hide();
			player_hand.x = POS.player_hand.x;
			player_hand.y = POS.player_hand.y;

			player_spoils.x = POS.player_spoils.x;
			player_spoils.y = POS.player_spoils.y;

			comp_hand.x = POS.comp_hand.x;
			comp_hand.y = POS.comp_hand.y;

			comp_spoils.x = POS.comp_spoils.x;
			comp_spoils.y = POS.comp_spoils.y;

			player_hand.render();
			player_spoils.render();
			comp_hand.render();
			comp_spoils.render();

			console.warn("Returning to Normal");
			setTimeout(() => setButtonState(GAME_STATES.READY), 200);

			break;
	}
	// Update Debug
	console.log('Player Hand', player_hand);
	console.log('Comp Hand', comp_hand);
	console.log(`Score || player:  ${player_spoils && player_spoils.length} comp:  ${comp_spoils && comp_spoils.length}`);
}

setButtonState(GAME_STATES.BUSY);

cards.init({
	table:'#card-table',
	type:STANDARD,
	cardsUrl: 'node_modules/cards.js/img/cards.png',
	redJoker: true,
	blackJoker: true
});
window.cards = cards;

var deck = new cards.Deck();
var player = new cards.Deck({faceUp:false, x:POS.player.x, y:POS.player.y});
var comp = new cards.Deck({faceUp:false, x:POS.comp.x, y:POS.comp.y});

deck.addCards(cards.all);

console.log(player, comp);

deck.render();
player.render();
comp.render();

deck.deal(52, [player, comp], 50, () => {
	setButtonState(GAME_STATES.READY);
});

// Let's use a Hand for each to show the next card

var player_hand = new cards.Deck({faceUp:true, x:POS.player_hand.x, y:POS.player_hand.y});
var comp_hand = new cards.Deck({faceUp:true, x:POS.comp_hand.x, y:POS.comp_hand.y});

var player_spoils = new cards.Deck({faceUp:true, x:POS.player_spoils.x, y:POS.player_spoils.y});
var comp_spoils = new cards.Deck({faceUp:true, x:POS.comp_spoils.x, y:POS.comp_spoils.y});


var comp_war_stakes =  new cards.Deck({faceUp:false, x:POS.comp_hand.x, y:POS.comp_hand.y});
var comp_war_hand =  new cards.Deck({faceUp:true, x:POS.comp_spoils.x, y:POS.comp_spoils.y});

var player_war_stakes =  new cards.Deck({faceUp:false, x:POS.player_hand.x, y:POS.player_hand.y});
var player_war_hand =  new cards.Deck({faceUp:true, x:POS.player_spoils.x, y:POS.player_spoils.y});

$('#compare').click(function () {
	console.log(`COMPARE: Player: ${cardIntValue(player_hand.topCard())}, computer: ${cardIntValue(comp_hand.topCard())}`);
	console.log(`Score || player:  ${player_spoils.length} comp:  ${comp_spoils.length}`);
});

$('#deal').click(function() {
	//Deck has a built in method to deal to hands.
	setButtonState(GAME_STATES.BUSY);
	player.deal(1, [player_hand], 50, function() {
		//This is a callback function, called when the dealing
		//is done.
		// discardPile.addCard(deck.topCard());
		// discardPile.render();
	});
	comp.deal(1, [comp_hand], 50, function() {
		setButtonState(GAME_STATES.COMPARE);
	});
});
// $('#playerWin').click(function() {
player_hand.click(function() {
	var diff = diffCards(player_hand.topCard(), comp_hand.topCard());
	console.warn(testCards(player_hand.topCard(), comp_hand.topCard()));
	if (diff <= 0) {
		alert ('Sorry, that\'s not right...');
		return;
	}
	setButtonState(GAME_STATES.BUSY);
	toTheVictor(player_spoils, () => {
		setButtonState(GAME_STATES.READY);
	});
});

// $('#compWin').click(function() {
comp_hand.click(function() {
	var diff = diffCards(player_hand.topCard(), comp_hand.topCard());
	console.warn(testCards(player_hand.topCard(), comp_hand.topCard()));
	if (diff >= 0) {
		alert ('Sorry, that\'s not right...');
		return;
	}
	setButtonState(GAME_STATES.BUSY);
	toTheVictor(comp_spoils, () => {
		setButtonState(GAME_STATES.READY);
	});
});

$('#warButton').click(function () {
	var diff = diffCards(player_hand.topCard(), comp_hand.topCard());
	console.warn(testCards(player_hand.topCard(), comp_hand.topCard()));
	if (diff !== 0) {
		alert ('Sorry, that\'s not right...');
		return;
	}
	setButtonState(GAME_STATES.WAR_START);

	player.deal(2, [player_war_stakes], 200, () => {
	comp.deal(2, [comp_war_stakes], 200, () => {
	// Together
	player.deal(1, [player_war_hand]);
	comp.deal(1, [comp_war_hand]);
	})});
});


player_war_hand.click(function() {
	var diff = diffCards(player_war_hand.topCard(), comp_war_hand.topCard());
	console.warn(testCards(player_war_hand.topCard(), comp_war_hand.topCard()));
	if (diff <= 0) {
		alert ('Sorry, that\'s not right...');
		return;
	}
	setButtonState(GAME_STATES.BUSY);
	warVictor(player_spoils, () => {
		setButtonState(GAME_STATES.WAR_END);
	});
});

// $('#compWin').click(function() {
comp_war_hand.click(function() {
	var diff = diffCards(player_war_hand.topCard(), comp_war_hand.topCard());
	console.warn(testCards(player_war_hand.topCard(), comp_war_hand.topCard()));
	if (diff >= 0) {
		alert ('Sorry, that\'s not right...');
		return;
	}
	setButtonState(GAME_STATES.BUSY);
	warVictor(comp_spoils, () => {
		setButtonState(GAME_STATES.WAR_END);
	});
});
// TODO: DOUBLE WAR?
/*


deck_player.y += 75;
deck_comp.y -= 75;

console.log(cards.all);

deck_player.addCards(cards.all.slice(0, 25));

deck_player.addCards(cards.all.slice(26));

deck_player.render();
deck_comp.render();

console.log(deck_player);
console.log(deck_comp);

*/
/*
//Tell the library which element to use for the table
cards.init({table:'#card-table', type:STANDARD, cardsUrl: 'libs/cards.js/img/cards.png'});

//Create a new deck of cards
deck = new cards.Deck();
//By default it's in the middle of the container, put it slightly to the side
deck.x -= 50;

//cards.all contains all cards, put them all in the deck
deck.addCards(cards.all);
//No animation here, just get the deck onto the table.
deck.render({immediate:true});

//Now lets create a couple of hands, one face down, one face up.
upperhand = new cards.Hand({faceUp:false, y:60});
lowerhand = new cards.Hand({faceUp:true,  y:340});

//Lets add a discard pile
discardPile = new cards.Deck({faceUp:true});
discardPile.x += 50;


//Let's deal when the Deal button is pressed:
$('#deal').click(function() {
	//Deck has a built in method to deal to hands.
	$('#deal').hide();
	deck.deal(5, [upperhand, lowerhand], 50, function() {
		//This is a callback function, called when the dealing
		//is done.
		discardPile.addCard(deck.topCard());
		discardPile.render();
	});
});


//When you click on the top card of a deck, a card is added
//to your hand
deck.click(function(card){
	if (card === deck.topCard()) {
		lowerhand.addCard(deck.topCard());
		lowerhand.render();
	}
});

//Finally, when you click a card in your hand, if it's
//the same suit or rank as the top card of the discard pile
//then it's added to it
lowerhand.click(function(card){
	if (card.suit == discardPile.topCard().suit
		|| card.rank == discardPile.topCard().rank) {
		discardPile.addCard(card);
		discardPile.render();
		lowerhand.render();
	}
});


//So, that should give you some idea about how to render a card game.
//Now you just need to write some logic around who can play when etc...
//Good luck :)

*/
