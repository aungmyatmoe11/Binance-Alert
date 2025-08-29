# Cryptocurrency API Guide - Myanmar Language

# UI Development အတွက် API အသုံးပြုနည်း လမ်းညွှန်

## 🚀 API တွေ စတင်နည်း

### နည်းလမ်း ၃ မျိုး ရှိပါတယ်:

```bash
# နည်းလမ်း ၁: Binance API တစ်ခုတည်း (Port 10000)
npm start

# နည်းလမ်း ၂: CoinGecko API တစ်ခုတည်း (Port 10001)
npm run coingecko

# နည်းလမ်း ၃: နှစ်ခုလုံး တစ်ပြိုင်နက် (အကြံပြုပါတယ်)
npm run both
```

### API စတင်ပြီးရင် စစ်ဆေးနည်း:

```bash
# Binance API စစ်ဆေးမယ်
curl http://localhost:10000/health

# CoinGecko API စစ်ဆေးမယ်
curl http://localhost:10001/health
```

## 🎯 UI အတွက် အဓိက API Workflow

### ၁. Coin List ရယူတဲ့ API (UI မှာ Select Box အတွက်)

**Top Coins ရယူမယ် (UI မူလ list အတွက်):**

```bash
GET http://localhost:10001/api/top?limit=50&currency=usd
```

**ဘာကြောင့် အဲ့ API ကို သုံးရမလဲ:**

- Top 50 coins တွေ ရမယ်
- Market cap အလိုက် စီထားမယ်
- Current price, 24h change ပါမယ်
- UI မှာ dropdown ဒါမှမဟုတ် list အနေနဲ့ ပြသလို့ရမယ်

**Response ဥပမာ:**

```json
{
  "success": true,
  "coins": [
    {
      "id": "bitcoin",
      "name": "Bitcoin",
      "symbol": "btc",
      "current_price": 67845.32,
      "market_cap_rank": 1,
      "price_change_percentage_24h": 2.45,
      "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png"
    }
  ]
}
```

### ၂. Coin Search API (UI Search Box အတွက်)

**User က search လုပ်တဲ့အခါ:**

```bash
GET http://localhost:10001/api/search/{searchTerm}?limit=20
```

**ဥပမာ:**

```bash
# Bitcoin ရှာမယ်
GET http://localhost:10001/api/search/bitcoin?limit=20

# KOGE ရှာမယ်
GET http://localhost:10001/api/search/koge?limit=20
```

### ၃. Selected Coin Details ရယူမယ် (User က coin တစ်ခု select လုပ်ပြီးရင်)

**Single coin အတွက်:**

```bash
GET http://localhost:10001/api/coin/{coinId}?detailed=true
```

**ဥပမာ:**

```bash
# Bitcoin details ရယူမယ်
GET http://localhost:10001/api/coin/bitcoin?detailed=true

# Ethereum details ရယူမယ်
GET http://localhost:10001/api/coin/ethereum?detailed=true
```

**Response မှာ ရမယ့် အချက်အလက်တွေ:**

```json
{
  "success": true,
  "coin": {
    "id": "bitcoin",
    "name": "Bitcoin",
    "symbol": "BTC",
    "currentPrice": {
      "usd": 67845.32,
      "usd_24h_change": 2.45,
      "usd_24h_vol": 28450000000
    },
    "details": {
      "description": "Bitcoin is a cryptocurrency...",
      "marketCap": 1342000000000,
      "circulatingSupply": 19756000,
      "homepage": "http://www.bitcoin.org"
    }
  }
}
```

### ၄. Multiple Coins Price ရယူမယ် (User က coins အများကြီး select လုပ်ထားရင်)

**လက်ရှိ track လုပ်နေတဲ့ coins တွေရဲ့ prices:**

```bash
GET http://localhost:10001/api/prices
```

**Response:**

```json
{
  "success": true,
  "prices": {
    "bitcoin": {
      "usd": 67845.32,
      "usd_24h_change": 2.45
    },
    "ethereum": {
      "usd": 4156.78,
      "usd_24h_change": -1.23
    }
  }
}
```

## 📱 UI Development Workflow (အဆင့်ဆင့်)

### အဆင့် ၁: App စတင်တဲ့အခါ

```javascript
// UI မှာ coins list load လုပ်မယ်
async function loadInitialCoins() {
  try {
    const response = await fetch("http://localhost:10001/api/top?limit=50")
    const data = await response.json()

    if (data.success) {
      // UI မှာ dropdown ဒါမှမဟုတ် list ပြမယ်
      displayCoinsInUI(data.coins)
    }
  } catch (error) {
    console.error("Coins load မလုပ်ဆောင်နိုင်ပါ:", error)
  }
}

// UI မှာ coins တွေ ပြသမယ်
function displayCoinsInUI(coins) {
  const coinSelect = document.getElementById("coinSelect")

  coins.forEach((coin) => {
    const option = document.createElement("option")
    option.value = coin.id
    option.textContent = `${coin.name} (${coin.symbol.toUpperCase()}) - $${
      coin.current_price
    }`
    coinSelect.appendChild(option)
  })
}
```

### အဆင့် ၂: User က coin တစ်ခု select လုပ်တဲ့အခါ

```javascript
// User က coin select လုပ်တဲ့အခါ
async function onCoinSelected(coinId) {
  try {
    const response = await fetch(
      `http://localhost:10001/api/coin/${coinId}?detailed=true`
    )
    const data = await response.json()

    if (data.success) {
      // Selected coin ရဲ့ details တွေ ပြမယ်
      displayCoinDetails(data.coin)

      // Price monitoring စမယ်
      startPriceMonitoring(coinId)
    }
  } catch (error) {
    console.error("Coin details ရယူမရပါ:", error)
  }
}

// Coin details တွေ UI မှာ ပြမယ်
function displayCoinDetails(coin) {
  document.getElementById("coinName").textContent = coin.name
  document.getElementById("coinPrice").textContent = `$${coin.currentPrice.usd}`
  document.getElementById(
    "priceChange"
  ).textContent = `${coin.currentPrice.usd_24h_change.toFixed(2)}%`

  // Description ရှိရင် ပြမယ်
  if (coin.details && coin.details.description) {
    document.getElementById("coinDescription").textContent =
      coin.details.description
  }
}
```

### အဆင့် ၃: Real-time Price Updates

```javascript
// Real-time price monitoring
function startPriceMonitoring(coinId) {
  // ၅ စက္ကန့်တိုင်း price update လုပ်မယ်
  setInterval(async () => {
    try {
      const response = await fetch(`http://localhost:10001/api/coin/${coinId}`)
      const data = await response.json()

      if (data.success && data.coin.currentPrice) {
        updatePriceInUI(data.coin.currentPrice)
      }
    } catch (error) {
      console.error("Price update မရပါ:", error)
    }
  }, 5000) // ၅ စက္ကန့်တိုင်း
}

// UI မှာ price update လုပ်မယ်
function updatePriceInUI(priceData) {
  const priceElement = document.getElementById("coinPrice")
  const changeElement = document.getElementById("priceChange")

  // Price update
  priceElement.textContent = `$${priceData.usd}`

  // Change percentage
  const change = priceData.usd_24h_change
  changeElement.textContent = `${change.toFixed(2)}%`
  changeElement.className = change >= 0 ? "positive" : "negative"
}
```

### အဆင့် ၄: Search Functionality

```javascript
// Search function for UI
async function searchCoins(searchTerm) {
  if (searchTerm.length < 2) return // အနည်းဆုံး ၂ လုံး ရိုက်ရမယ်

  try {
    const response = await fetch(
      `http://localhost:10001/api/search/${searchTerm}?limit=20`
    )
    const data = await response.json()

    if (data.success) {
      displaySearchResults(data.coins)
    }
  } catch (error) {
    console.error("Search မလုပ်ဆောင်နိုင်ပါ:", error)
  }
}

// Search results ပြမယ်
function displaySearchResults(coins) {
  const resultsContainer = document.getElementById("searchResults")
  resultsContainer.innerHTML = "" // Clear previous results

  coins.forEach((coin) => {
    const resultElement = document.createElement("div")
    resultElement.className = "search-result"
    resultElement.innerHTML = `
      <img src="${coin.image || ""}" alt="${coin.name}" width="24" height="24">
      <span>${coin.name} (${coin.symbol.toUpperCase()})</span>
    `

    // Click event
    resultElement.addEventListener("click", () => {
      onCoinSelected(coin.id)
      resultsContainer.style.display = "none" // Hide search results
    })

    resultsContainer.appendChild(resultElement)
  })
}
```

### အဆင့် ၅: အသစ် - UI အတွက် နာမည်များ နှင့် ဈေးနှုန်း APIs

```javascript
// ၁. Coin names ရယူတဲ့ function (Dropdown အတွက်)
async function loadCoinNamesForDropdown() {
  try {
    const response = await fetch(
      "http://localhost:10001/api/coin-names?include_trending=true&include_alpha=true&limit=200"
    )
    const data = await response.json()

    if (data.success) {
      populateDropdownWithCoinNames(data.coins)
    }
  } catch (error) {
    console.error("Coin names load မရပါ:", error)
  }
}

// Dropdown မှာ coin names တွေ ထည့်မယ်
function populateDropdownWithCoinNames(coins) {
  const select = document.getElementById("coinSelect")
  select.innerHTML = '<option value="">Coin တစ်ခု ရွေးချယ်ပါ</option>'

  coins.forEach((coin) => {
    const option = document.createElement("option")
    option.value = coin.id

    // Type အလိုက် အမှတ်အသား ပြမယ်
    let displayName = coin.name
    if (coin.type === "trending") displayName += " 🔥"
    if (coin.type === "alpha") displayName += " ⭐"

    option.textContent = `${displayName} (${coin.symbol})`
    select.appendChild(option)
  })
}

// ၂. ရွေးချယ်ထားတဲ့ coins တွေရဲ့ ဈေးနှုန်း ရယူမယ်
async function getSelectedCoinsPrice(selectedCoins) {
  try {
    const response = await fetch(
      "http://localhost:10001/api/selected-coins-prices",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coins: selectedCoins, // ["BTC", "ETH", "BNB", "KOGE"]
          currency: "usd",
        }),
      }
    )

    const data = await response.json()

    if (data.success) {
      displaySelectedCoinsPrices(data.coins)
    }
  } catch (error) {
    console.error("Selected coins prices ရယူမရပါ:", error)
  }
}

// Selected coins prices တွေ ပြမယ်
function displaySelectedCoinsPrices(coinPrices) {
  const container = document.getElementById("selectedCoinsPrices")
  container.innerHTML = "<h3>ရွေးချယ်ထားတဲ့ Coins တွေရဲ့ ဈေးနှုန်း</h3>"

  coinPrices.forEach((coin) => {
    const coinDiv = document.createElement("div")
    coinDiv.style.cssText =
      "padding: 10px; border: 1px solid #ddd; margin: 5px 0; border-radius: 5px;"

    if (coin.current_price) {
      const changeClass = coin.price_change_24h >= 0 ? "positive" : "negative"
      coinDiv.innerHTML = `
        <strong>${coin.name} (${coin.symbol})</strong><br>
        <span style="font-size: 18px;">$${coin.current_price.toLocaleString()}</span>
        <span class="${changeClass}" style="margin-left: 10px;">
          ${coin.price_change_24h ? coin.price_change_24h.toFixed(2) + "%" : ""}
        </span>
      `
    } else {
      coinDiv.innerHTML = `
        <strong>${coin.name} (${coin.symbol})</strong><br>
        <span style="color: orange;">ဈေးနှုန်း မရနိုင်ပါ</span>
      `
    }

    container.appendChild(coinDiv)
  })
}

// ၃. Multiple coins ရွေးချယ်တဲ့ UI example
function setupMultipleCoinSelection() {
  // Checkbox သို့မဟုတ် multi-select dropdown ရဲ့ ဥပမာ
  const coinCheckboxes = document.querySelectorAll(
    'input[name="selectedCoins"]'
  )
  const updatePricesBtn = document.getElementById("updatePricesBtn")

  updatePricesBtn.addEventListener("click", () => {
    const selectedCoins = []

    coinCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        selectedCoins.push(checkbox.value) // coin symbol or ID
      }
    })

    if (selectedCoins.length > 0) {
      getSelectedCoinsPrice(selectedCoins)
    } else {
      alert("အနည်းဆုံး coin တစ်ခု ရွေးချယ်ပါ")
    }
  })
}
```

## 🪙 KOGE Alpha Token အတွက် အထူး APIs

### KOGE ရှာမယ်:

```bash
# ၁. Direct KOGE search
GET http://localhost:10001/api/koge

# ၂. Contract address နဲ့ ရှာမယ်
GET http://localhost:10001/api/contract/0xe6df05ce8c8301223373cf5b969afcb1498c5528

# ၃. General search
GET http://localhost:10001/api/search/koge
```

### KOGE ကို Binance API မှာ custom symbol အနေနဲ့ ထည့်မယ်:

```bash
POST http://localhost:10000/api/symbol/custom
Content-Type: application/json

{
  "symbol": "KOGEUSDT",
  "baseAsset": "KOGE",
  "quoteAsset": "USDT",
  "name": "KOGE Alpha Token - BSC Contract: 0xe6df05ce8c8301223373cf5b969afcb1498c5528"
}
```

## 📊 UI အတွက် အဓိက API Summary

### ၁. **Coin Selection APIs (အရေးကြီးဆုံး)**

- `GET /api/coin-names` - **အသစ်!** UI dropdown အတွက် coin နာမည်တွေ (ဈေးနှုန်း မပါ)
- `POST /api/selected-coins-prices` - **အသစ်!** User ရွေးချယ်ထားတဲ့ coins တွေ အတွက် ဈေးနှုန်းများ
- `GET /api/top?limit=50` - Initial coin list
- `GET /api/search/{term}` - Search functionality
- `GET /api/coin/{id}?detailed=true` - Selected coin details

### ၂. **Price Monitoring APIs**

- `GET /api/prices` - Multiple coins prices
- `GET /api/coin/{id}` - Single coin price (real-time)

### ၃. **UI Helper APIs**

- `GET /api/trending` - Popular/trending coins
- `GET /api/koge` - KOGE Alpha token search

### 🎯 **အသစ် - UI အတွက် အထူး APIs**

#### A. Coin Names Only API (Dropdown အတွက်)

```bash
# နှစ်သက်ရာ ပါလိမ့်မယ် + trending + alpha coins
GET http://localhost:10001/api/coin-names?include_trending=true&include_alpha=true&limit=500
```

**ဘာကြောင့် သုံးရမလဲ:**

- UI မှာ dropdown ပြရန် coin နာမည်တွေပဲ လိုအပ်
- ဈေးနှုန်း မလိုအပ် (faster loading)
- Trending coins + Alpha tokens like KOGE ပါမယ်

**Response:**

```json
{
  "success": true,
  "total": 523,
  "include_trending": true,
  "include_alpha": true,
  "coins": [
    {
      "id": "bitcoin",
      "name": "Bitcoin",
      "symbol": "BTC",
      "type": "regular"
    },
    {
      "id": "koge-coin",
      "name": "KOGE - 48 Club Token",
      "symbol": "KOGE",
      "type": "alpha"
    }
  ]
}
```

#### B. Selected Coins Prices API (Batch Price Fetching)

```bash
# User က BTC, ETH, BNB, KOGE ရွေးချယ်ထားတဲ့အခါ
POST http://localhost:10001/api/selected-coins-prices
Content-Type: application/json

{
  "coins": ["BTC", "ETH", "BNB", "KOGE"],
  "currency": "usd"
}
```

**ဘာကြောင့် သုံးရမလဲ:**

- User က ရွေးချယ်ထားတဲ့ coins တွေအတွက်ပဲ ဈေးနှုန်း ရယူမယ်
- Single API call နဲ့ multiple coins
- UI performance ပိုကောင်းမယ်

**Response:**

```json
{
  "success": true,
  "currency": "USD",
  "requested_count": 4,
  "found_count": 4,
  "coins": [
    {
      "id": "bitcoin",
      "name": "Bitcoin",
      "symbol": "BTC",
      "current_price": 97234.56,
      "price_change_24h": 2.34
    }
  ]
}
```

## 🔧 Complete HTML Example (ဥပမာ UI)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Cryptocurrency Tracker</title>
    <style>
      .positive {
        color: green;
      }
      .negative {
        color: red;
      }
      .search-result {
        padding: 10px;
        cursor: pointer;
        border-bottom: 1px solid #eee;
      }
      .search-result:hover {
        background-color: #f0f0f0;
      }
    </style>
  </head>
  <body>
    <h1>Cryptocurrency Price Tracker</h1>

    <!-- Search Box -->
    <div>
      <input
        type="text"
        id="searchInput"
        placeholder="Coin ရှာမယ် (ဥပမာ: bitcoin, ethereum)"
      />
      <div
        id="searchResults"
        style="display: none; border: 1px solid #ccc; max-height: 200px; overflow-y: auto;"
      ></div>
    </div>

    <!-- Coin Selection -->
    <div>
      <select id="coinSelect">
        <option value="">Coin တစ်ခု ရွေးချယ်ပါ</option>
      </select>
    </div>

    <!-- Selected Coin Details -->
    <div id="coinDetails" style="display: none;">
      <h2 id="coinName"></h2>
      <p>လက်ရှိ ဈေးနှုန်း: <span id="coinPrice"></span></p>
      <p>၂၄ နာရီ ပြောင်းလဲမှု: <span id="priceChange"></span></p>
      <p id="coinDescription"></p>
    </div>

    <!-- Top Coins List -->
    <div>
      <h3>လက်ရှိ Top Coins</h3>
      <div id="topCoinsList"></div>
    </div>

    <script>
      // စာမျက်နှာ load ဖြစ်တဲ့အခါ coins တွေ ရယူမယ်
      document.addEventListener("DOMContentLoaded", function () {
        loadInitialCoins()
        setupSearchFunction()
        setupCoinSelection()
      })

      // Initial coins load လုပ်မယ်
      async function loadInitialCoins() {
        try {
          const response = await fetch(
            "http://localhost:10001/api/top?limit=20"
          )
          const data = await response.json()

          if (data.success) {
            displayCoinsInSelect(data.coins)
            displayTopCoins(data.coins)
          }
        } catch (error) {
          console.error("Coins load မရပါ:", error)
          alert("API server မစမ်းပါ။ npm run both နဲ့ စတင်ပါ။")
        }
      }

      // Select box မှာ coins တွေ ထည့်မယ်
      function displayCoinsInSelect(coins) {
        const select = document.getElementById("coinSelect")

        coins.forEach((coin) => {
          const option = document.createElement("option")
          option.value = coin.id
          option.textContent = `${
            coin.name
          } (${coin.symbol.toUpperCase()}) - $${coin.current_price.toLocaleString()}`
          select.appendChild(option)
        })
      }

      // Top coins list ပြမယ်
      function displayTopCoins(coins) {
        const container = document.getElementById("topCoinsList")
        container.innerHTML = ""

        coins.slice(0, 10).forEach((coin, index) => {
          const coinDiv = document.createElement("div")
          coinDiv.style.cssText =
            "padding: 10px; border-bottom: 1px solid #eee; cursor: pointer;"
          coinDiv.innerHTML = `
                    <strong>${index + 1}. ${coin.name}</strong> 
                    <span style="float: right;">
                        $${coin.current_price.toLocaleString()}
                        <span class="${
                          coin.price_change_percentage_24h >= 0
                            ? "positive"
                            : "negative"
                        }">
                            ${coin.price_change_percentage_24h.toFixed(2)}%
                        </span>
                    </span>
                `

          coinDiv.addEventListener("click", () => {
            document.getElementById("coinSelect").value = coin.id
            onCoinSelected(coin.id)
          })

          container.appendChild(coinDiv)
        })
      }

      // Search function setup
      function setupSearchFunction() {
        const searchInput = document.getElementById("searchInput")
        const searchResults = document.getElementById("searchResults")

        let searchTimeout

        searchInput.addEventListener("input", function () {
          clearTimeout(searchTimeout)
          const searchTerm = this.value.trim()

          if (searchTerm.length < 2) {
            searchResults.style.display = "none"
            return
          }

          searchTimeout = setTimeout(() => {
            searchCoins(searchTerm)
          }, 300) // ၀.၃ စက္ကန့် စောင့်မယ်
        })

        // Click outside ရင် search results ပိတ်မယ်
        document.addEventListener("click", function (e) {
          if (
            !searchInput.contains(e.target) &&
            !searchResults.contains(e.target)
          ) {
            searchResults.style.display = "none"
          }
        })
      }

      // Search function
      async function searchCoins(searchTerm) {
        try {
          const response = await fetch(
            `http://localhost:10001/api/search/${searchTerm}?limit=10`
          )
          const data = await response.json()

          if (data.success) {
            displaySearchResults(data.coins)
          }
        } catch (error) {
          console.error("Search မရပါ:", error)
        }
      }

      // Search results ပြမယ်
      function displaySearchResults(coins) {
        const container = document.getElementById("searchResults")
        container.innerHTML = ""

        if (coins.length === 0) {
          container.innerHTML = '<div style="padding: 10px;">ရလဒ် မရှိပါ</div>'
        } else {
          coins.forEach((coin) => {
            const resultDiv = document.createElement("div")
            resultDiv.className = "search-result"
            resultDiv.innerHTML = `
                        <strong>${
                          coin.name
                        }</strong> (${coin.symbol.toUpperCase()})
                    `

            resultDiv.addEventListener("click", () => {
              document.getElementById("coinSelect").value = coin.id
              onCoinSelected(coin.id)
              container.style.display = "none"
              document.getElementById("searchInput").value = coin.name
            })

            container.appendChild(resultDiv)
          })
        }

        container.style.display = "block"
      }

      // Coin selection setup
      function setupCoinSelection() {
        document
          .getElementById("coinSelect")
          .addEventListener("change", function () {
            const coinId = this.value
            if (coinId) {
              onCoinSelected(coinId)
            }
          })
      }

      // Coin select လုပ်တဲ့အခါ
      async function onCoinSelected(coinId) {
        try {
          const response = await fetch(
            `http://localhost:10001/api/coin/${coinId}?detailed=true`
          )
          const data = await response.json()

          if (data.success) {
            displayCoinDetails(data.coin)
            startPriceMonitoring(coinId)
          }
        } catch (error) {
          console.error("Coin details မရပါ:", error)
        }
      }

      // Coin details ပြမယ်
      function displayCoinDetails(coin) {
        const detailsDiv = document.getElementById("coinDetails")

        document.getElementById("coinName").textContent = coin.name
        document.getElementById(
          "coinPrice"
        ).textContent = `$${coin.currentPrice.usd.toLocaleString()}`

        const change = coin.currentPrice.usd_24h_change
        const changeElement = document.getElementById("priceChange")
        changeElement.textContent = `${change.toFixed(2)}%`
        changeElement.className = change >= 0 ? "positive" : "negative"

        if (coin.details && coin.details.description) {
          document.getElementById("coinDescription").textContent =
            coin.details.description.substring(0, 200) + "..."
        }

        detailsDiv.style.display = "block"
      }

      // Price monitoring
      let priceMonitoringInterval

      function startPriceMonitoring(coinId) {
        // Previous interval ရှိရင် ရပ်မယ်
        if (priceMonitoringInterval) {
          clearInterval(priceMonitoringInterval)
        }

        priceMonitoringInterval = setInterval(async () => {
          try {
            const response = await fetch(
              `http://localhost:10001/api/coin/${coinId}`
            )
            const data = await response.json()

            if (data.success && data.coin.currentPrice) {
              updatePriceInUI(data.coin.currentPrice)
            }
          } catch (error) {
            console.error("Price update မရပါ:", error)
          }
        }, 10000) // ၁၀ စက္ကန့်တိုင်း update
      }

      // Price update in UI
      function updatePriceInUI(priceData) {
        const priceElement = document.getElementById("coinPrice")
        const changeElement = document.getElementById("priceChange")

        priceElement.textContent = `$${priceData.usd.toLocaleString()}`

        const change = priceData.usd_24h_change
        changeElement.textContent = `${change.toFixed(2)}%`
        changeElement.className = change >= 0 ? "positive" : "negative"
      }
    </script>
  </body>
</html>
```

## 📋 Postman Collection အသုံးပြုနည်း

### ၁. Import လုပ်နည်း:

1. Postman ဖွင့်မယ်
2. **Import** button ကို နှိပ်မယ်
3. `Cryptocurrency_APIs_Complete.postman_collection.json` file ကို drag & drop လုပ်မယ်

### ၂. API testing workflow:

1. **"1. Service Status"** folder - API တွေ run နေရဲ့လား စစ်မယ်
2. **"2. UI Workflow - Coin Selection"** folder - UI အတွက် အဓိက APIs
3. **"6. Complete UI Workflow Demo"** folder - Step by step workflow

### ၃. အရေးကြီးတဲ့ endpoints:

- **Top Coins**: `GET {{coingeckoUrl}}/api/top?limit=50`
- **Search**: `GET {{coingeckoUrl}}/api/search/bitcoin`
- **Coin Details**: `GET {{coingeckoUrl}}/api/coin/bitcoin?detailed=true`
- **KOGE Search**: `GET {{coingeckoUrl}}/api/koge`

## 🎯 အချုပ်

### UI Development အတွက် အဓိက APIs (၄ ခု):

1. **`GET /api/top?limit=50`** - Initial coin list loading
2. **`GET /api/search/{term}`** - Search functionality
3. **`GET /api/coin/{id}?detailed=true`** - Selected coin details
4. **`GET /api/prices`** - Real-time price monitoring

### စတင်ရန်:

```bash
# APIs start လုပ်မယ်
npm run both

# Browser မှာ ဖွင့်မယ်
# HTML file ကို browser မှာ ဖွင့်ပြီး test လုပ်မယ်
```

အဲ့လို လုပ်ရင် coin selection နဲ့ real-time price tracking ပါတဲ့ complete UI ရမှာပါ! 🚀
