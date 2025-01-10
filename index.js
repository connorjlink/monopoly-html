const navLinks = document.getElementById("navbar");
const tabContents = document.getElementById("game");

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

    let success = player.payRent(square, owner);

    if (success) {
        logMessage(`${player.name} has paid ${square.currentRent()}¢ to ${monopolyGame.players[owner].name}.`);
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

    while (auctionTurns[currentAuctionTurn].classList.contains('withdrawn')) {
        nextBidder();
    }

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


const insufficientfundsDialog = document.getElementById("insufficientfunds-dialog");

function promptInsufficientFunds() {
    // TODO: show the funds shortage value
    insufficientfundsDialog.showModal();
}

function confirmAccept() {
    insufficientfundsDialog.close();
}


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


const wincongratsDialog = document.getElementById("wincongrats-dialog");
const gameWinner = document.getElementById("game-winner");

function promptWin(name) {
    gameWinner.textContent = name;
    logMessage(`${name} is the last player remaining and has won the game.`);
    wincongratsDialog.showModal();
}



const game = document.getElementById("game");
game.classList.toggle("hidden", true);

function startGame() {
    newgameDialog.close();
    initializationSequence();
    game.classList.toggle("hidden", false);
}

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

