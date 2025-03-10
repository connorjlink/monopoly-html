const navLinks = document.getElementById("navbar");
const tabContents = document.getElementById("game");
const assetContainer = document.getElementById("asset-container");

function showTab(index) {
    var links = navLinks.children;
    var tabs = tabContents.children;

    for (let i = 0; i < links.length; i++) {
        links[i].classList.toggle("active-tab", i === index);
        tabs[i].classList.toggle("hidden", i !== index);
    }
}

for (let i = 0; i < navbar.childElementCount; i++) {
    navLinks.children[i].addEventListener('click', () => {
        showTab(i);
    });
}   

function currentPlayer() {
    return monopolyGame.players[monopolyGame.currentTurn];
}

const newgameDialog = document.getElementById("newgame-dialog");
newgameDialog.showModal();


const rentDialog = document.getElementById("rent-dialog");
const rentOwed = document.getElementById("rent-owed");
const payrentButton = document.getElementById("payrent-button");
const raisecapitalButton = document.getElementById("raisecapital-button");
const declarebankruptcyButton = document.getElementById("declarebankruptcy-button");

function promptRent(amount) {
    rentOwed.textContent = amount + "¢";

    let insufficient = (amount > currentPlayer().money);
    rentOwed.classList.toggle('insufficient', insufficient);

    payrentButton.toggleAttribute('disabled', insufficient);
    raisecapitalButton.toggleAttribute('disabled', !insufficient);
    declarebankruptcyButton.toggleAttribute('disabled', !insufficient);

    rentDialog.showModal();
}

function payRent() {
    let player = currentPlayer();
    let square = monopolyGame.squares[player.currentSquare];
    let owner = square.owned;
    let amount = square.currentRent();

    let success = player.payRent(owner, amount);

    if (success) {
        logMessage(`${player.name} has paid ${square.currentRent()}¢ in rent to ${monopolyGame.players[owner].name}.`);
        rentDialog.close();
    } else {
        promptInsufficientFunds();
    }
}


const bankruptcyDialog = document.getElementById("bankruptcy-dialog");
const bankruptcyTarget = document.getElementById("bankruptcy-target");

var bankruptcyTargetPlayer = null;

function promptBankruptcy(toWhom) {
    if (toWhom != null) {
        bankruptcyTarget.textContent = toWhom.name;
    } else {
        bankruptcyTarget.textContent = "the Bank";
    }

    bankruptcyDialog.showModal();
}

function confirmBankruptcy() {
    monopolyGame.bankrupt(currentPlayer(), bankruptcyTarget.textContent);

    let bankruptPlayersCount = countWithdrawnPlayers(turnContainer.children);

    if (bankruptPlayersCount === monopolyGame.players.length - 1) {
        // there remains only 1 player
        for (let i = 0; i < turnContainer.childElementCount; i++) {
            let child = turnContainer.children[i];

            if (!child.classList.contains('withdrawn')) {
                promptWin(monopolyGame.players[i].name);
            }
        }
    }

    bankruptcyDialog.close();
}

function rejectBankruptcy() {
    bankruptcyDialog.close();
}


const buyDialog = document.getElementById("buy-dialog");
const buyTarget = document.getElementsByClassName("buy-target");
const buynowButton = document.getElementById("buynow-button");
const auctionButton = document.getElementById("auction-button");

var buyTargetSquare = null;

function promptBuy(square) {
    buyTargetSquare = square;

    for (let target of buyTarget) {
        target.textContent = square.name;
    }

    buyDialog.showModal();
}

function buyNow() {
    promptConfirmBuy(buyTargetSquare);
}

function auctionOff() {
    promptAuction();
}


const buyconfirmDialog = document.getElementById("buyconfirm-dialog");

function promptConfirmBuy(square) {
    buyconfirmDialog.showModal();
}

function confirmBuy() {
    let player = currentPlayer();
    let success = player.buy(buyTargetSquare);

    if (success) {
        buyconfirmDialog.close();
        buyDialog.close();
        logMessage(`${player.name} has purchased ${buyTargetSquare.name}.`);
    } else {
        promptInsufficientFunds();
    }
}

function rejectBuy() {
    buyconfirmDialog.close();
}


// auction screen
const auctionDialog = document.getElementById("auction-dialog");
const auctionturnContainer = document.getElementById("auctionturn-container");
const auctionTurns = document.getElementsByClassName("auction-turn");
const auctionLog = document.getElementById("auction-log");
const highBid = document.getElementsByClassName("high-bid");
const bid1Button = document.getElementById("bid1-button");
const bid10Button = document.getElementById("bid10-button");
const bid100Button = document.getElementById("bid100-button");

var currentAuctionTurn = null;
var currentHighBid = null;

function logMessageAuction(message) {
    auctionLog.textContent = auctionLog.textContent + message + '\n';
    logMessage(message);
}

function auctionOff() {
    auctionLog.textContent = '';
    promptAuction();
}

function promptAuction() {
    currentHighBid = 0;
    currentAuctionTurn = monopolyGame.currentTurn;

    buyTargetSquare = monopolyGame.players[monopolyGame.currentTurn].currentSquare;

    setAuctionTurn();
    logMessageAuction(`${monopolyGame.squares[buyTargetSquare].name} is up for auction; bidding will open at 0¢ with ${monopolyGame.players[monopolyGame.currentTurn].name}.`);
    auctionDialog.showModal();
}

function setAuctionTurn() {
    for (let turn of auctionTurns) {
        turn.classList.toggle("active", false);
    }

    auctionTurns[currentAuctionTurn].classList.toggle("active", true);

    let currentPlayer = monopolyGame.players[currentAuctionTurn];
    
    bid1Button.toggleAttribute('disabled', currentPlayer.money < currentHighBid + 1);
    bid10Button.toggleAttribute('disabled', currentPlayer.money < currentHighBid + 10);
    bid100Button.toggleAttribute('disabled', currentPlayer.money < currentHighBid + 100);
}

function nextBidder() {
    currentAuctionTurn = (currentAuctionTurn + 1) % auctionTurns.length;
}

function logBid() {
    let player = monopolyGame.players[currentAuctionTurn];
    logMessageAuction(`${player.name} has bid ${currentHighBid}¢.`);

    for (let element of highBid) {
        element.textContent = `${currentHighBid}¢`;
    }

    do {
        nextBidder();
    } while (auctionTurns[currentAuctionTurn].classList.contains('withdrawn'));

    setAuctionTurn();
}

function bid1() {
    currentHighBid = currentHighBid + 1;
    logBid();
}

function bid10() {
    currentHighBid = currentHighBid + 10;
    logBid();
}

function bid100() {
    currentHighBid = currentHighBid + 100;
    logBid();
}

function countWithdrawnPlayers(container) {
    let withdrawnCount = 0;

    for (let player of container) {
        if (player.classList.contains('withdrawn')) {
            withdrawnCount++;
        }
    }

    return withdrawnCount;
}

function withdraw() {
    auctionTurns[currentAuctionTurn].classList.toggle('withdrawn', true);
    logMessageAuction(`${monopolyGame.players[currentAuctionTurn].name} has withdrawn from the auction.`);
    nextBidder();
    setAuctionTurn();

    let withdrawnCount = countWithdrawnPlayers(auctionTurns);    

    if (withdrawnCount === auctionTurns.length - 1) {
        // there remains only 1 player
        let player = monopolyGame.players[currentAuctionTurn];
        let square = monopolyGame.squares[buyTargetSquare];
        player.buy(square, currentHighBid);

        promptCongrats(player.name, square.name, currentHighBid);
        logMessageAuction(`${player.name} has won ${square.name} for ${currentHighBid}¢.`);
        auctionDialog.close();
        buyDialog.close();
    }
}


// insufficient funds screen
const insufficientfundsDialog = document.getElementById("insufficientfunds-dialog");

function promptInsufficientFunds() {
    // TODO: show the funds shortage value
    insufficientfundsDialog.showModal();
}

function confirmAccept() {
    insufficientfundsDialog.close();
}


// auction win screen
const auctioncongratsDialog = document.getElementById("auctioncongrats-dialog");
const auctionWinner = document.getElementById("auction-winner");

function promptCongrats(name, square, topBid) {
    auctionWinner.textContent = name;
    
    for (let bid of highBid) {
        bid.textContent = topBid;
    }

    auctioncongratsDialog.showModal();
}

function acceptCongrats() {
    auctioncongratsDialog.close();
}


// game win screen
const wincongratsDialog = document.getElementById("wincongrats-dialog");
const gameWinner = document.getElementById("game-winner");

function promptWin(name) {
    gameWinner.textContent = name;
    logMessage(`${name} is the last player remaining and has won the game.`);
    wincongratsDialog.showModal();
}


// trade requestor screen
const tradeRequestorDialog = document.getElementById("traderequestor-dialog");
const tradePlayers = document.getElementById("trade-players");

var requestee = null;
var requestor = null;

var givePropertiesList = [];
var wantPropertiesList = [];

function submitTradeRequest() {
    requestee = monopolyGame.players[tradePlayers.selectedIndex];
    requestor = currentPlayer();

    for (let element of tradeRequestee) {
        element.textContent = requestee.name;
    }

    for (let element of tradeRequestor) {
        element.textContent = requestor.name;
    }

    logMessage(`${requestor.name} has requested to trade with ${requestee.name}.`);
    tradeRequestorDialog.close();
    tradeRequestDialog.showModal();
}


// trade request screen
const tradeRequestDialog = document.getElementById("traderequest-dialog");
const tradeRequestee = document.getElementsByClassName("trade-requestee");
const tradeRequestor = document.getElementsByClassName("trade-requestor");

function acceptTradeRequest() {
    logMessage(`${requestee.name} has agreed to trade with ${requestor.name}.`);
    tradeRequestDialog.close();

    giveCash.textContent = '';
    wantCash.textContent = '';

    giveProperties.innerHTML = '';
    wantProperties.innerHTML = '';

    for (let square of monopolyGame.squares) {
        if ('owned' in square) {
            if (square.owned == requestor.turn) {
                givePropertiesList.push(square.square);

                giveProperties.insertAdjacentHTML("beforeend", `
                    <option>${square.name}</option>
                `);
            } else if (square.owned == requestee.turn) {
                wantPropertiesList.push(square.square);

                wantProperties.insertAdjacentHTML("beforeend", `
                    <option>${square.name}</option>
                `);
            }
        }
    }

    giveCards.innerHTML = '';
    wantCards.innerHTML = '';

    for (let i = 0; i < requestor.bailCards; i++) {
        giveCards.insertAdjacentHTML("beforeend", `
            <option>Get Out of Jail Free Card</option>
        `);
    }

    for (let i = 0; i < requestee.bailCards; i++) {
        wantCards.insertAdjacentHTML("beforeend", `
            <option>Get Out of Jail Free Card</option>
        `);
    }

    tradeDialog.showModal();
}


// trade screen
const tradeDialog = document.getElementById("trade-dialog");
const giveCash = document.getElementById("give-cash");
const giveProperties = document.getElementById("give-properties");
const giveCards = document.getElementById("give-cards");
const wantCash = document.getElementById("want-cash");
const wantProperties = document.getElementById("want-properties");
const wantCards = document.getElementById("want-cards");

function copySelected(from, to) {
    for (let option of from.selectedOptions) {
        to.children[option.index].toggleAttribute('selected', true);
    }

    // for (let i = 0; i < from.childElementCount; i++) {
    //     let isSelected = from.children[i].hasAttribute('selected');
    //     to.children[i].toggleAttribute('selected', isSelected);
    // }
}

function makeTradeOffer() {
    getCash.value = giveCash.value || 0;
    getProperties.innerHTML = giveProperties.innerHTML;
    copySelected(giveProperties, getProperties);
    getCards.selectedOptions = giveCards.selectedOptions;
    copySelected(giveCards, getCards);

    cedeCash.value = wantCash.value || 0;
    cedeProperties.innerHTML = wantProperties.innerHTML;
    copySelected(wantProperties, cedeProperties);
    cedeCards.innerHTML = wantCards.innerHTML;
    copySelected(wantCards, cedeCards);

    tradeOfferDialog.showModal();
}


// trade offer screen 
const tradeOfferDialog = document.getElementById("tradeoffer-dialog");
const getCash = document.getElementById("get-cash");
const getProperties = document.getElementById("get-properties");
const getCards = document.getElementById("get-cards");
const cedeCash = document.getElementById("cede-cash");
const cedeProperties = document.getElementById("cede-properties");
const cedeCards = document.getElementById("cede-cards");

function endTrade(reason) {
    tradeOfferDialog.close();
    tradeDialog.close();
    logMessage(reason);
}

function acceptTradeOffer() {
    let giveCashValue = parseInt(giveCash.value);
    let wantCashValue = parseInt(wantCash.value);
    
    if (requestor.withdraw(giveCashValue)) {
        requestee.deposit(giveCashValue);
    } else {
        promptInsufficientFunds();
        endTrade(`${requestor.name} has insufficient funds to complete the trade.`);
        return;
    }

    if (requestee.withdraw(wantCashValue)) {
        requestor.deposit(wantCashValue);
    } else {
        promptInsufficientFunds();
        endTrade(`${requestee.name} has insufficient funds to complete the trade.`);
        return;
    }

    // TODO: transfer ownership
    for (let child of giveProperties.selectedOptions) {
        for (let square of monopolyGame.squares) {
            if (child.value === square.name) {
                requestor.transferOwnership(square, requestee);
            }
        }
    }

    for (let child of wantProperties.selectedOptions) {
        for (let square of monopolyGame.squares) {
            if (child.value === square.name) {
                requestee.transferOwnership(square, requestor);
            }
        }
    }

    let giveCardsCount = giveCards.selectedOptions.length;
    let wantCardsCount = wantCards.selectedOptions.length;

    requestor.bailCards -= giveCardsCount;
    requestee.bailCards += giveCardsCount;
    
    requestor.bailCards += wantCardsCount;
    requestee.bailCards -= wantCardsCount;

    endTrade(`${requestee.name} has accepted ${requestor.name}'s trade offer.`);
}

function rejectTradeOffer() {
    endTrade(`${requestee.name} has rejected ${requestor.name}'s trade offer.`);
}


// draw screen
const drawDialog = document.getElementById("draw-dialog");
const drawType = document.getElementById("draw-type");
const drawTitle = document.getElementById("draw-title");
const drawText = document.getElementById("draw-text");

var currentCard = null;

function promptCard(card, type) {
    drawType.textContent = type;
    drawTitle.textContent = card.title;
    drawText.textContent = card.text;

    currentCard = card;
    drawDialog.showModal();
}

function promptCommunityChestCard(card) {
    promptCard(card, "Community Chest");
}

function promptChanceCard(card) {
    promptCard(card, "Chance");
}

function acceptDraw() {
    let player = currentPlayer();
    currentCard.functor(player);
    drawDialog.close();
}


// management screen
const managementDialog = document.getElementById("management-dialog");
const selectedProperty = document.getElementById("selected-property");
const improveProperty = document.getElementById("improve-property");
const demolishProperty = document.getElementById("demolish-property");

function promptPropertyManagement() {
    let player = currentPlayer();

    selectedProperty.innerHTML = '';

    for (let square of monopolyGame.squares) {
        if ('owned' in square) {
            if (square.owned == player.turn) {
                selectedProperty.insertAdjacentHTML("beforeend", `
                    <option>${square.name}</option>
                `);
            }
        }
    }

    selectedProperty.value = '';
    improveProperty.toggleAttribute('disabled', true);
    demolishProperty.toggleAttribute('disabled', true);
    managementDialog.showModal();
}

function updateManagementButtons(square) {
    switch (square.improvementState) {
        case -1: {
            improveProperty.textContent = 'Unmortgage';
            demolishProperty.textContent = 'Mortgage';
            demolishProperty.toggleAttribute('disabled', true);
        } break;

        case 0: {
            improveProperty.textContent = 'Improve';
            demolishProperty.textContent = 'Mortgage';
            demolishProperty.toggleAttribute('disabled', false);
        } break;

        default: {
            improveProperty.textContent = 'Improve';
            demolishProperty.textContent = 'Demolish';
            demolishProperty.toggleAttribute('disabled', false);
        } break;
    }
}

selectedProperty.addEventListener("change", () => {
    let value = selectedProperty.value;

    for (let square of monopolyGame.squares) {
        if (value === square.name) {
            updateManagementButtons(square);
        }
    }

    improveProperty.toggleAttribute('disabled', false);
    demolishProperty.toggleAttribute('disabled', false);
});

function manageSelectedProperty(isImprove) {
    let player = currentPlayer();
    let propertyName = selectedProperty.value;

    for (let square of monopolyGame.squares) {
        if (propertyName === square.name) {
            if (isImprove) {
                square.tryImprove(player, monopolyGame);
            } else {
                square.tryDemolish(player, monopolyGame);
            }

            updateManagementButtons(square);
        }
    }
}

function improveSelectedProperty() {
    manageSelectedProperty(true);
}

function demolishSelectedProperty() {
    manageSelectedProperty(false);
}


// jail screen
const jailDialog = document.getElementById("jail-dialog");
const jailTarget = document.getElementById("jail-target");
const jailUseCard = document.getElementById("jail-usecard");
const jailCardsRemaining = document.getElementById("jail-cardsremaining");
const jailPayBail = document.getElementById("jail-paybail");
const jailRollDice = document.getElementById("jail-rolldice");
const jailAttemptsRemaining = document.getElementById("jail-attemptsremaining");

function promptJail() {
    let player = currentPlayer();

    jailTarget.textContent = player.name;
    jailUseCard.toggleAttribute('disabled', player.bailCards == 0);
    jailCardsRemaining.textContent = player.bailCards;
    jailRollDice.toggleAttribute('disabled', player.jailAttemptsRemaining == 0);
    jailAttemptsRemaining.textContent = player.jailAttemptsRemaining;

    jailDialog.showModal();
}

function useBailCard() {
    let player = currentPlayer();
    player.bailCards--;
    player.inJail = false;
    logMessage(`${player.name} has used a Get Out of Jail Free card.`);
    jailDialog.close();
}

function payBail() {
    let player = currentPlayer();
    player.withdraw(50);
    player.inJail = false;
    logMessage(`${player.name} has paid 50¢ in bond to bail his/herself out of Jail.`);
    jailDialog.close();
}

function rollJailDice() {
    let player = currentPlayer();

    if (player.jailAttemptsRemaining === 0) {
        promptForceBail();
    } else {
        promptJailDice();
    }
}


// force bail screen
const forceBailDialog = document.getElementById("forcebail-dialog");

function promptForceBail() {
    forceBailDialog.showModal();
}

function payForceBail() {
    payBail();
    forceBailDialog.close();
}


// jail dice screen
const jailDiceDialog = document.getElementById("jaildice-dialog");
const jailDiceResult = document.getElementById("jaildice-result");
const jailDiceExplanation = document.getElementById("jaildice-explanation");

var lastTrySuccessful = false;
var lastResult = null;

function promptJailDice() {
    let [die1, die2] = rollDice();
    let doubles = die1 === die2;
    
    if (doubles) {
        lastTrySuccessful = true;
        lastResult = die1 + die2;
    } else {
        lastTrySuccessful = false;
    }

    jailDiceResult.textContent = doubles ? "Successful" : "Unsucessful";
    jailDiceExplanation.textContent = doubles ? `You have rolled doubles and have been freed from jail.` 
        : `You have failed to roll doubles and will remain in jail; next turn, you will have another opportunity to act.`;
    jailDiceDialog.showModal();
}

function acceptJailDice() {
    let player = currentPlayer();
    
    if (lastTrySuccessful) {
        player.inJail = false;
        player.roll(lastResult);
    } else {
        player.jailAttemptsRemaining--;
    }

    jailDiceDialog.close();
    jailDialog.close();
    currentPlayer().endTurn();
}


// go to jail screen
const goToJailDialog = document.getElementById("gotojail-dialog");

function promptGoToJail() {
    goToJailDialog.showModal();
}

function acceptGoToJail() {
    goToJailDialog.close();
    currentPlayer().endTurn();
}



function startGame() {
    newgameDialog.close();
    initializationSequence();
    // navigate to the board view
    showTab(0);
}


// -----------------------------------------------------------
// | Random hack in order to make multi-select elements work |
// -----------------------------------------------------------
// https://stackoverflow.com/questions/8641729/how-to-avoid-the-need-for-ctrl-click-in-a-multi-select-box-using-javascript
const multiSelectWithoutCtrl = ( elemSelector ) => {
    let options = document.querySelectorAll(`${elemSelector} option`);

    options.forEach(function (element) {
        element.addEventListener("mousedown", 
            function (e) {
                console.log("fired");
                e.preventDefault();
                element.parentElement.focus();
                this.selected = !this.selected;
                return false;
            }, false );
    });
}


// -----------------------------------------------------------------
// | All of the below is for the mouse hover effect on title deeds |
// -----------------------------------------------------------------

function transitionRotate(card) {
    card.style.transition = 'transform 250ms ease-out';

    setTimeout(() => {
        card.style.transition = 'none';
    }, 250);
}

const deeds = document.getElementsByClassName('deed');
let bounds;

function rotateToMouse(e, deed) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    const leftX = mouseX - bounds.x;
    const topY = mouseY - bounds.y;

    const center = {
        x: leftX - bounds.width / 2,
        y: topY - bounds.height / 2
    }

    const distance = Math.sqrt(center.x**2 + center.y**2);

    deed.style.transform = `
        rotate3d(
          ${-center.y / 100},
          ${center.x / 100},
          0,
          ${Math.log(distance) * 3}deg
        ) scale(1.05)
    `;
    
}

for (const card of deeds) {
    card.addEventListener('mouseenter', () => {
        bounds = card.getBoundingClientRect();

        // Add mousemove listener, passing both event and the card
        const onMouseMove = (e) => rotateToMouse(e, card);

        transitionRotate(card);
        document.addEventListener('mousemove', onMouseMove);

        // Remove listener on mouseleave
        card.addEventListener('mouseleave', () => {
            document.removeEventListener('mousemove', onMouseMove);
            card.style.transform = ''; // Reset transformation on mouse leave
            card.style.background = '';
            transitionRotate(card);
        }, { once: true }); // Ensure it runs only once per mouseleave
    });
}
