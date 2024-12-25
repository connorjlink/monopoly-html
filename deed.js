function deed(name, rent0, rent1, rent2, rent3, rent4, rent5, mortval, devcost) {
    return `
        <div class="deed">
            <div class="mortgaged">
                <svg viewBox="0 0 10 10" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="10" y2="10" stroke="red" stroke-width="0.1"/>
                    <line x1="10" y1="0" x2="0" y2="10" stroke="red" stroke-width="0.1"/>
                </svg>
            </div>

            <div class="border">
                <div class="titlebar">
                    <p>TITLE DEED</p>
                    <h2>${name}</h2>
                </div>

                <div class="content vstack">
                    <b>Rent ${rent0}&cent;</b>

                    <div class="rent hstack">
                        <ul class="left">
                            <li>With 1 House</li>
                            <li>With 2 Houses</li>
                            <li>With 3 Houses</li>
                            <li>With 4 Houses</li>
                            <li>With Hotel</li>
                        </ul>

                        <div class="dummy"></div>

                        <ul class="right">
                            <li>${rent1}&cent;</li>
                            <li>${rent2}&cent;</li>
                            <li>${rent3}&cent;</li>
                            <li>${rent4}&cent;</li>
                            <li>${rent5}&cent;</li>
                        </ul>
                    </div>

                    <div class="dummy"></div>

                    <div class="rent hstack">
                        <ul class="left">
                            <li>Development Cost</li>
                            <li>Mortgage Value</li>
                        </ul>

                        <div class="dummy"></div>

                        <ul class="right">
                            <li>${devcost}&cent;</li>
                            <li>${mortval}&cent;</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function utility(name, icon) {
    return `
        <div class="deed">
            <div class="mortgaged">
                <svg viewBox="0 0 10 10" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="10" y2="10" stroke="red" stroke-width="0.1"/>
                    <line x1="10" y1="0" x2="0" y2="10" stroke="red" stroke-width="0.1"/>
                </svg>
            </div>

            <div class="border">
                <div class="utility-container vstack">
                    <div class="icon">${icon}</div>

                    <hr>

                    <h3>${name}</h3>

                    <hr>

                    <div>
                        <p class="indented nudge">If one "Utility" is owned, rent is 4 times amount shown on dice.</p>
                        <p class="indented">If both "Utilities" are owned, rent is 10 times amount shown on dice.</p>
                    </div>

                    <div class="dummy"></div>

                    <div class="hstack">
                        <p>Mortgage Value</p>
                        <div class="dummy"></div>
                        <p>75&cent;</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function railroad(name) {
    return `
        <div class="deed">
            <div class="mortgaged">
                <svg viewBox="0 0 10 10" preserveAspectRatio="none">
                    <line x1="0" y1="0" x2="10" y2="10" stroke="red" stroke-width="0.1"/>
                    <line x1="10" y1="0" x2="0" y2="10" stroke="red" stroke-width="0.1"/>
                </svg>
            </div>

            <div class="border">
                <div class="utility-container vstack">
                    <div class="railroad-icon">&#x1F686;</div>

                    <hr>

                    <h3>${name}</h3>

                    <hr>

                    <div class="content vstack">
                        <b>Rent 25&cent;</b>

                        <div class="hstack">
                            <ul class="left">
                                <li>With 2 R.R. owned</li>
                                <li>With 3 R.R. owned</li>
                                <li>With 4 R.R. owned</li>
                            </ul>

                            <div class="dummy"></div>

                            <ul class="right">
                                <li>50&cent;</li>
                                <li>100&cent;</li>
                                <li>200&cent;</li>
                            </ul>
                        </div>

                        <div class="dummy"></div>

                        <div class="hstack">
                            <p>Mortgage Value</p>
                            <div class="dummy"></div>
                            <p>100&cent;</p>
                        </div>
                    </div>
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

        this.innerHTML = deed(name, rent0, rent1, rent2, rent3, rent4, rent5, mortval, devcost);
    }
}

class UtilityDeed extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const name = this.getAttribute('name');
        const icon = this.getAttribute('icon');

        this.innerHTML = utility(name, icon);
    }
}

class RailroadDeed extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const name = this.getAttribute('name');

        this.innerHTML = railroad(name);
    }
}

customElements.define('title-deed', TitleDeed);
customElements.define('utility-deed', UtilityDeed);
customElements.define('railroad-deed', RailroadDeed);
