const outputLog = document.getElementById("output-log");

function logMessage(message) {
    outputLog.textContent += message + '\n';
    console.log(message);
}

const TOTAL_HOUSES = 32;
const TOTAL_HOTELS = 12;

const propertyContainer = document.getElementById("property-container");

class AbstractSquare {
    constructor(name, color, cost, mortval, icon) {
        this.name = name;
        this.color = color;
        this.cost = cost;
        this.mortval = mortval;
        this.icon = icon;
        this.improvementState = 0;
        this.isMortgaged = false;
        this.owned = null;
    }

    currentRent() {
        return null;
    }

    tryImprove(player, game) {
        let [can, reason] = this.canImprove();

        if (can) {
            this.improvementState++;
            player.money -= this.devcost;

            if (this.improvementState < 5) {
                game.availableHouses--;
            } else {
                game.availableHotels--;
            }

        } else {
            logMessage(reason);
        }
    }

    tryDemolish(player, game) {
        let [can, reason] = this.canDemolish();

        if (can) {
            this.improvementState--;
            player.money += this.devcost;

            if (this.improvementState < 5) {
                game.availableHouses++;
            } else {
                game.availableHotels++;
            }
        } else {
            logMessage(reason);
        }
    }
}

class ColorProperty extends AbstractSquare {
    constructor(name, color, cost, mortval, rent0, rent1, rent2, rent3, rent4, rent5, devcost) {
        // no meaningful icon
        super(name, color, cost, mortval, null);
        this.rent0 = rent0;
        this.rent1 = rent1;
        this.rent2 = rent2;
        this.rent3 = rent3;
        this.rent4 = rent4;
        this.rent5 = rent5;
        this.devcost = devcost;
    }

    currentRent() {
        switch (this.improvementState) {
            case 0: return this.rent0;
            case 1: return this.rent1;
            case 2: return this.rent2;
            case 3: return this.rent3;
            case 4: return this.rent4;
            case 5: return this.rent5;
        }
    }

    canImprove() {
        let can = true;
        let reason = "";

        let isHotelImprovement = this.improvementState > 4;

        if (isMortgaged) {
            can = false;
            reason = 'mortgaged properties cannot be developed';
        } else {

        }

        return [can, reason];
    }

    canDemolish() {
        let can = true;
        let reason = "";

        let isHotelDemolition = this.improvementState > 4;

        if (isMortgaged) {
            can = false;
            reason = 'mortgaged properties cannot be developed';
        } else {

        }

        return [can, reason];
    }
}

class RailroadProperty extends AbstractSquare {
    constructor(name, cost, mortval) {
        // no meaningful color
        super(name, null, cost, mortval, "&#x1F686;");
    }

    currentRent() {
        let railroadsOwned = 0;

        for (let square of monopolyGame.squares) {
            if (square.constructor === RailroadProperty) {
                if (square.owned == this.owned) {
                    railroadsOwned[square.owned]++;
                }
            }
        }
        
        switch (railroadsOwned) {
            case 0: return 0;
            case 1: return 25;
            case 2: return 50;
            case 3: return 100;
            case 4: return 200;
        }
    }

    canImprove() {
        return [false, 'railroad properties cannot be developed'];
    }

    canDemolish() {
        return [false, 'railroad properties cannot be developed'];
    }
}

class UtilityProperty extends AbstractSquare {
    constructor(name, cost, mortval, icon) {
        // no meaningful color
        super(name, null, cost, mortval, icon);
    }

    currentRent(dice) {
        if (monopolyGame.squares[12].owned == monopolyGame.squares[28].owned) { // both utilities owned by the same player
            return 10 * dice;
        } else {
            return 4 * dice;
        }
    }

    canImprove() {
        return [false, 'utility properties cannot be developed'];
    }

    canDemolish() {
        return [false, 'utility properties cannot be developed'];
    }
}

class CornerSquare extends AbstractSquare {
    constructor(name, icon) {
        // no meaningful color, cost, or mortval
        super(name, null, null, null, icon);
    }

    canImprove() {
        return [false, 'corner squares cannot be developed'];
    }

    canDemolish() {
        return [false, 'corner squares cannot be developed'];
    }
}

class CommunityChestSquare extends AbstractSquare {
    constructor() {
        // no meaningful color, mortval
        super("Community Chest", null, "Follow Card Instructions", null, "&#x1F4E6;");
    }

    canImprove() {
        return [false, 'community chest squares cannot be developed'];
    }

    canDemolish() {
        return [false, 'community chest squares cannot be developed'];
    }
}

class ChanceSquare extends AbstractSquare {
    constructor() {
        // no meaningful color, cost, or mortval
        super("Chance", null, "", null, "&quest;");
    }

    canImprove() {
        return [false, 'chance squares cannot be developed'];
    }

    canDemolish() {
        return [false, 'chance squares cannot be developed'];
    }
}

class TaxSquare extends AbstractSquare {
    constructor(name, cost, icon) {
        // no meaningful color or mortval
        super(name, null, cost, null, icon);
    }
}

class Game {
    constructor() {
        this.availableHouses = TOTAL_HOUSES;
        this.availableHotels = TOTAL_HOTELS;

        this.players = [];
        this.currentTurn = 0;

        this.squaresMarkup = Array.from(document.querySelectorAll('[square]'));
        this.squaresMarkup.sort((a, b) => a.getAttribute('square') - b.getAttribute('square'));

        this.lastDice = 0;

        this.squares = [
            // bottom edge
            new CornerSquare("GO", "Collect 200&cent; as you pass"),
            new ColorProperty("Mediterranean Avenue", 0, 60, 30, 2, 10, 30, 90, 160, 250, 50),
            new CommunityChestSquare(),
            new ColorProperty("Baltic Avenue", 0, 60, 30, 4, 20, 60, 180, 320, 450, 50),
            //new TaxSquare("Income Tax", 200, "&loz;"),
            new TaxSquare("Income Tax", 200, `<img src="income.svg" width="30">`),
            new RailroadProperty("Reading Railroad", 200, 100),
            new ColorProperty("Oriental Avenue", 1, 100, 50, 6, 30, 90, 270, 400, 550, 50),
            new ChanceSquare(),
            new ColorProperty("Vermont Avenue", 1, 100, 50, 6, 30, 90, 270, 400, 550, 50),
            new ColorProperty("Connecticut Avenue", 1, 120, 60, 8, 40, 100, 300, 450, 600, 50),
            new CornerSquare("In Jail", "Just Visiting"),

            // left edge
            new ColorProperty("St. Charles Place", 2, 140, 70, 10, 50, 150, 450, 625, 750, 100),
            new UtilityProperty("Electric Company", 150, 75, "&#x1F4A1;"),
            new ColorProperty("States Avenue", 2, 140, 70, 10, 50, 150, 450, 625, 750, 100),
            new ColorProperty("Virginia Avenue", 2, 160, 80, 12, 60, 180, 500, 700, 900, 100),
            new RailroadProperty("Pennsylvania Railroad", 200, 100),
            new ColorProperty("St. James Place", 3, 180, 90, 14, 70, 200, 550, 750, 950, 100),
            new CommunityChestSquare(),
            new ColorProperty("Tennessee Avenue", 3, 180, 90, 14, 70, 200, 550, 750, 950, 100),
            new ColorProperty("New York Avenue", 3, 200, 100, 16, 80, 220, 600, 800, 1000, 100),
        
            // top edge
            new CornerSquare("Free Parking", "&#x1F697;"),
            new ColorProperty("Kentucky Avenue", 4, 220, 110, 18, 90, 250, 700, 875, 1050, 150),
            new ChanceSquare(),
            new ColorProperty("Indiana Avenue", 4, 220, 110, 18, 90, 250, 700, 875, 1050, 150),
            new ColorProperty("Illinois Avenue", 4, 240, 120, 20, 100, 300, 750, 925, 1100, 150),
            new RailroadProperty("B. & O. Railroad", 200, 100),
            new ColorProperty("Atlantic Avenue", 5, 260, 130, 22, 110, 330, 800, 975, 1150, 150),
            new ColorProperty("Ventnor Avenue", 5, 260, 130, 22, 110, 330, 800, 975, 1150, 150),
            new UtilityProperty("Water Works", 150, 75, "&#x1F6B0;"),
            new ColorProperty("Marvin Gardens", 5, 280, 140, 24, 120, 360, 850, 1025, 1200, 150),
            new CornerSquare("Go To Jail", "&#x1F6A8;"),

            // right edge
            new ColorProperty("Pacific Avenue", 6, 300, 150, 26, 130, 390, 900, 1100, 1275, 200),
            new ColorProperty("North Carolina Avenue", 6, 300, 150, 26, 130, 390, 900, 1100, 1275, 200),
            new CommunityChestSquare(),
            new ColorProperty("Pennsylvania Avenue", 6, 320, 160, 28, 150, 450, 1000, 1200, 1400, 200),
            new RailroadProperty("Short Line", 200, 100),
            new ChanceSquare(),
            new ColorProperty("Park Place", 7, 350, 175, 35, 175, 500, 1100, 1300, 1500, 200),
            new TaxSquare("Luxury Tax", 100, "&#x1F48D;"),
            new ColorProperty("Boardwalk", 7, 400, 200, 50, 200, 600, 1400, 1700, 2000, 200),
        ];
    }

    /*rebuildBoard() {
        // NOTE: only the custom board tags will have this attribute
        const squares = document.querySelectorAll("[square]");

        for (let square of squares) {
            const id = square.getAttribute("square");

            switch (square.constructor) {
                case ColorProperty:
                    break;
                
                case RailroadProperty:
                    break;

                case UtilityProperty:
                    break;

                case CornerSquare:
                    break;

                case CommunityChestSquare:
                    break;

                case ChanceSquare:
                    square.innerHTML = iconic()
                    break;

                case TaxSquare:
                    square.innerHTML = iconic(square.name, square.icon, square.cost);
                    break;

                case AbstractSquare:
                default:
                    console.error("Cannot regenerate markup for " + square.constructor.name);
                    break;
            }
        }
    }*/

    repositionPlayers() {
        for (let square of this.squaresMarkup) {
            square.removeAttribute('players');
        }

        for (let player of monopolyGame.players) {
            let current = this.squaresMarkup[player.currentSquare].getAttribute('players');
            current = (current == null ? '' : current);
            this.squaresMarkup[player.currentSquare].setAttribute('players', current + `,${player.turn + 1}`);
        }
    }

    resetCurrentTurn() {
        let turns = turnContainer.children;

        for (let i = 0; i < turns.length; i++) {
            turns[i].classList.toggle('active', false);
        }

        turns[this.currentTurn].classList.toggle('active', true);
    }

    rebuildAvailableImprovements() {
        propertyContainer.innerHTML = `
            <tr>
                <td>House</td>
                <td>${this.availableHouses}</td>
                <td>${TOTAL_HOUSES - this.availableHouses}</td>
                <td>${TOTAL_HOUSES}</td>
            </tr>
    
            <tr>
                <td>Hotel</td>
                <td>${this.availableHotels}</td>
                <td>${TOTAL_HOTELS - this.availableHotels}</td>
                <td>${TOTAL_HOTELS}</td>
            </tr>
        `;
    }

    rebuildPlayerAccounts() {
        assetsPlayers.innerHTML = '';

        for (let player of this.players) {
            markupPlayerAccounts(player);
        }
    }

    rebuildTurnBalances() {
        turnContainer.innerHTML = '';

        for (let player of this.players) {
            markupTurnBalances(player);
        }
    }

    unhighlightAll() {
        for (let square of monopolyGame.squaresMarkup) {
            square.removeAttribute('highlighted');
            square.removeAttribute('targeted');
        }
    }

    takePlayerAction(dice) {
        let player = this.players[this.currentTurn];
        let square = this.squares[player.currentSquare];

        switch (square.constructor) {
            case ColorProperty: {
                if (square.owned == null) {
                    promptBuy(square);
                } else if (square.owned != player.turn) {
                    promptRent(square.currentRent())
                } else {
                    // current player owns the property so no need to pay rent
                }
            } break;

            case UtilityProperty: {
                if (square.owned == null) {
                    promptBuy(square);
                } else if (square.owned != player.turn) {
                    promptRent(square.currentRent(dice))
                } else {
                    // current player owns the property so no need to pay rent
                }
            } break;

            case RailroadProperty: {
                if (square.owned == null) {
                    promptBuy(square);
                } else if (square.owned != player.turn) {
                    promptRent(square.currentRent())
                } else {
                    // current player owns the property so no need to pay rent
                }
            } break;

            case TaxSquare: {
                if (player.currentSquare === 4) { // "income tax" 
                    let success = player.withdraw(200);
                    if (success) {
                        this.rebuildPlayerAccounts();
                        this.rebuildTurnBalances();
                        logMessage(`${player.name} has paid 200¢ in income tax.`);
                    } else {
                        this.bankrupt(player);
                    }
                } else if (player.currentSquare === 38) { // "luxury tax"
                    let success = player.withdraw(100);

                    if (success) {
                        logMessage(`${player.name} has paid 100¢ in luxury tax.`);
                    } else {
                        this.bankrupt(player);
                    }
                }
            } break;
        }

    }

    bankrupt(player) {
        // TODO: remove player from active pools everywhere and cede improvements to the bank and acution the rest of the properties
        logMessage(`${player.name} has gone bankrupt.`);
    }
}

var monopolyGame = new Game();
monopolyGame.rebuildAvailableImprovements();

// Credit: MDN
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Player {
    constructor(name, color, turn) {
        this.name = name;
        this.color = color;
        this.turn = turn;
        this.money = 1500;
        this.bailCards = 0;
        this.inJail = false;
        this.currentSquare = 0; // start on GO
    }

    roll() {
        disableRoll();
        enableEndTurn();

        let die1 = getRandomInt(1, 6);
        let die2 = getRandomInt(1, 6);

        let sum = die1 + die2;
        monopolyGame.lastDice = sum;

        let doublesString = (die1 === die2) ? '(doubles) ' : '';

        let targetSquare = (this.currentSquare + sum) % monopolyGame.squares.length;
        logMessage(`${this.name} rolled ${sum} ${doublesString}and landed on ${monopolyGame.squares[targetSquare].name}.`);
        // ensure squares wrap around

        // TODO: highlight all squares along the way
        //monopolyGame.squares[targetSquare].
        monopolyGame.unhighlightAll();
        for (let i = this.currentSquare; i < this.currentSquare + sum; i++) {
            monopolyGame.squaresMarkup[i % monopolyGame.squaresMarkup.length].setAttribute('highlighted', '');
        }

        monopolyGame.squaresMarkup[targetSquare].removeAttribute('highlighted');
        monopolyGame.squaresMarkup[targetSquare].setAttribute('targeted', '');

        monopolyGame.players[monopolyGame.currentTurn].currentSquare = targetSquare;

        // TODO: animate
    }

    trade() {
        logMessage("Trading is not supported at this time");
    }

    deposit(amount) {
        this.money += amount;
    }

    withdraw(amount) {
        if (this.money >= amount) {
            this.money -= amount;
            return true;
        } else {
            let difference = amount - this.money;
            return this.raiseCapital(difference);
        }
    }

    raiseCapital(amount) {
        // TODO: auction, etc. to raise capital
        return true;
    }

    endTurn() {
        monopolyGame.takePlayerAction(monopolyGame.lastDice);

        monopolyGame.unhighlightAll();
        monopolyGame.repositionPlayers();
        monopolyGame.currentTurn = (monopolyGame.currentTurn + 1) % monopolyGame.players.length;
        monopolyGame.resetCurrentTurn();

        enableRoll();
        disableEndTurn();

        logMessage(`${this.name}'s turn has ended; it's now ${monopolyGame.players[monopolyGame.currentTurn].name}'s turn to roll.`);
    }

    computeAssets() {
        let sum = 0;

        // getting out of jail costs $50, so each card is "worth" this much
        sum += (this.bailCards * 50);

        for (let square of monopolyGame.squares) {
            if (square.owned === this.turn) {
                sum += property.value;
            }
        }

        sum += this.money;

        return sum;
    }

    computeLiabilities() {
        let sum = 0;

        for (let square of monopolyGame.squares) {
            if (square.owned === this.turn) {
                if (square.isMortgaged) {
                    // mortgage value = 50%, interest = 10%
                    sum += (property.value * 0.6);
                }
            }
        }

        return sum;
    }

    computeNetWorth() {
        return this.computeAssets() - this.computeLiabilities();
    }


    tryImprove(property) {
        const cost = property.improvementCost;

        // improvement successful
        if (true) {
            this.money -= cost;
            property.improvementState++;
        }
    }

    tryDemolish(property) {
        // demolition successful 
        if (true) {
            this.money += cost;
            property.improvementState++;
        }
    }
}

function markupTurnBalances(player) {
    turnContainer.insertAdjacentHTML("beforeend", `
        <div class="turn">
            <div class="player-color">
                <div class="circle" style="background: ${player.color}"></div>
                <p>${player.name}</p>
            </div>
            
            <b>${player.money}&cent;</b>
        </div>
    `);
}

function markupPlayerAccounts(player) {
    assetsPlayers.insertAdjacentHTML("beforeend", `
        <tr>
            <td>${player.name}</td>
            <td>${player.money}</td>
            <td>${player.computeNetWorth()}</td>
        </tr>
    `);
}

function insertPlayerHTML(player) {
    existingPlayers.insertAdjacentHTML("beforeend", `
        <tr>
            <td>${player.name}</td>
            <td>${player.color}</td>
            <td>${player.turn + 1}</td>
        </tr>
    `);

    markupTurnBalances(player);
    markupPlayerAccounts(player);
}

const MAX_PLAYERS = 6;

var colors = ["red", "orange", "yellow", "green", "blue", "purple"];

const playerName = document.getElementById("name-input");

const existingPlayers = document.getElementById("existing-players");
const turnContainer = document.getElementById("turn-container");
const assetsPlayers = document.getElementById("assets-players");

const rollButton = document.getElementById("roll-button");
const tradeButton = document.getElementById("trade-button");
const endTurnButton = document.getElementById("endturn-button");

function addPlayer() {
    const name = playerName.value;

    if (name != '') {
        playerName.classList.toggle("errored", false);
        playerName.value = '';

        const index = monopolyGame.players.length;

        const color = colors[index];
        const turn = index;

        const player = new Player(name, color, turn);
        monopolyGame.players.push(player);
        insertPlayerHTML(player);

        if (index >= MAX_PLAYERS - 1) {
            document.getElementById("add-button").disabled = true;
        } else if (index >= 1) {
            document.getElementById("start-button").disabled = false;
        }
    } else {
        playerName.classList.toggle("errored", true);
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i >= 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


function randomizeTurnOrder() {
    shuffleArray(monopolyGame.players);

    existingPlayers.innerHTML = '';
    turnContainer.innerHTML = '';
    assetsPlayers.innerHTML = '';
    
    for (var i = 0; i < monopolyGame.players.length; i++) {
        let player = monopolyGame.players[i];
        player.turn = i;
        insertPlayerHTML(player);
    }
} 

function disableRoll() {
    rollButton.toggleAttribute('disabled', true);
}

function enableRoll() {
    rollButton.toggleAttribute('disabled', false);
}

function disableEndTurn() {
    endTurnButton.toggleAttribute('disabled', true)
}

function enableEndTurn() {
    endTurnButton.toggleAttribute('disabled', false);
}

function initializationSequence() {
    //rebuildBoard();
    disableEndTurn();
    monopolyGame.repositionPlayers();
    monopolyGame.resetCurrentTurn();
    logMessage(`Welcome to Monopoly! It's ${monopolyGame.players[0].name}'s turn to roll.`);
}

