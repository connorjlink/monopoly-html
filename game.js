const outputLog = document.getElementById("output-log");

function logMessage(message) {
    outputLog.innerText += message + '\n';
}


const TOTAL_HOUSES = 32;
const TOTAL_HOTELS = 12;

const propertyContainer = document.getElementById("property-container");

class AbstractProperty {
    constructor(name, cost, mortval) {
        this.name = name;
        this.cost = cost;
        this.mortval = mortval;
        this.improvementState = 0;
    }

    tryImprove() {
        let can, reason = this.canImprove();

        if (can) {

        } else {
            logMessage(reason);
        }
    }

    tryDemolish() {
        let can, reason = this.canDemolish();

        if (can) {

        } else {
            logMessage(reason);
        }
    }
}

class ColorProperty extends AbstractProperty {
    constructor(name, cost, mortval, rent0, rent1, rent2, rent3, rent4, rent5, devcost) {
        super(name, cost, mortval);
        this.rent0 = rent0;
        this.rent1 = rent1;
        this.rent2 = rent2;
        this.rent3 = rent3;
        this.rent4 = rent4;
        this.rent5 = rent5;
        this.devcost = devcost;
    }

    canImprove() {

    }

    canDemolish() {

    }
}

class RailroadProperty extends AbstractProperty {


    canImprove() {
        return false, 'railroad properties cannot be developed';
    }

    canDemolish() {
        return false, 'railroad properties cannot be developed';
    }

    tryImprove() {

    }

    tryDemolish() {

    }
}

class UtilityProperty extends AbstractProperty {


    canImprove() {
        return false, 'utility properties cannot be developed';
    }

    canDemolish() {
        return false, 'utility properties cannot be developed';
    }
}


class Property {
    constructor(name, rent0, rent1, rent2, rent3, rent4, rent5, cost, devcost, mortval) {
        this.name = name;
        this.rent0 = rent0;
        this.rent1 = rent1;
        this.rent2 = rent2;
        this.rent3 = rent3;
        this.rent4 = rent4;
        this.rent5 = rent5;
        this.cost = cost;
        this.devcost = devcost;
        this.mortval = mortval;
        this.owner = null;
    }
}


// property color group identifiers
const BROWN = 0, LIGHT_BLUE = 1, PINK = 2, ORANGE = 3, RED = 4, YELLOW = 5, GREEN = 6, BLUE = 7;

class Game {
    constructor() {
        this.availableHouses = TOTAL_HOUSES;
        this.availableHotels = TOTAL_HOTELS;

        this.properties = [
            // brown color group
            [
                new Property("Mediterranean Avenue", 2, 10, 30, 90, 160, 250, 60, 50, 30),
                new Property("Baltic Avenue", 4, 20, 60, 180, 320, 450, 60, 50, 30),
            ],
            
            // light blue color group
            [
                new Property("Oriental Avenue", 6, 30, 90, 270, 400, 550, 100, 50, 50),
                new Property("Vermont Avenue", 6, 30, 90, 270, 400, 550, 100, 50, 50),
                new Property("Connecticut Avenue", 8, 40, 100, 300, 450, 600, 120, 50, 60),
            ],
            
            // pink color group
            [
                new Property("St. Charles Place", 10, 50, 150, 450, 625, 750, 140, 100, 70),
                new Property("States Avenue", 10, 50, 150, 450, 625, 750, 140, 100, 70),
                new Property("Virginia Avenue", 12, 60, 180, 500, 700, 900, 160, 100, 80),
            ],
        
            // orange color group
            [
                new Property("St. James Place", 14, 70, 200, 550, 750, 950, 180, 100, 90),
                new Property("Tennessee Avenue", 14, 70, 200, 550, 750, 950, 180, 100, 90),
                new Property("New York Avenue", 16, 80, 220, 600, 800, 1000, 200, 100, 100),
            ],
        
            // red color group
            [
                new Property("Kentucky Avenue", 18, 90, 250, 700, 875, 1050, 220, 150, 110),
                new Property("Indiana Avenue", 18, 90, 250, 700, 875, 1050, 220, 150, 110),
                new Property("Illinois Avenue", 20, 100, 300, 750, 925, 1100, 240, 150, 120),
            ],
            
            // yellow color group
            [
                new Property("Atlantic Avenue", 22, 110, 330, 800, 975, 1150, 260, 150, 130),
                new Property("Ventnor Avenue", 22, 110, 330, 800, 975, 1150, 260, 150, 130),
                new Property("Marvin Gardens", 24, 120, 360, 850, 1025, 1200, 280, 150, 140),
            ],
            
            // green color group
            [
                new Property("Pacific Avenue", 26, 130, 390, 900, 1100, 1275, 300, 200, 150),
                new Property("North Carolina Avenue", 26, 130, 390, 900, 1100, 1275, 300, 200, 150),
                new Property("Pennsylvania Avenue", 28, 150, 450, 1000, 1200, 1400, 320, 200, 160),
            ],
        
            // dark blue color group
            [
                new Property("Park Place", 35, 175, 500, 1100, 1300, 1500, 350, 200, 175),
                new Property("Boardwalk", 50, 200, 600, 1400, 1700, 2000, 400, 200, 200),
            ],
        ]
    }

    updateAvailableProperties() {
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
}

var monopolyGame = new Game();
monopolyGame.updateAvailableProperties();

class Player {
    constructor(name, color, turn) {
        this.name = name;
        this.color = color;
        this.turn = turn;
        this.money = 1500;
        this.bailCards = 0;
        this.properties = [];
        this.inJail = false;
    }

    computeAssets() {
        let sum = 0;

        // getting out of jail costs $50, so each card is "worth" this much
        sum += (this.bailCards * 50);

        for (let property of this.properties) {
            sum += property.value;
        }

        sum += this.money;

        return sum;
    }

    computeLiabilities() {
        let sum = 0;

        for (let property of this.properties) {
            if (property.isMortgaged) {
                // mortgage value = 50%
                // mortgage interest = 10%
                sum += (property.value * 0.6);
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

var currentTurn = 0;

var players = []

function insertPlayerHTML(player) {
    existingPlayers.insertAdjacentHTML("beforeend", `
        <tr>
            <td>${player.name}</td>
            <td>${player.color}</td>
            <td>${player.turn + 1}</td>
        </tr>
    `);

    turnsPlayers.insertAdjacentHTML("beforeend", `
        <div class="turn">
            <div class="player-color">
                <div class="circle" style="background: ${player.color}"></div>
                <p>${player.name}</p>
            </div>
            
            <b>${player.money}&cent;</b>
        </div>
    `);

    assetsPlayers.insertAdjacentHTML("beforeend", `
        <tr>
            <td>${player.name}</td>
            <td>${player.money}</td>
            <td>${player.computeNetWorth()}</td>
        </tr>
    `);
}

const MAX_PLAYERS = 6;

var colors = ["red", "orange", "yellow", "green", "blue", "purple"];

const playerName = document.getElementById("name-input");

const existingPlayers = document.getElementById("existing-players");
const turnsPlayers = document.getElementById("turn-container");
const assetsPlayers = document.getElementById("assets-players");


function addPlayer() {
    const name = playerName.value;

    if (name != '') {
        playerName.classList.toggle("errored", false);
        playerName.value = '';

        const index = players.length;

        const color = colors[index];
        const turn = index;

        const player = new Player(name, color, turn);
        players.push(player);
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
    shuffleArray(players);

    existingPlayers.innerHTML = '';
    turnsPlayers.innerHTML = '';
    assetsPlayers.innerHTML = '';
    
    for (var i = 0; i < players.length; i++) {
        let player = players[i];
        player.turn = i;
        insertPlayerHTML(player);
    }
} 

function initializationSequence() {
    
}

