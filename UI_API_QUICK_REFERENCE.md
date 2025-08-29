# UI API Quick Reference - New Endpoints

## 🎯 For Your UI Requirements

Based on your request:

1. **"for the select coin list, i dont need the price of coin, i just only need all of the coin names"**
2. **"what is the api for select coin name like, in ui i select BTC, ETH, BNB, KOGE, if something like that how can i get that last price of thoses coin"**

## 📋 1. Get Coin Names Only (For Dropdown/Selection)

**Purpose**: Populate UI dropdown with coin names only (no prices for faster loading)

**Endpoint**: `GET /api/coin-names`

**URL**:

```
http://localhost:10001/api/coin-names?include_trending=true&include_alpha=true&limit=500
```

**Parameters**:

- `include_trending` (default: true) - Include trending coins
- `include_alpha` (default: true) - Include alpha tokens like KOGE - 48 club token
- `limit` (default: 500) - Maximum number of regular coins

**Response**:

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
      "id": "ethereum",
      "name": "Ethereum",
      "symbol": "ETH",
      "type": "regular"
    },
    {
      "id": "koge-coin",
      "name": "KOGE - 48 Club Token",
      "symbol": "KOGE",
      "type": "alpha",
      "description": "Alpha token from BSC"
    }
  ]
}
```

## 💰 2. Get Prices for Selected Coins (Batch Price Fetching)

**Purpose**: Get prices for multiple coins that user selected (e.g. BTC, ETH, BNB, KOGE)

**Endpoint**: `POST /api/selected-coins-prices`

**URL**: `http://localhost:10001/api/selected-coins-prices`

**Request Body**:

```json
{
  "coins": ["BTC", "ETH", "BNB", "KOGE"],
  "currency": "usd"
}
```

**Alternative with coin IDs**:

```json
{
  "coins": ["bitcoin", "ethereum", "binancecoin", "koge-coin"],
  "currency": "usd"
}
```

**Response**:

```json
{
  "success": true,
  "timestamp": "2025-08-29T05:09:19.385Z",
  "currency": "USD",
  "requested_count": 4,
  "found_count": 4,
  "coins": [
    {
      "id": "bitcoin",
      "name": "Bitcoin",
      "symbol": "BTC",
      "current_price": 97234.56,
      "price_change_24h": 2.34,
      "market_cap": 1923456789,
      "volume_24h": 28934567890,
      "last_updated": "2025-08-29T05:09:19.385Z"
    },
    {
      "id": "ethereum",
      "name": "Ethereum",
      "symbol": "ETH",
      "current_price": 3456.78,
      "price_change_24h": -1.23,
      "market_cap": 415678901,
      "volume_24h": 12345678901,
      "last_updated": "2025-08-29T05:09:19.385Z"
    },
    {
      "id": "binancecoin",
      "name": "BNB",
      "symbol": "BNB",
      "current_price": 678.9,
      "price_change_24h": 0.85,
      "market_cap": 98765432,
      "volume_24h": 2345678901,
      "last_updated": "2025-08-29T05:09:19.385Z"
    },
    {
      "id": "koge-coin",
      "name": "KOGE",
      "symbol": "KOGE",
      "current_price": null,
      "error": "Price data not available",
      "last_updated": "2025-08-29T05:09:19.385Z"
    }
  ]
}
```

## 🚀 UI Workflow Example

### Step 1: Load coin names for dropdown

```javascript
// GET coin names for UI dropdown
const response = await fetch(
  "http://localhost:10001/api/coin-names?include_alpha=true&limit=100"
)
const data = await response.json()

// Populate dropdown
data.coins.forEach((coin) => {
  const option = document.createElement("option")
  option.value = coin.symbol
  option.textContent = coin.name
  dropdown.appendChild(option)
})
```

### Step 2: Get prices for selected coins

```javascript
// User selected: BTC, ETH, BNB, KOGE
const selectedCoins = ["BTC", "ETH", "BNB", "KOGE"]

// POST request for batch prices
const response = await fetch(
  "http://localhost:10001/api/selected-coins-prices",
  {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      coins: selectedCoins,
      currency: "usd",
    }),
  }
)

const data = await response.json()

// Display prices in UI
data.coins.forEach((coin) => {
  if (coin.current_price) {
    console.log(`${coin.symbol}: $${coin.current_price}`)
  } else {
    console.log(`${coin.symbol}: Price not available`)
  }
})
```

## 🧪 Test Commands

```bash
# Start CoinGecko server
npm run coingecko

# Test coin names API
curl "http://localhost:10001/api/coin-names?include_trending=true&include_alpha=true&limit=20"

# Test selected coins prices API
curl -X POST -H "Content-Type: application/json" \
  -d '{"coins":["BTC","ETH","BNB","KOGE"],"currency":"usd"}' \
  "http://localhost:10001/api/selected-coins-prices"

# Run UI demo script
./demo-ui-api.sh
```

## 📝 Notes

- **Coin Names API**: Returns only names and symbols (no prices) for faster loading
- **Selected Prices API**: Supports both symbols ("BTC") and coin IDs ("bitcoin")
- **Alpha Tokens**: Includes KOGE - 48 Club Token when `include_alpha=true`
- **Trending Coins**: Includes popular/trending coins when `include_trending=true`
- **Error Handling**: Coins without price data return `"current_price": null` with error message
- **Maximum**: 100 coins per batch price request (prevents API overload)

Perfect for your UI requirements! 🎯
