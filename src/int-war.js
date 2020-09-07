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

var GAME_STATES = {
	BUSY: 'busy',
	READY: 'ready',
	COMPARE: 'compare'
}

/**
 * 
 * @param {*} gameState  - busy (no buttons), ready (deal), compare (win states)
 */
function setButtonState(gameState) {
	switch (gameState) {
		case GAME_STATES.BUSY:
			$('#playerWin').hide();
			$('#compWin').hide();
			$('#deal').hide();
			break;
		case GAME_STATES.READY:
			$('#playerWin').hide();
			$('#compWin').hide();
			$('#deal').show();
			break;
		case GAME_STATES.COMPARE:
			$('#playerWin').show();
			$('#compWin').show();
			$('#deal').hide();
			break;
	}
}

setButtonState(GAME_STATES.BUSY);

cards.init({table:'#card-table', type:STANDARD, cardsUrl: 'libs/cards.js/img/cards.png'});
window.cards = cards;

var deck = new cards.Deck();
var player = new cards.Deck({faceUp:false, x:200, y:320});
var comp = new cards.Deck({faceUp:false, x:200, y:80});

deck.addCards(cards.all);

console.log(player, comp);

deck.render();
player.render();
comp.render();

deck.deal(52, [player, comp], 50, () => {
	setButtonState(GAME_STATES.READY);
});

// Let's use a Hand for each to show the next card

var player_hand = new cards.Deck({faceUp:true, x:300, y:320});
var comp_hand = new cards.Deck({faceUp:true, x:300, y:80});

var player_spoils = new cards.Deck({faceUp:true, x:450, y:320});
var comp_spoils = new cards.Deck({faceUp:true, x:450, y:80});


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
$('#playerWin').click(function() {
	setButtonState(GAME_STATES.BUSY);
	toTheVictor(player_spoils, () => {
		setButtonState(GAME_STATES.READY);
	});
});

$('#compWin').click(function() {
	setButtonState(GAME_STATES.BUSY);
	toTheVictor(comp_spoils, () => {
		setButtonState(GAME_STATES.READY);
	});
});

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