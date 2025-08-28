# Binance Symbol API Documentation

## Overview

This REST API provides comprehensive cryptocurrency symbol lookup, search, and price monitoring capabilities. It combines real-time Binance data with the ability to add custom tokens (like Alpha tokens not listed on Binance).

## Base URL

```
http://localhost:10000
```

## Authentication

No authentication required for this API.

## API Endpoints

### 1. Service Information

#### `GET /`

Get service information and available endpoints.

**Response:**

```json
{
  "status": "running",
  "service": "Binance Price Monitor & Symbol API",
  "uptime": 123.45,
  "timestamp": "2025-08-28T16:36:09.385Z",
  "tracking": ["BTCUSDT", "ETHUSDT", "BNBUSDT", "DOGEUSDT"],
  "endpoints": {
    "health": "GET /",
    "symbols": "GET /api/symbols",
    "search": "GET /api/search/:query",
    "symbol": "GET /api/symbol/:symbol",
    "prices": "GET /api/prices",
    "coin": "GET /api/coin/:coin"
  }
}
```

### 2. Health Check

#### `GET /health`

Get detailed health check with service statistics.

**Response:**

```json
{
  "status": "running",
  "service": "Binance Price Monitor",
  "uptime": 123.45,
  "timestamp": "2025-08-28T16:36:09.385Z",
  "tracking": ["BTCUSDT", "ETHUSDT", "BNBUSDT", "DOGEUSDT"],
  "stats": {
    "totalSymbols": 3221,
    "lastUpdate": "2025-08-28T16:35:20.123Z",
    "customSymbols": 1,
    "uniqueBaseAssets": 500,
    "uniqueQuoteAssets": 15
  }
}
```

### 3. Get All Symbols

#### `GET /api/symbols`

Get all available trading symbols with optional filtering.

**Query Parameters:**

- `quote` (optional) - Filter by quote asset (e.g., USDT, BTC)
- `base` (optional) - Filter by base asset (e.g., BTC, ETH)
- `limit` (optional, default: 100) - Limit number of results

**Examples:**

```bash
# Get first 10 symbols
curl "http://localhost:10000/api/symbols?limit=10"

# Get all USDT pairs
curl "http://localhost:10000/api/symbols?quote=USDT&limit=20"

# Get all BTC pairs
curl "http://localhost:10000/api/symbols?base=BTC"
```

**Response:**

```json
{
  "success": true,
  "total": 227,
  "returned": 10,
  "symbols": [
    {
      "symbol": "BTCUSDT",
      "baseAsset": "BTC",
      "quoteAsset": "USDT",
      "pair": "BTC/USDT",
      "status": "TRADING",
      "permissions": []
    }
  ]
}
```

### 4. Search Symbols

#### `GET /api/search/:query`

Search symbols by name, symbol, or pair.

**Path Parameters:**

- `query` (required) - Search term (minimum 2 characters)

**Query Parameters:**

- `limit` (optional, default: 50) - Limit number of results

**Examples:**

```bash
# Search for BTC-related symbols
curl "http://localhost:10000/api/search/BTC"

# Search for KOGE
curl "http://localhost:10000/api/search/KOGE"

# Search with limit
curl "http://localhost:10000/api/search/ETH?limit=10"
```

**Response:**

```json
{
  "success": true,
  "query": "BTC",
  "total": 227,
  "returned": 50,
  "symbols": [
    {
      "symbol": "BTCUSDT",
      "baseAsset": "BTC",
      "quoteAsset": "USDT",
      "pair": "BTC/USDT",
      "status": "TRADING",
      "permissions": []
    }
  ]
}
```

### 5. Get Specific Symbol

#### `GET /api/symbol/:symbol`

Get detailed information about a specific symbol including current price.

**Path Parameters:**

- `symbol` (required) - Symbol name (e.g., BTCUSDT, BTC, KOGE)

**Examples:**

```bash
# Get BTCUSDT information with current price
curl "http://localhost:10000/api/symbol/BTCUSDT"

# Get custom KOGE token information
curl "http://localhost:10000/api/symbol/KOGEUSDT"

# Search by base asset
curl "http://localhost:10000/api/symbol/BTC"
```

**Response:**

```json
{
  "success": true,
  "symbol": {
    "symbol": "BTCUSDT",
    "baseAsset": "BTC",
    "quoteAsset": "USDT",
    "pair": "BTC/USDT",
    "status": "TRADING",
    "permissions": []
  },
  "currentPrice": "112812.63000000"
}
```

**Custom Token Response:**

```json
{
  "success": true,
  "symbol": {
    "symbol": "KOGEUSDT",
    "baseAsset": "KOGE",
    "quoteAsset": "USDT",
    "pair": "KOGE/USDT",
    "status": "CUSTOM",
    "permissions": ["CUSTOM"],
    "isCustom": true,
    "name": "KOGE Alpha Token"
  },
  "currentPrice": null
}
```

### 6. Get Current Prices

#### `GET /api/prices`

Get current prices for all tracked symbols in the cron job.

**Response:**

```json
{
  "success": true,
  "timestamp": "2025-08-28T16:36:09.385Z",
  "symbols": ["BTCUSDT", "ETHUSDT", "BNBUSDT", "DOGEUSDT"],
  "prices": [
    {
      "symbol": "BTCUSDT",
      "price": "112812.63000000"
    },
    {
      "symbol": "ETHUSDT",
      "price": "4516.23000000"
    }
  ]
}
```

### 7. Get Coin Pairs

#### `GET /api/coin/:coin`

Get all trading pairs for a specific coin.

**Path Parameters:**

- `coin` (required) - Coin symbol (e.g., BTC, ETH, KOGE)

**Examples:**

```bash
# Get all BTC trading pairs
curl "http://localhost:10000/api/coin/BTC"

# Get all ETH pairs
curl "http://localhost:10000/api/coin/ETH"

# Get KOGE pairs (including custom)
curl "http://localhost:10000/api/coin/KOGE"
```

**Response:**

```json
{
  "success": true,
  "coin": "BTC",
  "totalPairs": 227,
  "pairs": [
    {
      "symbol": "BTCUSDT",
      "baseAsset": "BTC",
      "quoteAsset": "USDT",
      "pair": "BTC/USDT",
      "status": "TRADING",
      "permissions": []
    }
  ]
}
```

### 8. Add Custom Symbol

#### `POST /api/symbol/custom`

Add a custom symbol (for tokens not available on Binance, like Alpha tokens).

**Request Body:**

```json
{
  "symbol": "KOGEUSDT",
  "baseAsset": "KOGE",
  "quoteAsset": "USDT",
  "name": "KOGE Alpha Token"
}
```

**Required Fields:**

- `symbol` - The full symbol name
- `baseAsset` - The base cryptocurrency

**Optional Fields:**

- `quoteAsset` - Quote currency (default: USDT)
- `name` - Descriptive name for the token

**Examples:**

```bash
# Add KOGE Alpha token
curl -X POST -H "Content-Type: application/json" \
  -d '{"symbol":"KOGEUSDT","baseAsset":"KOGE","quoteAsset":"USDT","name":"KOGE Alpha Token"}' \
  "http://localhost:10000/api/symbol/custom"

# Add another custom token
curl -X POST -H "Content-Type: application/json" \
  -d '{"symbol":"MYTOKEN","baseAsset":"MTK","name":"My Custom Token"}' \
  "http://localhost:10000/api/symbol/custom"
```

**Response:**

```json
{
  "success": true,
  "message": "Custom symbol added successfully",
  "symbol": {
    "symbol": "KOGEUSDT",
    "baseAsset": "KOGE",
    "quoteAsset": "USDT",
    "pair": "KOGE/USDT",
    "status": "CUSTOM",
    "permissions": ["CUSTOM"],
    "isCustom": true,
    "name": "KOGE Alpha Token"
  }
}
```

### 9. API Documentation

#### `GET /api/docs`

Get this API documentation in JSON format.

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
- `404` - Not Found (symbol not found)
- `500` - Internal Server Error

## Rate Limiting

Currently no rate limiting is implemented, but consider implementing it for production use.

## CORS

CORS is enabled for all origins (`*`).

## Data Sources

- **Binance Symbols**: Real-time data from Binance API
- **Prices**: Live prices from Binance ticker API
- **Custom Symbols**: Stored in memory (reset on server restart)

## Use Cases

### 1. Adding Your Alpha Token

Based on the URL you provided (`https://www.binance.com/en/alpha/bsc/0xe6df05ce8c8301223373cf5b969afcb1498c5528`), this appears to be a KOGE token. Here's how to add it:

```bash
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "symbol":"KOGEUSDT",
    "baseAsset":"KOGE",
    "quoteAsset":"USDT",
    "name":"KOGE Alpha Token - BSC Contract: 0xe6df05ce8c8301223373cf5b969afcb1498c5528"
  }' \
  "http://localhost:10000/api/symbol/custom"
```

### 2. Symbol Lookup Workflow

```bash
# 1. Search for your token
curl "http://localhost:10000/api/search/KOGE"

# 2. Get detailed information
curl "http://localhost:10000/api/symbol/KOGEUSDT"

# 3. Find all pairs for the coin
curl "http://localhost:10000/api/coin/KOGE"
```

### 3. Price Monitoring

```bash
# Get current prices for tracked symbols
curl "http://localhost:10000/api/prices"

# Get specific symbol with price
curl "http://localhost:10000/api/symbol/BTCUSDT"
```

## Notes

- Custom symbols don't have real-time price data since they're not on Binance
- Symbol data is cached for 1 hour to improve performance
- The service automatically handles Binance API rate limits
- Custom symbols are stored in memory and will be lost on server restart
