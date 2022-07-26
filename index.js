const prompt = require("prompt-sync")();

function card(value, name, suit) {
    this.value = value;
    this.name = name;
    this.suit = suit;
}

function deck() {
    this.names = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    this.suits = ['Hearts', 'Diamonds', 'Spades', 'Clubs'];

    var cards = [];
    for (var s = 0; s < this.suits.length; s++) {
        for (var n = 0; n < this.names.length; n++) {
            cards.push(new card(n + 1 + s / 10, this.names[n], this.suits[s]));
        }
    }
    return cards;
}

const getRandomCard = (max) => Math.floor(Math.random() * max);

const generatePlayers = (numPlayers) => {
    let playersArray = []
    for (let i = 0; i < numPlayers; i++) {
        let newPlayer = new Object()
        newPlayer.name = 'player' + i
        newPlayer.score = 0
        newPlayer.currentHand = null
        playersArray.push(newPlayer)
    }
    return playersArray
}

const gameLogic = (myDeck, usedCards, players,currentRoundLeader, i) => {
    const deckIndex = getRandomCard(myDeck.length)
    let lastPlayerToPlay = null
    const currentDraw = myDeck[deckIndex]
    usedCards.push(myDeck[deckIndex])
    myDeck.splice(deckIndex, 1)
    players[i].currentHand = currentDraw
    if (i === 0) {
        currentRoundLeader = players[i]
    }
    else {
        if (players[i].currentHand.value > currentRoundLeader.currentHand.value) {
            currentRoundLeader = players[i]
        }
    }
    lastPlayerToPlay= players[i];
    return [currentRoundLeader, usedCards, myDeck, lastPlayerToPlay]
}


const startGame = (numPlayers) => {
    let players = []
    let usedCards = []
    let myDeck = new deck();
    players = generatePlayers(numPlayers)

    while (myDeck.length>=numPlayers) {
        let currentRoundLeader = null
        let lastPlayerToPlay = null
        let input;
        for (i = 0; i < numPlayers; i++) {
            if(i!==0){
                input = prompt(`previous player drew ${lastPlayerToPlay.currentHand.name} of ${lastPlayerToPlay.currentHand.suit} Do u want to skip the round? Please answer yes or no:`);
                if (input !== 'yes') {
                    [currentRoundLeader, usedCards ,myDeck,lastPlayerToPlay] = gameLogic(myDeck, usedCards,players,currentRoundLeader,i)
                }
                else{
                    console.log("Skipped\n")
                }
            }
            else{
                    console.log('current scoreboard is: ')
                    let res = players.sort(({ score: a }, { score: b }) => b - a);
                    console.log(res);
                    console.log("\nStart of new round\n");
                    [currentRoundLeader, usedCards ,myDeckm,lastPlayerToPlay] = gameLogic(myDeck, usedCards,players,currentRoundLeader,i)
            }


        }
        let player = players.find(player => {
            return player.name === currentRoundLeader.name
        })
        console.log(`\nEnd of round, winner is ${player.name}`)
        player.score += 1
    }

    let res = players.sort(({ score: a }, { score: b }) => b - a);
    console.log('Final Results: ')
    console.log(res);
    return res
}

startGame(4)