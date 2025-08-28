# Binance Symbol API - Postman Collection

## Collection Information

- **Collection Name**: Binance Symbol API
- **Base URL**: `http://localhost:10000`
- **Version**: 1.0.0
- **Description**: Complete REST API for Binance cryptocurrency symbol lookup and price monitoring

## Environment Variables

Create these variables in Postman Environment:

| Variable  | Value                    | Description  |
| --------- | ------------------------ | ------------ |
| `baseUrl` | `http://localhost:10000` | API base URL |
| `port`    | `10000`                  | Server port  |

## API Endpoints Collection

### 📁 Folder 1: Service Information

#### 1.1 Get Service Information

- **Method**: `GET`
- **URL**: `{{baseUrl}}/`
- **Description**: Get service information and available endpoints

**Headers**: None required

**Response Example**:

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

#### 1.2 Health Check

- **Method**: `GET`
- **URL**: `{{baseUrl}}/health`
- **Description**: Detailed health check with service statistics

**Headers**: None required

**Response Example**:

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

### 📁 Folder 2: Symbol Management

#### 2.1 Get All Symbols

- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/symbols`
- **Description**: Get all available trading symbols with optional filtering

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `quote` | string | No | - | Filter by quote asset (e.g., USDT, BTC) |
| `base` | string | No | - | Filter by base asset (e.g., BTC, ETH) |
| `limit` | integer | No | 100 | Limit number of results |

**Example URLs**:

- All symbols: `{{baseUrl}}/api/symbols`
- USDT pairs: `{{baseUrl}}/api/symbols?quote=USDT&limit=20`
- BTC pairs: `{{baseUrl}}/api/symbols?base=BTC`
- Combined: `{{baseUrl}}/api/symbols?quote=USDT&limit=10`

**Headers**: None required

**Response Example**:

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
    },
    {
      "symbol": "ETHUSDT",
      "baseAsset": "ETH",
      "quoteAsset": "USDT",
      "pair": "ETH/USDT",
      "status": "TRADING",
      "permissions": []
    }
  ]
}
```

#### 2.2 Search Symbols

- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/search/{{query}}`
- **Description**: Search symbols by name, symbol, or pair

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `query` | string | Yes | Search term (minimum 2 characters) |

**Query Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `limit` | integer | No | 50 | Limit number of results |

**Example URLs**:

- Search BTC: `{{baseUrl}}/api/search/BTC`
- Search ETH: `{{baseUrl}}/api/search/ETH?limit=10`
- Search KOGE: `{{baseUrl}}/api/search/KOGE`

**Headers**: None required

**Response Example**:

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

#### 2.3 Get Specific Symbol

- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/symbol/{{symbol}}`
- **Description**: Get detailed information about a specific symbol including current price

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `symbol` | string | Yes | Symbol name (e.g., BTCUSDT, BTC, KOGE) |

**Example URLs**:

- Get BTCUSDT: `{{baseUrl}}/api/symbol/BTCUSDT`
- Get BTC info: `{{baseUrl}}/api/symbol/BTC`
- Get KOGE: `{{baseUrl}}/api/symbol/KOGEUSDT`

**Headers**: None required

**Response Example (Binance Symbol)**:

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

**Response Example (Custom Symbol)**:

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

#### 2.4 Get Coin Pairs

- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/coin/{{coin}}`
- **Description**: Get all trading pairs for a specific coin

**Path Parameters**:
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `coin` | string | Yes | Coin symbol (e.g., BTC, ETH, KOGE) |

**Example URLs**:

- BTC pairs: `{{baseUrl}}/api/coin/BTC`
- ETH pairs: `{{baseUrl}}/api/coin/ETH`
- KOGE pairs: `{{baseUrl}}/api/coin/KOGE`

**Headers**: None required

**Response Example**:

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
    },
    {
      "symbol": "BTCBUSD",
      "baseAsset": "BTC",
      "quoteAsset": "BUSD",
      "pair": "BTC/BUSD",
      "status": "TRADING",
      "permissions": []
    }
  ]
}
```

#### 2.5 Add Custom Symbol

- **Method**: `POST`
- **URL**: `{{baseUrl}}/api/symbol/custom`
- **Description**: Add a custom symbol (for tokens not available on Binance)

**Headers**:

```
Content-Type: application/json
```

**Request Body** (JSON):

```json
{
  "symbol": "KOGEUSDT",
  "baseAsset": "KOGE",
  "quoteAsset": "USDT",
  "name": "KOGE Alpha Token"
}
```

**Body Parameters**:
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `symbol` | string | Yes | - | The full symbol name |
| `baseAsset` | string | Yes | - | The base cryptocurrency |
| `quoteAsset` | string | No | USDT | Quote currency |
| `name` | string | No | - | Descriptive name for the token |

**Example Request Bodies**:

1. **KOGE Alpha Token**:

```json
{
  "symbol": "KOGEUSDT",
  "baseAsset": "KOGE",
  "quoteAsset": "USDT",
  "name": "KOGE Alpha Token - BSC Contract: 0xe6df05ce8c8301223373cf5b969afcb1498c5528"
}
```

2. **Simple Custom Token**:

```json
{
  "symbol": "MYTOKEN",
  "baseAsset": "MTK",
  "name": "My Custom Token"
}
```

**Response Example**:

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
    "name": "KOGE Alpha Token - BSC Contract: 0xe6df05ce8c8301223373cf5b969afcb1498c5528"
  }
}
```

### 📁 Folder 3: Price Information

#### 3.1 Get Current Prices

- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/prices`
- **Description**: Get current prices for all tracked symbols in the cron job

**Headers**: None required

**Response Example**:

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
    },
    {
      "symbol": "BNBUSDT",
      "price": "868.72000000"
    },
    {
      "symbol": "DOGEUSDT",
      "price": "0.22252000"
    }
  ]
}
```

### 📁 Folder 4: Documentation

#### 4.1 Get API Documentation

- **Method**: `GET`
- **URL**: `{{baseUrl}}/api/docs`
- **Description**: Get API documentation in JSON format

**Headers**: None required

**Response Example**:

```json
{
  "title": "Binance Symbol API Documentation",
  "version": "1.0.0",
  "endpoints": {
    "GET /": "Service information and available endpoints",
    "GET /health": "Health check with service statistics",
    "GET /api/symbols": "Get all trading symbols (query: ?quote=USDT&base=BTC&limit=100)",
    "GET /api/search/:query": "Search symbols by name or symbol (query: ?limit=50)",
    "GET /api/symbol/:symbol": "Get specific symbol information with current price",
    "GET /api/prices": "Get current prices for tracked symbols",
    "GET /api/coin/:coin": "Get all trading pairs for a specific coin",
    "POST /api/symbol/custom": "Add custom symbol (body: {symbol, baseAsset, quoteAsset?, name?})",
    "GET /api/docs": "This documentation"
  },
  "examples": {
    "searchBTC": "/api/search/BTC",
    "getBTCPairs": "/api/coin/BTC",
    "getSymbolInfo": "/api/symbol/BTCUSDT",
    "getAllUSDTPairs": "/api/symbols?quote=USDT&limit=10"
  }
}
```

## Error Responses

All endpoints return errors in this standardized format:

**Error Response Structure**:

```json
{
  "success": false,
  "error": "Error message here"
}
```

**Common HTTP Status Codes**:

- `200` - Success
- `400` - Bad Request (invalid parameters)
- `404` - Not Found (symbol not found)
- `500` - Internal Server Error

**Example Error Responses**:

1. **Symbol Not Found (404)**:

```json
{
  "success": false,
  "error": "Symbol 'INVALIDTOKEN' not found"
}
```

2. **Bad Request (400)**:

```json
{
  "success": false,
  "error": "Query must be at least 2 characters long"
}
```

3. **Missing Required Fields (400)**:

```json
{
  "success": false,
  "error": "Symbol and baseAsset are required"
}
```

## Postman Collection JSON

### Collection Variables

```json
{
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:10000",
      "type": "string"
    }
  ]
}
```

### Pre-request Scripts

**For all requests, add this pre-request script**:

```javascript
// Check if server is running
pm.sendRequest(
  {
    url: pm.variables.get("baseUrl") + "/health",
    method: "GET",
  },
  function (err, response) {
    if (err || response.code !== 200) {
      console.log(
        "⚠️ Server might not be running. Please start with: npm start"
      )
    } else {
      console.log("✅ Server is running")
    }
  }
)
```

### Tests Scripts

**For GET requests, add this test script**:

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200)
})

pm.test("Response is JSON", function () {
  pm.response.to.be.json
})

pm.test("Response has success field", function () {
  var jsonData = pm.response.json()
  pm.expect(jsonData).to.have.property("success")
})

// Store symbol data for other requests
if (pm.response.json().symbol) {
  pm.globals.set("lastSymbol", pm.response.json().symbol.symbol)
}
```

**For POST requests (Add Custom Symbol), add this test script**:

```javascript
pm.test("Status code is 200", function () {
  pm.response.to.have.status(200)
})

pm.test("Symbol added successfully", function () {
  var jsonData = pm.response.json()
  pm.expect(jsonData.success).to.be.true
  pm.expect(jsonData.symbol).to.have.property("isCustom", true)
})

// Store custom symbol for other tests
pm.globals.set("customSymbol", pm.response.json().symbol.symbol)
```

## Usage Workflow

### 1. Basic Workflow

1. **Start Server**: Run `npm start` in your terminal
2. **Check Health**: Test `GET /health` to ensure server is running
3. **Explore Symbols**: Use `GET /api/symbols?limit=10` to see available symbols
4. **Search**: Use `GET /api/search/BTC` to find specific symbols
5. **Get Prices**: Use `GET /api/symbol/BTCUSDT` to get symbol with price

### 2. Adding Your Alpha Token Workflow

1. **Add KOGE Token**: Use `POST /api/symbol/custom` with KOGE data
2. **Verify Addition**: Use `GET /api/search/KOGE` to find your token
3. **Get Token Info**: Use `GET /api/symbol/KOGEUSDT` to see details
4. **Find Pairs**: Use `GET /api/coin/KOGE` to see all KOGE pairs

### 3. Price Monitoring Workflow

1. **Current Prices**: Use `GET /api/prices` for tracked symbols
2. **Specific Price**: Use `GET /api/symbol/BTCUSDT` for individual price
3. **Monitor Multiple**: Create collection runner for multiple symbols

## Import Instructions

### Method 1: Manual Creation

1. Open Postman
2. Create new Collection: "Binance Symbol API"
3. Add folders: "Service Information", "Symbol Management", "Price Information", "Documentation"
4. Add requests as documented above

### Method 2: JSON Import

1. Copy the collection JSON structure
2. In Postman: File → Import → Raw Text
3. Paste the JSON structure
4. Configure environment variables

## Testing Your Alpha Token

**Step-by-step test for your KOGE Alpha token**:

1. **Add KOGE Token**:

   - Method: POST
   - URL: `{{baseUrl}}/api/symbol/custom`
   - Body:

   ```json
   {
     "symbol": "KOGEUSDT",
     "baseAsset": "KOGE",
     "quoteAsset": "USDT",
     "name": "KOGE Alpha Token - BSC Contract: 0xe6df05ce8c8301223373cf5b969afcb1498c5528"
   }
   ```

2. **Verify KOGE was added**:

   - Method: GET
   - URL: `{{baseUrl}}/api/search/KOGE`

3. **Get KOGE details**:
   - Method: GET
   - URL: `{{baseUrl}}/api/symbol/KOGEUSDT`

This collection provides complete testing coverage for all API endpoints and is ready to import into Postman for immediate use!
