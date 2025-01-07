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
    rentOwed.textContent = amount + "&cent;";

    let insufficient = amount > currentPlayer().money;
    rentDialog.classList.toggle('insufficient', insufficient);

    payrentButton.toggleAttribute('disabled', insufficient);
    raisecapitalButton.toggleAttribute('disabled', !insufficient);
    declarebankruptcyButton.toggleAttribute('disabled', !insufficient);

    rentDialog.showModal();
}


const bankruptcyDialog = document.getElementById("bankruptcy-dialog");
const bankruptcyTarget = document.getElementById("bankruptcy-target");


function payRent() {
    // TODO:
}

function raiseCapital() {
    // TODO:
}

function declareBankruptcy(player) {
    let currentPlayer = monopolyGame.players[monopolyGame.currentTurn];

    promptBankruptcy(player);
}


function promptBankruptcy(player) {
    bankruptcyDialog.textContent = player.name;
    bankruptcyDialog.showModal();
}

function confirmBankruptcy() {
    // TODO:
}

function rejectBankruptcy() {
    bankruptcyDialog.close();
}


const buyDialog = document.getElementById("buy-dialog");
const buyTarget = document.getElementById("buy-target");
const buynowButton = document.getElementById("buynow-button");
const auctionButton = document.getElementById("auction-button")



function promptBuy(property) {
    buyTarget.textContent = property.name;
    buyDialog.showModal();
}

function buyNow() {

}

function auctionOff() {
    
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

