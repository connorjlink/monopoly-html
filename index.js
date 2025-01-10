function showBoard() {
    var items = document.getElementsByClassName("item");
    items[0].classList.toggle("active-tab", true);
    items[1].classList.toggle("active-tab", false);
    items[2].classList.toggle("active-tab", false);
    items[3].classList.toggle("active-tab", false);

    var elements = document.getElementsByClassName("tab");
    elements[0].classList.toggle("hidden", false);
    elements[1].classList.toggle("hidden", true);
    elements[2].classList.toggle("hidden", true);
    elements[3].classList.toggle("hidden", true);
}

function showAssets() {
    var items = document.getElementsByClassName("item");
    items[0].classList.toggle("active-tab", false);
    items[1].classList.toggle("active-tab", true);
    items[2].classList.toggle("active-tab", false);
    items[3].classList.toggle("active-tab", false);

    var elements = document.getElementsByClassName("tab");
    elements[0].classList.toggle("hidden", true);
    elements[1].classList.toggle("hidden", false);
    elements[2].classList.toggle("hidden", true);
    elements[3].classList.toggle("hidden", true);
}

function showBank() {
    var items = document.getElementsByClassName("item");
    items[0].classList.toggle("active-tab", false);
    items[1].classList.toggle("active-tab", false);
    items[2].classList.toggle("active-tab", true);
    items[3].classList.toggle("active-tab", false);

    var elements = document.getElementsByClassName("tab");
    elements[0].classList.toggle("hidden", true);
    elements[1].classList.toggle("hidden", true);
    elements[2].classList.toggle("hidden", false);
    elements[3].classList.toggle("hidden", true);
}

function showSettings() {
    var items = document.getElementsByClassName("item");
    items[0].classList.toggle("active-tab", false);
    items[1].classList.toggle("active-tab", false);
    items[2].classList.toggle("active-tab", false);
    items[3].classList.toggle("active-tab", true);

    var elements = document.getElementsByClassName("tab");
    elements[0].classList.toggle("hidden", true);
    elements[1].classList.toggle("hidden", true);
    elements[2].classList.toggle("hidden", true);
    elements[3].classList.toggle("hidden", false);
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
        rentDialog.close();
    } else {
        promptInsufficientFunds();
    }
}


const bankruptcyDialog = document.getElementById("bankruptcy-dialog");
const bankruptcyTarget = document.getElementById("bankruptcy-target");

var bankruptcyTargetPlayer = null;

function promptBankruptcy(toWhom) {
    bankruptcyTarget.textContent = toWhom.name;
    bankruptcyDialog.showModal();
}

function confirmBankruptcy() {
    // TODO:
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
    buyTarget[0].textContent = square.name;
    buyTarget[1].textContent = square.name;
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
const highBid = document.getElementById("high-bid");
const bid1Button = document.getElementById("bid1-button");
const bid10Button = document.getElementById("bid10-button");
const bid100Button = document.getElementById("bid100-button");

var currentAuctionTurn = null;
var currentHighBid = null;

function auctionOff() {
    promptAuction();
}

function promptAuction() {
    currentHighBid = 0;
    currentAuctionTurn = monopolyGame.currentTurn;

    setAuctionTurn();
    auctionDialog.showModal();
}

function setAuctionTurn() {
    for (let turn of auctionTurns) {
        turn.classList.toggle("active", false);
    }

    auctionTurns[currentAuctionTurn].classList.toggle("active", true);

    let currentPlayer = monopolyGame.players[currentAuctionTurn];
    
    bid1Button.setAttribute('disabled', currentPlayer.money < currentHighBid + 1);
    bid10Button.setAttribute('disabled', currentPlayer.money < currentHighBid + 10);
    bid100Button.setAttribute('disabled', currentPlayer.money < currentHighBid + 100);
}

function nextBidder() {
    currentAuctionTurn = (currentAuctionTurn + 1) % auctionTurns.length;
}

function logBid() {
    let player = monopolyGame.players[currentAuctionTurn];
    logMessage(`${player.name} has bid ${currentHighBid}`);

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

function withdraw() {

}


const insufficientfundsDialog = document.getElementById("insufficientfunds-dialog");

function promptInsufficientFunds() {
    // TODO: show the funds shortage value
    insufficientfundsDialog.showModal();
}

function confirmAccept() {
    insufficientfundsDialog.close();
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

// For asset 3d hover effect
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

