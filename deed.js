function colorDeed(name, rent0, rent1, rent2, rent3, rent4, rent5, mortval, devcost, isMortgaged, color) {
    let mortgagedText = isMortgaged == "true" ? `
    <div class="mortgaged">
        <svg viewBox="0 0 10 10" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="10" y2="10" stroke="red" stroke-width="0.1"/>
            <line x1="10" y1="0" x2="0" y2="10" stroke="red" stroke-width="0.1"/>
        </svg>
    </div>` : '';
    
    return `
    <div class="deed">
        ${mortgagedText}

        <div class="title-content">
            <div class="titlebar" style="background: ${color}">
                <p>TITLE DEED</p>
                <h2>${name}</h2>
            </div>

            <b>Rent ${rent0}&cent;</b>

            <div class="columnized">
                <ul class="left">
                    <li>With 1 House</li>
                    <li>With 2 Houses</li>
                    <li>With 3 Houses</li>
                    <li>With 4 Houses</li>
                    <li>With Hotel</li>
                </ul>

                <ul class="right">
                    <li>${rent1}&cent;</li>
                    <li>${rent2}&cent;</li>
                    <li>${rent3}&cent;</li>
                    <li>${rent4}&cent;</li>
                    <li>${rent5}&cent;</li>
                </ul>
            </div>

            <div class="dummy"></div>

            <div class="columnized">
                <ul class="left">
                    <li>Improvement Cost</li>
                    <li>Mortgage Value</li>
                </ul>

                <ul class="right">
                    <li>${devcost}&cent;</li>
                    <li>${mortval}&cent;</li>
                </ul>
            </div>
        </div>
    </div>
    `;
}

function utilityDeed(name, icon, isMortgaged) {
    let mortgagedText = isMortgaged == "true" ? `
    <div class="mortgaged">
        <svg viewBox="0 0 10 10" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="10" y2="10" stroke="red" stroke-width="0.1"/>
            <line x1="10" y1="0" x2="0" y2="10" stroke="red" stroke-width="0.1"/>
        </svg>
    </div>` : '';

    return `
    <div class="deed">
        ${mortgagedText}

        <div class="utility-content">
            <div class="icon">${icon}</div>

            <h3 class="name">${name}</h3>

            <p class="indented nudge">If one "Utility" is owned, rent is 4 times amount shown on dice.</p>
            <p class="indented">If both "Utilities" are owned, rent is 10 times amount shown on dice.</p>

            <div class="dummy"></div>

            <div class="columnized">
                <p>Mortgage Value</p>
                <p>75&cent;</p>
            </div>
        </div>
    </div>
    `;
}

function railroadDeed(name, isMortgaged) {
    let mortgagedText = isMortgaged == "true" ? `
    <div class="mortgaged">
        <svg viewBox="0 0 10 10" preserveAspectRatio="none">
            <line x1="0" y1="0" x2="10" y2="10" stroke="red" stroke-width="0.1"/>
            <line x1="10" y1="0" x2="0" y2="10" stroke="red" stroke-width="0.1"/>
        </svg>
    </div>` : '';
    
    return `
    <div class="deed">
        ${mortgagedText}

        <div class="utility-content">
            <div class="icon">&#x1F686;</div>
    
            <h3 class="name">${name}</h3>
    
            <div class="columnized nudge">
                <ul class="left">
                    <li>With 1 R.R. owned</li>
                    <li>With 2 R.R. owned</li>
                    <li>With 3 R.R. owned</li>
                    <li>With 4 R.R. owned</li>
                </ul>
    
                <ul class="right">
                    <li>25&cent;</li>
                    <li>50&cent;</li>
                    <li>100&cent;</li>
                    <li>200&cent;</li>
                </ul>
            </div>
    
            <div class="dummy"></div>
    
            <div class="columnized">
                <p>Mortgage Value</p>
                <p>100&cent;</p>
            </div>
        </div>
    </div>
    `;
}

class TitleDeed extends HTMLElement {
    constructor() {
        super();
    }
    
    connectedCallback() {
        const name = this.getAttribute('name');
        const rent0 = this.getAttribute('rent0');
        const rent1 = this.getAttribute('rent1');
        const rent2 = this.getAttribute('rent2');
        const rent3 = this.getAttribute('rent3');
        const rent4 = this.getAttribute('rent4');
        const rent5 = this.getAttribute('rent5');
        const mortval = this.getAttribute('mortval');
        const devcost = this.getAttribute('devcost');
        const isMortgaged = this.getAttribute('mortgaged');
        const color = this.getAttribute('color');

        this.innerHTML = colorDeed(name, rent0, rent1, rent2, rent3, rent4, rent5, mortval, devcost, isMortgaged, color);
    }
}

class UtilityDeed extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const name = this.getAttribute('name');
        const icon = this.getAttribute('icon');
        const isMortgaged = this.getAttribute('mortgaged');

        this.innerHTML = utilityDeed(name, icon, isMortgaged);
    }
}

class RailroadDeed extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const name = this.getAttribute('name');
        const isMortgaged = this.getAttribute('mortgaged');

        this.innerHTML = railroadDeed(name, isMortgaged);
    }
}

customElements.define('title-deed', TitleDeed);
customElements.define('utility-deed', UtilityDeed);
customElements.define('railroad-deed', RailroadDeed);
