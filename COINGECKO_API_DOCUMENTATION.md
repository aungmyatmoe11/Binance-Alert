# CoinGecko API Documentation

## Overview

Complete REST API for CoinGecko cryptocurrency data integration, providing access to 15,000+ cryptocurrencies, real-time prices, market data, and comprehensive coin information including your KOGE Alpha token search.

## Base URL

```
http://localhost:10001
```

## Key Features

- 🪙 **15,000+ Cryptocurrencies**: Access to comprehensive coin database
- 🔍 **Advanced Search**: Find coins by name, symbol, or contract address
- 💰 **Real-time Prices**: Current prices with 24h changes and volume
- 📊 **Market Data**: Market cap, supply, and trading volume
- 🎯 **KOGE Alpha Support**: Dedicated endpoint for your Alpha token
- 📈 **Trending Coins**: Discover what's popular right now
- 🥇 **Top Coins**: Market cap rankings and performance
- ⚡ **Rate Limit Handling**: Automatic handling of CoinGecko's free tier limits

## Available Commands

```bash
# Run CoinGecko API only (Port 10001)
npm run coingecko

# Run Binance API only (Port 10000)
npm start

# Run both APIs together
npm run both
```

## API Endpoints

### 1. Service Information

#### `GET /`

Get service information and available endpoints.

**Response:**

```json
{
  "status": "running",
  "service": "CoinGecko Price Monitor & Coin API",
  "uptime": 123.45,
  "timestamp": "2025-08-29T04:22:17.101Z",
  "tracking": ["bitcoin", "ethereum", "binancecoin", "dogecoin"],
  "endpoints": {
    "health": "GET /",
    "coins": "GET /api/coins",
    "search": "GET /api/search/:query",
    "coin": "GET /api/coin/:coinId",
    "prices": "GET /api/prices",
    "trending": "GET /api/trending",
    "top": "GET /api/top",
    "koge": "GET /api/koge"
  }
}
```

#### `GET /health`

Detailed health check with service statistics.

**Response:**

```json
{
  "status": "running",
  "service": "CoinGecko Price Monitor",
  "uptime": 123.45,
  "timestamp": "2025-08-29T04:22:17.101Z",
  "tracking": ["bitcoin", "ethereum", "binancecoin", "dogecoin"],
  "stats": {
    "totalCoins": 15847,
    "lastUpdate": "2025-08-29T04:21:00.123Z",
    "uniqueSymbols": 12543,
    "apiEndpoint": "https://api.coingecko.com/api/v3",
    "rateLimitDelay": 1100
  }
}
```

### 2. Coin Management

#### `GET /api/coins`

Get all available coins with optional filtering.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `symbol` | string | No | - | Filter by symbol (e.g., BTC) |
| `name` | string | No | - | Filter by name (e.g., Bitcoin) |
| `limit` | integer | No | 100 | Limit number of results |

**Examples:**

```bash
# Get first 10 coins
curl "http://localhost:10001/api/coins?limit=10"

# Find all coins with "bit" in name
curl "http://localhost:10001/api/coins?name=bit&limit=20"

# Find all BTC-related symbols
curl "http://localhost:10001/api/coins?symbol=BTC"
```

**Response:**

```json
{
  "success": true,
  "total": 157,
  "returned": 10,
  "coins": [
    {
      "id": "bitcoin",
      "symbol": "BTC",
      "name": "Bitcoin",
      "platforms": {}
    },
    {
      "id": "ethereum",
      "symbol": "ETH",
      "name": "Ethereum",
      "platforms": {}
    }
  ]
}
```

#### `GET /api/search/:query`

Search coins by name, symbol, or ID.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search term (minimum 2 characters) |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 50 | Limit number of results |

**Examples:**

```bash
# Search for Bitcoin
curl "http://localhost:10001/api/search/bitcoin"

# Search for KOGE
curl "http://localhost:10001/api/search/koge"

# Search with limit
curl "http://localhost:10001/api/search/eth?limit=10"
```

**Response:**

```json
{
  "success": true,
  "query": "bitcoin",
  "total": 45,
  "returned": 50,
  "coins": [
    {
      "id": "bitcoin",
      "symbol": "BTC",
      "name": "Bitcoin",
      "platforms": {}
    }
  ]
}
```

#### `GET /api/coin/:coinId`

Get detailed information about a specific coin including current price.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `coinId` | string | Yes | Coin ID, symbol, or name |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `detailed` | boolean | No | false | Include detailed market data |

**Examples:**

```bash
# Get Bitcoin info with price
curl "http://localhost:10001/api/coin/bitcoin"

# Get detailed Bitcoin information
curl "http://localhost:10001/api/coin/bitcoin?detailed=true"

# Get by symbol
curl "http://localhost:10001/api/coin/btc"
```

**Response (Basic):**

```json
{
  "success": true,
  "coin": {
    "id": "bitcoin",
    "symbol": "BTC",
    "name": "Bitcoin",
    "platforms": {},
    "currentPrice": {
      "usd": 67845.32,
      "usd_24h_change": 2.45,
      "usd_24h_vol": 28450000000
    }
  }
}
```

**Response (Detailed):**

```json
{
  "success": true,
  "coin": {
    "id": "bitcoin",
    "symbol": "BTC",
    "name": "Bitcoin",
    "platforms": {},
    "currentPrice": {
      "usd": 67845.32,
      "usd_24h_change": 2.45,
      "usd_24h_vol": 28450000000
    },
    "details": {
      "description": "Bitcoin is a cryptocurrency and worldwide payment system...",
      "marketCap": 1342000000000,
      "volume24h": 28450000000,
      "circulatingSupply": 19756000,
      "totalSupply": 19756000,
      "maxSupply": 21000000,
      "homepage": "http://www.bitcoin.org",
      "blockchain_site": ["https://blockchair.com/bitcoin/"],
      "categories": ["Cryptocurrency"]
    }
  }
}
```

### 3. Price Information

#### `GET /api/prices`

Get current prices for tracked coins (Bitcoin, Ethereum, Binance Coin, Dogecoin).

**Response:**

```json
{
  "success": true,
  "timestamp": "2025-08-29T04:22:17.101Z",
  "coinIds": ["bitcoin", "ethereum", "binancecoin", "dogecoin"],
  "prices": {
    "bitcoin": {
      "usd": 67845.32,
      "usd_24h_change": 2.45,
      "usd_24h_vol": 28450000000,
      "last_updated_at": 1735459337
    },
    "ethereum": {
      "usd": 4156.78,
      "usd_24h_change": -1.23,
      "usd_24h_vol": 15600000000,
      "last_updated_at": 1735459337
    }
  }
}
```

#### `GET /api/trending`

Get currently trending coins on CoinGecko.

**Response:**

```json
{
  "success": true,
  "timestamp": "2025-08-29T04:22:17.101Z",
  "trending": [
    {
      "item": {
        "id": "solana",
        "coin_id": 5426,
        "name": "Solana",
        "symbol": "SOL",
        "market_cap_rank": 4,
        "thumb": "https://assets.coingecko.com/coins/images/4128/thumb/solana.png",
        "score": 0
      }
    }
  ]
}
```

#### `GET /api/top`

Get top coins by market capitalization.

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 10 | Number of coins to return |
| `currency` | string | No | usd | Currency for prices |

**Examples:**

```bash
# Get top 5 coins
curl "http://localhost:10001/api/top?limit=5"

# Get top 10 in EUR
curl "http://localhost:10001/api/top?limit=10&currency=eur"
```

**Response:**

```json
{
  "success": true,
  "timestamp": "2025-08-29T04:22:17.101Z",
  "limit": 5,
  "currency": "usd",
  "coins": [
    {
      "id": "bitcoin",
      "symbol": "btc",
      "name": "Bitcoin",
      "image": "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
      "current_price": 67845.32,
      "market_cap": 1342000000000,
      "market_cap_rank": 1,
      "fully_diluted_valuation": 1425000000000,
      "total_volume": 28450000000,
      "high_24h": 68500,
      "low_24h": 66200,
      "price_change_24h": 1623.45,
      "price_change_percentage_24h": 2.45,
      "market_cap_change_24h": 32000000000,
      "market_cap_change_percentage_24h": 2.44,
      "circulating_supply": 19756000,
      "total_supply": 19756000,
      "max_supply": 21000000,
      "ath": 73738,
      "ath_change_percentage": -7.99,
      "ath_date": "2024-03-14T07:10:36.635Z",
      "atl": 67.81,
      "atl_change_percentage": 99900.12,
      "atl_date": "2013-07-06T00:00:00.000Z",
      "roi": null,
      "last_updated": "2025-08-29T04:22:17.101Z"
    }
  ]
}
```

### 4. KOGE Alpha Token

#### `GET /api/koge`

Find KOGE Alpha token specifically using multiple search methods.

**Response:**

```json
{
  "success": true,
  "query": "KOGE Alpha Token",
  "contractAddress": "0xe6df05ce8c8301223373cf5b969afcb1498c5528",
  "found": 3,
  "coins": [
    {
      "id": "bnb48-club-token",
      "symbol": "KOGE",
      "name": "KOGE",
      "platforms": {}
    },
    {
      "id": "kogecoin",
      "symbol": "KOGECOIN",
      "name": "KogeCoin",
      "platforms": {}
    },
    {
      "id": "kogin-by-virtuals",
      "symbol": "KOGIN",
      "name": "Kogin by Virtuals",
      "platforms": {}
    }
  ]
}
```

#### `GET /api/contract/:address`

Find coin by contract address.

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `address` | string | Yes | Contract address |

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `platform` | string | No | binance-smart-chain | Blockchain platform |

**Examples:**

```bash
# Find KOGE by contract address
curl "http://localhost:10001/api/contract/0xe6df05ce8c8301223373cf5b969afcb1498c5528"

# Find on Ethereum
curl "http://localhost:10001/api/contract/0x...?platform=ethereum"
```

**Response:**

```json
{
  "success": true,
  "contractAddress": "0xe6df05ce8c8301223373cf5b969afcb1498c5528",
  "platform": "binance-smart-chain",
  "found": 1,
  "coins": [
    {
      "id": "koge-alpha",
      "symbol": "KOGE",
      "name": "KOGE Alpha Token",
      "platforms": {
        "binance-smart-chain": "0xe6df05ce8c8301223373cf5b969afcb1498c5528"
      }
    }
  ]
}
```

### 5. Documentation

#### `GET /api/docs`

Get API documentation in JSON format.

**Response:**

```json
{
  "title": "CoinGecko API Documentation",
  "version": "1.0.0",
  "description": "Complete REST API for CoinGecko cryptocurrency data",
  "endpoints": {
    "GET /": "Service information and available endpoints",
    "GET /health": "Health check with service statistics",
    "GET /api/coins": "Get all coins (query: ?symbol=BTC&name=Bitcoin&limit=100)",
    "GET /api/search/:query": "Search coins by name, symbol, or ID (query: ?limit=50)",
    "GET /api/coin/:coinId": "Get specific coin information with price (query: ?detailed=true)",
    "GET /api/prices": "Get current prices for tracked coins",
    "GET /api/trending": "Get trending coins",
    "GET /api/top": "Get top coins by market cap (query: ?limit=10&currency=usd)",
    "GET /api/koge": "Find KOGE Alpha token specifically",
    "GET /api/contract/:address": "Find coin by contract address (query: ?platform=binance-smart-chain)",
    "GET /api/docs": "This documentation"
  },
  "examples": {
    "searchBitcoin": "/api/search/bitcoin",
    "getBitcoinInfo": "/api/coin/bitcoin",
    "getTopCoins": "/api/top?limit=5",
    "findKoge": "/api/koge",
    "contractLookup": "/api/contract/0xe6df05ce8c8301223373cf5b969afcb1498c5528"
  },
  "rateLimit": "50 calls per minute (CoinGecko free tier)",
  "notes": [
    "All prices are in USD unless specified",
    "Rate limiting is automatically handled",
    "Contract address lookup supports multiple platforms"
  ]
}
```

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes:**

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (coin not found)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

## Rate Limiting

- **CoinGecko Free Tier**: 50 calls per minute
- **Automatic Handling**: 1.1 second delay between requests
- **Error Handling**: Rate limit errors are caught and reported

## Running the APIs

### Option 1: CoinGecko Only

```bash
npm run coingecko
# Runs on http://localhost:10001
```

### Option 2: Binance Only (Original)

```bash
npm start
# Runs on http://localhost:10000
```

### Option 3: Both APIs Together

```bash
npm run both
# Binance: http://localhost:10000
# CoinGecko: http://localhost:10001
```

## KOGE Alpha Token Workflow

Your KOGE Alpha token can be found through multiple methods:

### 1. Direct KOGE Search

```bash
curl "http://localhost:10001/api/koge"
```

### 2. Contract Address Lookup

```bash
curl "http://localhost:10001/api/contract/0xe6df05ce8c8301223373cf5b969afcb1498c5528"
```

### 3. General Search

```bash
curl "http://localhost:10001/api/search/koge"
```

### 4. Get Detailed Information

```bash
# If KOGE is found, get detailed info
curl "http://localhost:10001/api/coin/bnb48-club-token?detailed=true"
```

## Comparison: Binance vs CoinGecko

| Feature           | Binance API (Port 10000) | CoinGecko API (Port 10001) |
| ----------------- | ------------------------ | -------------------------- |
| **Coin Coverage** | ~3,200 trading pairs     | ~15,000 cryptocurrencies   |
| **KOGE Alpha**    | Custom symbol only       | Native search + contract   |
| **Price Updates** | Every 2 seconds          | Every 5 seconds            |
| **Rate Limits**   | 1200/minute              | 50/minute                  |
| **Market Data**   | Trading focus            | Comprehensive              |
| **Best For**      | Active trading pairs     | Research & discovery       |

## Use Cases

### 1. Find Your Alpha Token

```bash
# Check both APIs for KOGE
curl "http://localhost:10000/api/search/KOGE"  # Binance (custom)
curl "http://localhost:10001/api/koge"         # CoinGecko (native)
```

### 2. Compare Prices

```bash
# Binance trading price
curl "http://localhost:10000/api/symbol/BTCUSDT"

# CoinGecko market price
curl "http://localhost:10001/api/coin/bitcoin"
```

### 3. Research New Coins

```bash
# Trending coins
curl "http://localhost:10001/api/trending"

# Top performers
curl "http://localhost:10001/api/top?limit=10"
```

### 4. Contract Address Verification

```bash
# Verify token contract
curl "http://localhost:10001/api/contract/0xe6df05ce8c8301223373cf5b969afcb1498c5528"
```

## Notes

- **Data Sources**: CoinGecko aggregates from 600+ exchanges
- **Real-time Updates**: Prices updated every 5 seconds during monitoring
- **Comprehensive Coverage**: Includes DeFi tokens, NFTs, and new projects
- **Alpha Token Support**: Native support for finding new/unlisted tokens
- **Platform Support**: Multi-chain contract address lookup
