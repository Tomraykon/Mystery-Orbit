// Array of Items With Rarity, Symbol and Value
const items = [
    // Basic rarity
    { name: "Zephyr", rarity: "basic", symbol: "../assets/basic1.svg", value: 5 },
    { name: "Ember", rarity: "basic", symbol: "../assets/basic2.svg", value: 10 },
    { name: "Quartz", rarity: "basic", symbol: "../assets/basic3.svg", value: 15 },
    { name: "Ripple", rarity: "basic", symbol: "../assets/basic4.svg", value: 20 },
    { name: "Glint", rarity: "basic", symbol: "../assets/basic5.svg", value: 30 },

    // Normal rarity
    { name: "Vortex", rarity: "normal", symbol: "../assets/normal1.svg", value: 50 },
    { name: "Halo", rarity: "normal", symbol: "../assets/normal2.svg", value: 60 },
    { name: "Strider", rarity: "normal", symbol: "../assets/normal3.svg", value: 75 },
    { name: "Pulse", rarity: "normal", symbol: "../assets/normal4.svg", value: 85 },

    // Rare rarity
    { name: "Specter", rarity: "rare", symbol: "../assets/rare1.svg", value: 90 },
    { name: "Aether", rarity: "rare", symbol: "../assets/rare2.svg", value: 100 },
    { name: "Cinder", rarity: "rare", symbol: "../assets/rare3.svg", value: 120 },

    // Epic rarity
    { name: "Nova", rarity: "epic", symbol: "../assets/epic1.svg", value: 150 },
    { name: "Phantom", rarity: "epic", symbol: "../assets/epic2.svg", value: 200 },
    { name: "X-Overlord", rarity: "epic", symbol: "../assets/epic3.svg", value: 250 },

    // Mythic rarity
    { name: "Oblivion", rarity: "mythic", symbol: "../assets/mythic1.svg", value: 350 },
    { name: "Eclipse Prime", rarity: "mythic", symbol: "../assets/mythic2.svg", value: 400 },

    // Overkill rarity
    { name: "Cataclysm", rarity: "overkill", symbol: "../assets/overkill1.svg", value: 1000 }
];

// Initial state
let inventory = [];
let money = 0;

// Cooldown System
let cooldownBase = 30;
let cooldownReduction = 0;
let cooldownUpgradeCount = 0;
const maxCooldownUpgrades = 4;
const cooldownItemPrice = 100;

// Sell Value Upgrade
let sellValueMultiplier = 1;
let sellUpgradeLevel = 0;
let sellUpgradePrice = 150;

// Passive Income
let passiveIncomeLevel = 0;
let passiveIncomeRate = 0;
let passiveIncomePrice = 50;
let passiveInterval = null;

// Control
let isCooldown = false;

// DOM References
const newCardContainer = document.querySelector(".new-card-container");
const inventoryContainer = document.querySelector(".inventory-container");
const inventoryHolder = document.querySelector(".inventory-holder");
const inventoryTitle = document.querySelector(".inventory-holder h2");
const moneyDisplay = document.querySelector(".money-display");
const openBoxBtn = document.getElementById("open-box-btn");

// Shop items
const shopSection = document.querySelector(".shop-section");

// Cooldown Upgrade
const cooldownDiv = document.createElement("div");
cooldownDiv.classList.add("shop-item");
cooldownDiv.innerHTML = `
  <p>⏳ Reduce cooldown by 5s <span id="cooldown-lv">(Lv 0)</span></p>
  <button id="buy-cooldown-btn">Buy for $${cooldownItemPrice}</button>
`;
shopSection.appendChild(cooldownDiv);

// Sell Value Upgrade
const sellUpgradeDiv = document.createElement("div");
sellUpgradeDiv.classList.add("shop-item");
sellUpgradeDiv.innerHTML = `
  <p>💰 Boost card value by 10% (Lv <span id="sell-lv">0</span>)</p>
  <button id="buy-sell-btn">Buy for $${sellUpgradePrice}</button>
`;
shopSection.appendChild(sellUpgradeDiv);

// Passive Income Upgrade
const passiveIncomeDiv = document.createElement("div");
passiveIncomeDiv.classList.add("shop-item");
passiveIncomeDiv.innerHTML = `
  <p>🔋 Passive income: <span id="passive-lv">Lv 0</span> ($/s: <span id="passive-rate">0</span>)</p>
  <button id="buy-passive-btn">Buy for $${passiveIncomePrice}</button>
`;
shopSection.appendChild(passiveIncomeDiv);

// Button References
const buyCooldownBtn = document.getElementById("buy-cooldown-btn");
const buySellBtn = document.getElementById("buy-sell-btn");
const buyPassiveBtn = document.getElementById("buy-passive-btn");
const sellLvDisplay = document.getElementById("sell-lv");
const cooldownLvDisplay = document.getElementById("cooldown-lv");
const passiveLvDisplay = document.getElementById("passive-lv");
const passiveRateDisplay = document.getElementById("passive-rate");

// Update displayed money
function updateMoneyDisplay() {
    moneyDisplay.textContent = `$${money}`;
}

// Passive Income Function
function startPassiveIncome() {
    if (passiveInterval) clearInterval(passiveInterval);
    passiveInterval = setInterval(() => {
        money += passiveIncomeRate;
        updateMoneyDisplay();
    }, 1000);
}

// Get random item
function getRandomItem() {
    const index = Math.floor(Math.random() * items.length);
    return items[index];
}

// Show the newly opened card
function showCard(card) {
    newCardContainer.innerHTML = "";

    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card", card.rarity, "enter");

    cardDiv.innerHTML = `
    <div class="card-content">
      <img src="${card.symbol}" alt="${card.name} Symbol" class="symbol-img" />
      <div class="name">${card.name}</div>
    </div>
    <div class="rarity">${card.rarity.toUpperCase()}</div>`;

    newCardContainer.appendChild(cardDiv);

    // Trigger entrance animation
    void cardDiv.offsetWidth;
    cardDiv.classList.remove("enter");
}

// Render inventory
function renderInventory() {
    inventoryContainer.innerHTML = "";

    inventory.forEach((card, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card", card.rarity);

        const boostedValue = Math.round(card.value * sellValueMultiplier);

        cardDiv.innerHTML = `
      <div class="card-content">
        <img src="${card.symbol}" alt="${card.name} Symbol" class="symbol-img" />
        <div class="name">${card.name}</div>
        <div class="rarity">${card.rarity.toUpperCase()}</div>
        <button class="sell-btn">Sell for $${boostedValue}</button>
      </div>
    `;

        cardDiv.querySelector(".sell-btn").addEventListener("click", () => {
            sellCard(index);
        });

        inventoryContainer.appendChild(cardDiv);
    });
}

// Sell a card
function sellCard(index) {
    const sold = inventory.splice(index, 1)[0];
    const earned = Math.round(sold.value * sellValueMultiplier);
    money += earned;
    updateMoneyDisplay();
    renderInventory();

    if (inventory.length === 0) {
        inventoryContainer.classList.add("hidden");
        inventoryTitle.classList.add("hidden");
        inventoryHolder.classList.add("hidden");
    }
}

// Add card to inventory
function addToInventory(card) {
    inventory.push(card);

    if (inventory.length === 1) {
        inventoryContainer.classList.remove("hidden");
        inventoryTitle.classList.remove("hidden");
        inventoryHolder.classList.remove("hidden");
    }
}

// Handle cooldown
function startCooldown() {
    isCooldown = true;
    openBoxBtn.disabled = true;

    let secondsLeft = cooldownBase - cooldownReduction;
    openBoxBtn.textContent = `Wait ${secondsLeft}s`;

    const interval = setInterval(() => {
        secondsLeft--;
        openBoxBtn.textContent = `Wait ${secondsLeft}s`;

        if (secondsLeft <= 0) {
            clearInterval(interval);
            openBoxBtn.disabled = false;
            openBoxBtn.textContent = "Open Box";
            isCooldown = false;
        }
    }, 1000);
}

// Handle "Open Box" click
openBoxBtn.addEventListener("click", () => {
    if (isCooldown) return;

    const item = getRandomItem();
    showCard(item);
    addToInventory(item);
    renderInventory();
    startCooldown();

    Toastify({
        text: `🎁 You got ${item.name.toUpperCase()}!`,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: {
            background: "linear-gradient(to right, #6C5CE7, #AE47F0)"
        }
    }).showToast();
});

// Cooldown Upgrade Purchase
buyCooldownBtn.addEventListener("click", () => {
    if (cooldownUpgradeCount >= maxCooldownUpgrades || money < cooldownItemPrice) {
        Toastify({
            text: cooldownUpgradeCount >= maxCooldownUpgrades ? "❌ Max cooldown upgrades reached!" : "💰 Not enough money!",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: { background: "#800020" }
        }).showToast();
        return;
    }

    money -= cooldownItemPrice;
    cooldownUpgradeCount++;
    cooldownReduction += 5;
    updateMoneyDisplay();
    cooldownLvDisplay.textContent = `(Lv ${cooldownUpgradeCount >= 4 ? "MAX" : cooldownUpgradeCount})`;

    Toastify({
        text: `Cooldown reduced by 5s!`,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: { background: "#4CAF50" }
    }).showToast();

    if (cooldownUpgradeCount === maxCooldownUpgrades) {
        buyCooldownBtn.disabled = true;
        buyCooldownBtn.textContent = "Maxed";
        buyCooldownBtn.style.backgroundColor = "#444";
        buyCooldownBtn.style.cursor = "not-allowed";
    }
});

// Sell Value Upgrade Purchase
buySellBtn.addEventListener("click", () => {
    if (money < sellUpgradePrice) {
        Toastify({
            text: "💰 Not enough money!",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: { background: "#800020" }
        }).showToast();
        return;
    }

    money -= sellUpgradePrice;
    sellValueMultiplier += 0.10;
    sellUpgradeLevel++;
    sellUpgradePrice = Math.round(sellUpgradePrice * 1.5);
    updateMoneyDisplay();

    buySellBtn.textContent = `Buy for $${sellUpgradePrice}`;
    sellLvDisplay.textContent = sellUpgradeLevel;

    Toastify({
        text: `💸 Card value increased by 10%! (Lv ${sellUpgradeLevel})`,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: { background: "#4CAF50" }
    }).showToast();

    renderInventory();
});

// Passive Income Purchase
buyPassiveBtn.addEventListener("click", () => {
    if (money < passiveIncomePrice) {
        Toastify({
            text: "💰 Not enough money!",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: { background: "#800020" }
        }).showToast();
        return;
    }

    money -= passiveIncomePrice;
    passiveIncomeLevel++;
    passiveIncomeRate = passiveIncomeRate === 0 ? 1 : passiveIncomeRate * 2;
    passiveIncomePrice = Math.round(passiveIncomePrice * 1.5);

    updateMoneyDisplay();
    startPassiveIncome();

    passiveLvDisplay.textContent = `Lv ${passiveIncomeLevel}`;
    passiveRateDisplay.textContent = `${passiveIncomeRate}`;
    buyPassiveBtn.textContent = `Buy for $${passiveIncomePrice}`;

    Toastify({
        text: `🪙 Passive income upgraded! +$${passiveIncomeRate}/s`,
        duration: 3000,
        gravity: "bottom",
        position: "right",
        style: { background: "#4CAF50" }
    }).showToast();
});

// Init
updateMoneyDisplay();
renderInventory();

// Cheat Code: "MONEY"
let cheatSequence = [];
const cheatCode = ["m", "o", "n", "e", "y"];

document.addEventListener("keydown", (e) => {
    cheatSequence.push(e.key.toLowerCase());
    if (cheatSequence.length > cheatCode.length) cheatSequence.shift();

    if (cheatSequence.join("") === cheatCode.join("")) {
        money += 1000;
        updateMoneyDisplay();

        Toastify({
            text: "💵 Cheat Activated! +$1000",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            style: {
                background: "linear-gradient(120deg, #4CAF50, #112D1B)"
            }
        }).showToast();

        cheatSequence = [];
    }
});
