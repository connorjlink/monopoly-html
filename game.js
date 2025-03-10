const outputLog = document.getElementById("output-log");

function logMessage(message) {
    outputLog.textContent += message + '\n';
    console.log(message);
}

const TOTAL_HOUSES = 32;
const TOTAL_HOTELS = 12;

const propertyContainer = document.getElementById("property-container");

class AbstractSquare {
    constructor(square, name, color, cost, mortval, icon) {
        this.square = square;
        this.name = name;
        this.color = color;
        this.cost = cost;
        this.mortgageValue = mortval;
        this.icon = icon;
        this.improvementState = 0;
        this.owned = null;
    }

    currentRent() {
        return null;
    }

    tryImprove(player, game) {
        let [can, reason] = this.canImprove(player);

        if (can) {
            if (this.improvementState === -1) {
                // unmortgage it (with 10% interest)
                let cost = this.mortgageValue * 1.1;
                if (player.withdraw(cost)) {
                    this.improvementState++;
                    game.rebuildTitleDeeds();
                    logMessage(`${player.name} has unmortgaged ${this.name} for ${cost}¢.`);
                }
            } else {
                if (player.withdraw(this.improvementCost)) {
                    this.improvementState++;
                    
                    monopolyGame.squaresMarkup[this.square].setAttribute('improvement', this.improvementState);

                    if (this.improvementState < 5) {
                        game.availableHouses--;
                    } else {
                        game.availableHotels--;
                    }
    
                    game.rebuildAvailableImprovements();
                    logMessage(`${player.name} has improved ${this.name} for ${this.improvementCost}¢.`);
                }
            }
        } else {
            logMessage(`Cannot improve ${this.name} because ${reason}`);
        }

        return can;
    }

    tryDemolish(player, game) {
        let [can, reason] = this.canDemolish(player);

        if (can) {
            this.improvementState--;

            monopolyGame.squaresMarkup[this.square].setAttribute('improvement', this.improvementState);
            
            if (this.improvementState === -1) {
                // mortgage it
                player.deposit(this.mortgageValue);
                game.rebuildTitleDeeds();
                logMessage(`${player.name} has mortgaged ${this.name} for ${this.mortgageValue}¢.`);
            } else {
                let amount = this.improvementCost * 0.5;
                player.deposit(amount);

                if (this.improvementState < 5) {
                    game.availableHouses++;
                } else {
                    game.availableHotels++;
                }

                game.rebuildAvailableImprovements();
                logMessage(`${player.name} has demolished ${this.name} for ${amount}¢.`);
            }
        } else {
            logMessage(`Cannot demolish ${this.name} because ${reason}`);
        }

        return can;
    }
}

class ColorProperty extends AbstractSquare {
    constructor(square, name, color, cost, mortval, rent0, rent1, rent2, rent3, rent4, rent5, improvementCost) {
        // no meaningful icon
        super(square, name, color, cost, mortval, null);
        this.rent0 = rent0;
        this.rent1 = rent1;
        this.rent2 = rent2;
        this.rent3 = rent3;
        this.rent4 = rent4;
        this.rent5 = rent5;
        this.improvementCost = improvementCost;
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

    canImprove(player) {
        let can = true;
        let reason = "";

        let isHotelImprovement = this.improvementState > 4;

        if (this.improvementState >= 5) {
            can = false;
            reason = "hotel-renovated properties cannot be further improved";
        } else {
            if (isHotelImprovement && monopolyGame.availableHotels === 0) {
                can = false;
                reason = "there remain no more hotels for improvements";
            } else if (monopolyGame.availableHouses === 0) {
                can = false;
                reason = "there remain no more houses for improvements";
            } else {
                let colorGroup = [];
                let colorGroupOwned = true;

                for (let square of monopolyGame.squares) {
                    if ('color' in square) {
                        if (square.color == this.color) {
                            colorGroup.push(square);

                            if (square.owned != player.turn) {
                                colorGroupOwned = false;
                            }
                        }
                    }
                }

                if (this.improvementState !== -1) {
                    if (!colorGroupOwned) {
                        can = false;
                        reason = "there exists no monopoly on the target color group";
                    } else {
                        let lowestImprovementState = colorGroup[0].improvementState;
    
                        for (let square of colorGroup) {
                            if (square.improvementState < lowestImprovementState) {
                                lowestImprovementState = square.improvementState;
                            }
                        }

                        let difference = this.improvementState - lowestImprovementState;
                        
                        if (difference >= 1) {
                            can = false;
                            reason = "color group properties must be evenly improved";
                        }
                    }
                }
            }   
        }

        return [can, reason];
    }

    canDemolish(player) {
        let can = true;
        let reason = "";

        let isHotelDemolition = this.improvementState > 4;

        if (this.improvementState <= -1) {
            can = false;
            reason = "mortgaged properties cannot be further demolished";
        } else {
            let colorGroup = [];
            let colorGroupOwned = true;

            for (let square of monopolyGame.squares) {
                if ('color' in square) {
                    if (square.color == this.color) {
                        colorGroup.push(square);

                        if (square.owned != player.turn) {
                            colorGroupOwned = false;
                        }
                    }
                }
            }

            if (!colorGroupOwned) {
                can = false;
                reason = "there exists no monopoly on the target color group";
            } else {
                let highestImprovementState = colorGroup[0].improvementState;

                for (let square of colorGroup) {
                    if (square.improvementState > highestImprovementState) {
                        highestImprovementState = square.improvementState;
                    }
                }

                let difference = highestImprovementState - this.improvementState;
                
                if (difference >= 1) {
                    can = false;
                    reason = "color group properties must be evenly demolished";
                }
            }
        }

        return [can, reason];
    }
}

class RailroadProperty extends AbstractSquare {
    constructor(square, name, cost, mortval) {
        // no meaningful color
        super(square, name, null, cost, mortval, "&#x1F686;");
    }

    currentRent() {
        let railroadsOwned = 0;

        for (let square of monopolyGame.squares) {
            if (square.constructor === RailroadProperty) {
                if (square.owned == this.owned) {
                    railroadsOwned++;
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

    canImprove(player) {
        return [this.improvementState === -1, 'railroad properties cannot be developed'];
    }

    canDemolish(player) {
        return [this.improvementState === 0, 'railroad properties cannot be developed'];
    }
}

class UtilityProperty extends AbstractSquare {
    constructor(square, name, cost, mortval, icon) {
        // no meaningful color
        super(square, name, null, cost, mortval, icon);
    }

    currentRent(dice) {
        if (monopolyGame.squares[12].owned == monopolyGame.squares[28].owned) { // both utilities owned by the same player
            return 10 * dice;
        } else {
            return 4 * dice;
        }
    }

    canImprove(player) {
        return [this.improvementState === -1, 'utility properties cannot be developed'];
    }

    canDemolish(player) {
        return [this.improvementState === 0, 'utility properties cannot be developed'];
    }
}

class CornerSquare extends AbstractSquare {
    constructor(square, name, icon) {
        // no meaningful color, cost, or mortval
        super(square, name, null, null, null, icon);
    }

    canImprove(player) {
        return [false, 'corner squares cannot be developed'];
    }

    canDemolish(player) {
        return [false, 'corner squares cannot be developed'];
    }
}

class GoToJailSquare extends AbstractSquare {
    constructor(square, name, icon) {
        // no meaningful color, cost, or mortval
        super(square, name, null, null, null, icon);
    }

    canImprove(player) {
        return [false, 'corner squares cannot be developed'];
    }

    canDemolish(player) {
        return [false, 'corner squares cannot be developed'];
    }
}

class CommunityChestSquare extends AbstractSquare {
    constructor(square) {
        // no meaningful color, mortval
        super(square, "Community Chest", null, "Follow Card Instructions", null, "&#x1F4E6;");
    }

    canImprove(player) {
        return [false, 'community chest squares cannot be developed'];
    }

    canDemolish(player) {
        return [false, 'community chest squares cannot be developed'];
    }
}

class ChanceSquare extends AbstractSquare {
    constructor(square) {
        // no meaningful color, cost, or mortval
        super(square, "Chance", null, "", null, "&quest;");
    }

    canImprove(player) {
        return [false, 'chance squares cannot be developed'];
    }

    canDemolish(player) {
        return [false, 'chance squares cannot be developed'];
    }
}

class TaxSquare extends AbstractSquare {
    constructor(square, name, cost, icon) {
        // no meaningful color or mortval
        super(square, name, null, cost, null, icon);
    }
}



class AbstractDraw {
    constructor(type, title, text, functor) {
        this.type = type;
        this.title = title;
        this.text = text;
        this.functor = functor;
    }
}

class CommunityChestDraw extends AbstractDraw {
    constructor(title, text, functor) {
        super("Community Chest", title, text, functor);
    }
}

class ChanceDraw extends AbstractDraw {
    constructor(title, text, functor) {
        super("Chance", title, text, functor);
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

        this.chanceCards = [
            new ChanceDraw("Advance to GO", "Collect 200¢", (player) => { 
                player.advanceTo(0);
                logMessage(`${player.name} has advanced to GO through Chance.`);
            }),
            new ChanceDraw("Take a Walk on The Boardwalk", "Advance to Boardwalk; If You Pass GO, Collect 200¢", (player) => { 
                player.advanceTo(39); 
                logMessage(`${player.name} has advanced to Boardwalk through Chance.`);
                player.tryPayRentFactor();                
            }),
            new ChanceDraw("Advance to Illinois Avenue", "If You Pass GO, Collect 200¢", (player) => { 
                player.advanceTo(24); 
                logMessage(`${player.name} has advanced to Illinois Avenue through Chance.`);
                player.tryPayRentFactor();
            }),
            new ChanceDraw("Advance to St. Charles Place", "If You Pass GO, Collect 200¢", (player) => { 
                player.advanceTo(11);
                logMessage(`${player.name} has advanced to St. Charles Place through Chance.`);
                player.tryPayRentFactor();
            }),
            new ChanceDraw("Take a Ride on the Reading", "Advance to Reading Railroad; If You Pass GO, Collect 200¢", (player) => { 
                player.advanceTo(5);
                logMessage(`${player.name} has advanced to Reading Railroad through Chance.`);
                player.tryPayRentFactor();
            }),
            new ChanceDraw("Advance to the Nearest Railroad", "If OWNED, Pay the Owner Twice the Value to Which He/She is Otherwise Entitled; If UNOWNED, You May Buy it From the Bank", (player) => { 
                if ((0 <= player.currentSquare && player.currentSquare < 5) || player.currentSquare > 35) {
                    // reading railroad
                    logMessage(`${player.name} has advanced to Reading Railroad through Chance.`);
                    player.advanceTo(5);
                } else if (5 <= player.currentSquare && player.currentSquare < 15) {
                    // pennsylvania railroad
                    logMessage(`${player.name} has advanced to Pennsylvania Railroad through Chance.`);
                    player.advanceTo(15);
                } else if (15 <= player.currentSquare && player.currentSquare < 25) {
                    // B. & O. railroad
                    logMessage(`${player.name} has advanced to B. & O. through Chance.`);
                    player.advanceTo(25);
                } else if (25 <= player.currentSquare && player.currentSquare < 35) {
                    // short line
                    logMessage(`${player.name} has advanced to B. & O. through Chance.`);
                    player.advanceTo(35);
                }

                player.tryPayRentFactor(2);
            }),
            new ChanceDraw("Advance to the Nearest Utility", "If OWNED, Roll the Dice and Pay the Owner Ten Times the Amount Thrown; If UNOWNED, You May Buy it From the Bank", (player) => {
                if ((0 <= player.currentSquare && player.currentSquare < 12) || player.currentSquare > 28) {
                    // electric company
                    logMessage(`${player.name} has advanced to Electric Company through Chance.`);
                    player.advanceTo(12);
                } else {
                    // water works
                    logMessage(`${player.name} has advanced to Water Works through Chance.`);
                    player.advanceTo(28);
                }

                let amount = rollDice() * 10;
                player.tryPayRentAmount(amount);
            }),
            new ChanceDraw("Go Back 3 Spaces", "", (player) => {
                player.currentSquare -= 3;
                logMessage(`${player.name} has gone back to ${monopolyGame.squares[player.currentSquare].name} through Chance.`);
                this.takePlayerAction();
            }),
            new ChanceDraw("From Bank Dividend", "Collect 50¢", (player) => { 
                player.deposit(50);
                logMessage(`${player.name} has collected 50¢ in Bank Dividends through Chance.`);
            }),
            new ChanceDraw("Your Building and Loan Maturues", "Collect 150¢", (player) => { 
                player.deposit(150);
                logMessage(`${player.name} has collected 150¢ in Building and Loan Maturation through Chance.`);
            }),
            new ChanceDraw("Settle Poor Tax", "Pay 15¢", (player) => { 
                logMessage(`${player.name} must settle 15¢ in Poor Tax through Chance.`);
                player.withdraw(15);
            }),
            new ChanceDraw("You Have Been Elected Chairperson of the Board", "Pay Each Player 50¢", (player) => {
                let total = (this.players.length - 1) * 50;
                logMessage(`${player.name} must settle ${total}¢ in fees as the new Chairperson through Chance.`);
                
                for (let other of this.players) {
                    if (other !== player) {
                        player.withdraw(50);
                        other.deposit(50);
                    }
                }
            }),
            new ChanceDraw("Make General Repairs on All Your Property", "Pay 25¢ per House, 100¢ per Hotel", (player) => {
                let balance = 0;
                
                for (let square of this.squares) {
                    if ('owned' in square) {
                        if (square.owned === player.turn) {
                            switch (square.improvementState) {
                                case 1: balance += 25;
                                case 2: balance += 50;
                                case 3: balance += 75;
                                case 4: balance += 100;
                                case 5: balance += 100;
                            }
                        }
                    }
                }

                logMessage(`${player.name} must settle ${balance}¢ in General Property Repairs through Chance.`);
                player.withdraw(balance);
            }),
            new ChanceDraw("Go Directly To Jail", "Do Not Pass GO; Do Not Collect 200¢", (player) => { 
                logMessage(`${player.name} has been sent To Jail through Chance.`);
                player.goToJail();
            }),
            new ChanceDraw("Get Out of Jail Free", "This Card May Be Kept Until Needed, Or Sold", (player) => {
                logMessage(`${player.name} has won a Get Out of Jail Free Card through Chance.`);
                player.bailCards++;
            }),
        ];

        this.communityChestCards = [
            new CommunityChestDraw("Advance to GO", "Collect 200¢", (player) => {
                player.advanceTo(0);
                logMessage(`${player.name} has advanced to GO through the Community Chest.`);
            }),
            new CommunityChestDraw("Life Insurance Matures", "Collect 100¢", (player) => { 
                player.deposit(100);
                logMessage(`${player.name} has collected 100¢ in Life Insurance Maturation though the Community Chest.`);
            }),
            new CommunityChestDraw("You Have Won Second Prize in a Beauty Contest", "Collect 10¢", (player) => {
                player.deposit(100);
                logMessage(`${player.name} has collected 10¢ in Beauty Prize Winnings though the Community Chest.`);
            }),
            new CommunityChestDraw("Bank Error in Your Favor", "Collect 200¢", (player) => {
                player.deposit(100);
                logMessage(`${player.name} has collected 100¢ in a favorable Bank Error through the Community Chest.`);
            }),
            new CommunityChestDraw("From Sale of Stock", "Collect 45¢", (player) => {
                player.deposit(45);
                logMessage(`${player.name} has collected 45¢ in Stock Sales through the Community Chest.`);
            }),
            new CommunityChestDraw("Income Tax Refund", "Collect 20¢", (player) => {
                player.deposit(20);
                logMessage(`${player.name} has collected 20¢ in an Income Tax Refund through the Community Chest.`);
            }),
            new CommunityChestDraw("For Your Services", "Collect 25¢", (player) => {
                player.deposit(25);
                logMessage(`${player.name} has collected 25¢ for His/Her Services through the Community Chest.`);
            }),
            new CommunityChestDraw("From Your Inheritance", "Collect 100¢", (player) => {
                player.deposit(100);
                logMessage(`${player.name} has collected 100¢ in Inheritance through the Community Chest`);
            }),
            new CommunityChestDraw("Xmas Fund Matures", "Collect 100¢", (player) => {
                player.deposit(100);
                logMessage(`${player.name} has collected 100¢ in Xmas Fund Maturation through the Community Chest.`);
            }),
            new CommunityChestDraw("Grand Opera Opening", "Collect 50¢ From Every Player", (player) => {
                let amount = (this.players.length - 1) * 50;
                logMessage(`${player.name} is due to collect ${amount}¢ in Opera Admission Fees through the Community Chest.`);
                
                for (let other of this.players) {
                    if (other !== player) {
                        other.withdraw(50);
                        player.deposit(50);
                    }
                }
            }),
            new CommunityChestDraw("Doctor's Fee", "Pay 50¢", (player) => {
                logMessage(`${player.name} must settle 100¢ in Doctor's Fees through the Community Chest.`);
                player.withdraw(50);
            }),
            new CommunityChestDraw("Hospital Fee", "Pay 100¢", (player) => {
                logMessage(`${player.name} must settle 100¢ in Hospital Fees through the Community Chest.`);
                player.withdraw(100);
            }),
            new CommunityChestDraw("School Tax", "Pay 150¢", (player) => {
                logMessage(`${player.name} must settle 150¢ in School Tax through the Community Chest.`);
                player.withdraw(150);
            }),
            new CommunityChestDraw("You Are Assessed for Street Repairs", "Pay 40¢ per House, 115¢ per Hotel", (player) => {
                let balance = 0;
                
                for (let square of this.squares) {
                    if ('owned' in square) {
                        if (square.owned === player.turn) {
                            switch (square.improvementState) {
                                case 1: balance += 40;
                                case 2: balance += 80;
                                case 3: balance += 120;
                                case 4: balance += 160;
                                case 5: balance += 115;
                            }
                        }
                    }
                }

                logMessage(`${player.name} must settle ${balance}¢ in Street Repairs through the Community Chest.`);
                player.withdraw(balance);
            }),
            new CommunityChestDraw("Go To Jail", "Go Directly to Jail; Do Not Pass GO; Do Not Collect 200¢", (player) => { 
                logMessage(`${player.name} has been sent To Jail through the Community Chest.`);
                player.goToJail();
            }),
            new CommunityChestDraw("Get Out of Jail Free", "This Card May Be Kept Until Needed, Or Sold", (player) => { 
                logMessage(`${player.name} has won a Get Out of Jail Free Card through the Community Chest.`);
                player.bailCards++;
            }),
        ];

        this.squares = [
            // bottom edge
            new CornerSquare(0, "GO", "Collect 200&cent; as you pass"),
            new ColorProperty(1, "Mediterranean Avenue", 0, 60, 30, 2, 10, 30, 90, 160, 250, 50),
            new CommunityChestSquare(2),
            new ColorProperty(3, "Baltic Avenue", 0, 60, 30, 4, 20, 60, 180, 320, 450, 50),
            //new TaxSquare(4, "Income Tax", 200, "&loz;"),
            new TaxSquare(4, "Income Tax", 200, `<img src="income.svg" width="30">`),
            new RailroadProperty(5, "Reading Railroad", 200, 100),
            new ColorProperty(6, "Oriental Avenue", 1, 100, 50, 6, 30, 90, 270, 400, 550, 50),
            new ChanceSquare(7),
            new ColorProperty(8, "Vermont Avenue", 1, 100, 50, 6, 30, 90, 270, 400, 550, 50),
            new ColorProperty(9, "Connecticut Avenue", 1, 120, 60, 8, 40, 100, 300, 450, 600, 50),
            new CornerSquare(10, "In Jail", "Just Visiting"),

            // left edge
            new ColorProperty(11, "St. Charles Place", 2, 140, 70, 10, 50, 150, 450, 625, 750, 100),
            new UtilityProperty(12, "Electric Company", 150, 75, "&#x1F4A1;"),
            new ColorProperty(13, "States Avenue", 2, 140, 70, 10, 50, 150, 450, 625, 750, 100),
            new ColorProperty(14, "Virginia Avenue", 2, 160, 80, 12, 60, 180, 500, 700, 900, 100),
            new RailroadProperty(15, "Pennsylvania Railroad", 200, 100),
            new ColorProperty(16, "St. James Place", 3, 180, 90, 14, 70, 200, 550, 750, 950, 100),
            new CommunityChestSquare(17),
            new ColorProperty(18, "Tennessee Avenue", 3, 180, 90, 14, 70, 200, 550, 750, 950, 100),
            new ColorProperty(19, "New York Avenue", 3, 200, 100, 16, 80, 220, 600, 800, 1000, 100),
        
            // top edge
            new CornerSquare(20, "Free Parking", "&#x1F697;"),
            new ColorProperty(21, "Kentucky Avenue", 4, 220, 110, 18, 90, 250, 700, 875, 1050, 150),
            new ChanceSquare(22),
            new ColorProperty(23, "Indiana Avenue", 4, 220, 110, 18, 90, 250, 700, 875, 1050, 150),
            new ColorProperty(24, "Illinois Avenue", 4, 240, 120, 20, 100, 300, 750, 925, 1100, 150),
            new RailroadProperty(25, "B. & O. Railroad", 200, 100),
            new ColorProperty(26, "Atlantic Avenue", 5, 260, 130, 22, 110, 330, 800, 975, 1150, 150),
            new ColorProperty(27, "Ventnor Avenue", 5, 260, 130, 22, 110, 330, 800, 975, 1150, 150),
            new UtilityProperty(28, "Water Works", 150, 75, "&#x1F6B0;"),
            new ColorProperty(29, "Marvin Gardens", 5, 280, 140, 24, 120, 360, 850, 1025, 1200, 150),
            new CornerSquare(30, "Go To Jail", "&#x1F6A8;"),

            // right edge
            new ColorProperty(31, "Pacific Avenue", 6, 300, 150, 26, 130, 390, 900, 1100, 1275, 200),
            new ColorProperty(32, "North Carolina Avenue", 6, 300, 150, 26, 130, 390, 900, 1100, 1275, 200),
            new CommunityChestSquare(33),
            new ColorProperty(34, "Pennsylvania Avenue", 6, 320, 160, 28, 150, 450, 1000, 1200, 1400, 200),
            new RailroadProperty(35, "Short Line", 200, 100),
            new ChanceSquare(36),
            new ColorProperty(37, "Park Place", 7, 350, 175, 35, 175, 500, 1100, 1300, 1500, 200),
            new TaxSquare(38, "Luxury Tax", 100, "&#x1F48D;"),
            new ColorProperty(39, "Boardwalk", 7, 400, 200, 50, 200, 600, 1400, 1700, 2000, 200),
        ];
    }

    repositionPlayers() {
        for (let square of this.squaresMarkup) {
            square.removeAttribute('players');
        }

        for (let player of monopolyGame.players) {
            if (!player.isBankrupt) {
                let current = this.squaresMarkup[player.currentSquare].getAttribute('players');
                current = (current == null ? '' : current);
                this.squaresMarkup[player.currentSquare].setAttribute('players', current + `,${player.turn + 1}`);
            }
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
        auctionturnContainer.innerHTML = '';

        for (let player of this.players) {
            markupTurnBalances(player);
            markupAuctionPlayers(player);
        }

        this.resetCurrentTurn();
    }

    rebuildTitleDeeds() {
        let player = this.players[this.currentTurn];
        
        assetContainer.innerHTML = '';

        for (let square of this.squares) {
            if (square.owned == player.turn) {
                assetContainer.insertAdjacentHTML("beforeend", this.generateTitleDeed(square));
            }
        }
    }

    generateTitleDeed(square) {
        let isMortgaged = square.improvementState === -1;

        switch (square.constructor) {
            case RailroadProperty: return `<railroad-deed name="${square.name}" mortgaged="${isMortgaged}"></railroad-deed>`;
            case UtilityProperty: return `<utility-deed name="${square.name.toUpperCase()}" icon="${square.icon}" mortgaged="${isMortgaged}"></utility-deed>`; 
            case ColorProperty: return `<title-deed name="${square.name}" rent0="${square.rent0}" rent1="${square.rent1}" rent2="${square.rent2}" rent3="${square.rent3}" rent4="${square.rent4}" rent5="${square.rent5}" mortval="${square.mortgageValue}" devcost="${square.improvementCost}" mortgaged="${isMortgaged}" color="${propertyColors[square.color]}"></title-deed>`;
            default: return '';
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

            case GoToJailSquare: {
                player.goToJail();
            } break;

            case CommunityChestSquare: {
                let cardIndex = getRandomInt(0, this.communityChestCards.length - 1);
                let card = this.communityChestCards[cardIndex];
                promptCommunityChestCard(card);
            } break;

            case ChanceSquare: {
                let cardIndex = getRandomInt(0, this.chanceCards.length - 1);
                let card = this.chanceCards[cardIndex];
                promptChanceCard(card);
            } break;
        }

    }

    nextTurn() {
        do {
            this.currentTurn = (this.currentTurn + 1) % this.players.length;
        } while (this.players[this.currentTurn].isBankrupt);

        this.resetCurrentTurn();
    }

    bankrupt(player, toWhom) {
        // TODO: remove player from active pools everywhere and cede improvements to the bank and acution the rest of the properties
        player.isBankrupt = true;
        turnContainer.children[player.turn].classList.toggle('withdrawn', true);

        this.nextTurn();
        logMessage(`${player.name} has gone bankrupt to ${toWhom}; it's now ${this.players[this.currentTurn].name}'s turn to roll.`);
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

function rollDice() {
    let die1 = getRandomInt(1, 6);
    let die2 = getRandomInt(1, 6);
    return [die1, die2];
}

class Player {
    constructor(name, color, turn) {
        this.name = name;
        this.color = color;
        this.turn = turn;
        this.money = 1500;
        this.bailCards = 0;
        this.inJail = false;
        this.jailAttemptsRemaining = 0;
        this.currentSquare = 0; // start on GO
        this.isBankrupt = false;
        this.consecutiveDoubles = 0;
    }

    advanceTo(square) {
        if (square < this.currentSquare) {
            this.collectGO();
        }

        this.currentSquare = square;
    }

    collectGO() {
        this.deposit(200);
        logMessage(`${this.name} has collected 200¢ allowance from GO.`);
    }

    goToJail() {
        this.currentSquare = 10;
        this.inJail = true;
        this.jailAttemptsRemaining = 3;
        this.consecutiveDoubles = 0;
        logMessage(`${this.name} has been sent to Jail.`);
        promptGoToJail();
    }

    roll(existingSum = null) {
        let doubles = false;

        if (existingSum == null) {
            disableRoll();
            enableEndTurn();

            let [die1, die2] = rollDice();
            let sum = die1 + die2;

            monopolyGame.lastDice = sum;

            doubles = die1 === die2;
            if (doubles) {
                this.consecutiveDoubles++;

                if (this.consecutiveDoubles === 3) {
                    this.goToJail();
                    return;
                }
            } else {
                this.consecutiveDoubles = 0;
            }
        } else {
            monopolyGame.lastDice = existingSum;
            doubles = true;
        }
        
        let doublesString = doubles ? '(doubles) ' : '';

        let targetSquare = (this.currentSquare + monopolyGame.lastDice) % monopolyGame.squares.length;
        logMessage(`${this.name} rolled ${monopolyGame.lastDice} ${doublesString}and landed on ${monopolyGame.squares[targetSquare].name}.`);

        if (targetSquare < this.currentSquare) {
            this.collectGO();
        }

        monopolyGame.unhighlightAll();
        for (let i = this.currentSquare; i < this.currentSquare + monopolyGame.lastDice; i++) {
            monopolyGame.squaresMarkup[i % monopolyGame.squaresMarkup.length].setAttribute('highlighted', '');
        }

        monopolyGame.squaresMarkup[targetSquare].removeAttribute('highlighted');
        monopolyGame.squaresMarkup[targetSquare].setAttribute('targeted', '');

        this.currentSquare = targetSquare;

        monopolyGame.takePlayerAction(monopolyGame.lastDice);

        // TODO: animate
    }

    trade() {
        tradePlayers.children[this.turn].setAttribute("disabled", true);

        tradeRequestorDialog.showModal();

        for (let child of tradePlayers.children) {
            child.removeAttribute("disabled");
        }
    }

    deposit(amount) {
        this.money += amount;
        monopolyGame.rebuildTurnBalances();
        monopolyGame.rebuildPlayerAccounts();
    }

    canWithdraw(amount) {
        return this.money >= amount;
    }

    withdraw(amount) {
        if (this.canWithdraw(amount)) {
            this.money -= amount;
            monopolyGame.rebuildTurnBalances();
            monopolyGame.rebuildPlayerAccounts();
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

    buy(square, costOverride) {
        let cost = costOverride ?? square.cost;

        if (this.money >= cost) {
            this.withdraw(cost);
            square.owned = this.turn;
            monopolyGame.squaresMarkup[square.square].setAttribute('owned', this.turn);
            monopolyGame.rebuildTitleDeeds();
            return true;
        }

        return false;
    }

    transferOwnership(square, toWhom) {
        square.owned = toWhom.turn;
        monopolyGame.squaresMarkup[square.square].setAttribute('owned', toWhom.turn);
        monopolyGame.rebuildTitleDeeds();
    }

    tryPayRentFactor(factor = 1) {
        let square = monopolyGame.squares[this.currentSquare];
        let amount = square.currentRent() * factor;
        this.tryPayRentAmount(amount);
    }

    tryPayRentAmount(amount) {
        let square = monopolyGame.squares[this.currentSquare];
        let owner = square.owned;

        if (owner != null) {
            promptRent(amount);
        } else {
            promptBuy(square);
        }
    }

    payRent(toWhom, amount) {
        if (this.money >= amount) {
            this.withdraw(amount);
            monopolyGame.players[toWhom].deposit(amount);
            return true;
        }

        return false;
    }

    endTurn() {
        monopolyGame.unhighlightAll();
        monopolyGame.repositionPlayers();
        monopolyGame.nextTurn();
        monopolyGame.rebuildTitleDeeds();

        enableRoll();
        disableEndTurn();

        if (monopolyGame.players[monopolyGame.currentTurn].inJail) {
            promptJail();
        }
    }

    computeAssets() {
        let sum = 0;

        // getting out of jail costs $50, so each card is "worth" this much
        sum += (this.bailCards * 50);

        for (let square of monopolyGame.squares) {
            if (square.owned === this.turn) {
                sum += square.cost;
            }
        }

        sum += this.money;

        return sum;
    }

    computeLiabilities() {
        let sum = 0;

        for (let square of monopolyGame.squares) {
            if (square.owned === this.turn) {
                if (square.improvementState === -1) {
                    // mortgage value + interest (10%)
                    sum += (square.mortgageValue * 1.1);
                }
            }
        }

        return sum;
    }

    computeNetWorth() {
        return this.computeAssets() - this.computeLiabilities();
    }
}

function markupExistingPlayers(player) {
    existingPlayers.insertAdjacentHTML("beforeend", `
        <tr>
            <td>${player.name}</td>
            <td>${player.color}</td>
            <td>${player.turn + 1}</td>
        </tr>
    `);
}

function playerTurnCode(player, classes) {
    return `
    <div class="${classes}">
        <div class="player-color">
            <div class="circle" style="background: ${player.color}"></div>
            <p>${player.name}</p>
        </div>
        
        <b>${player.money}&cent;</b>
    </div>
    `;
}

function markupTurnBalances(player) {
    turnContainer.insertAdjacentHTML("beforeend", playerTurnCode(player, "turn"));
}

function markupAuctionPlayers(player) {
    auctionturnContainer.insertAdjacentHTML("beforeend", playerTurnCode(player, "turn auction-turn"));
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
    markupExistingPlayers(player);
    markupTurnBalances(player);
    markupAuctionPlayers(player);
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

    for (let player of monopolyGame.players) {
        tradePlayers.insertAdjacentHTML("beforeend", `
            <option>${player.name}</option>
        `);
    }

    logMessage(`Welcome to Monopoly! It's ${monopolyGame.players[0].name}'s turn to roll.`);
}

