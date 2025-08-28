# Postman Collection Setup Guide

## 📥 Quick Import Instructions

### Method 1: Import Collection and Environment Files

1. **Download Files**:

   - [`Binance_Symbol_API.postman_collection.json`](Binance_Symbol_API.postman_collection.json)
   - [`Binance_Symbol_API.postman_environment.json`](Binance_Symbol_API.postman_environment.json)

2. **Import in Postman**:

   - Open Postman
   - Click **Import** button
   - Drag and drop both JSON files
   - Select **Binance Symbol API Environment** from environment dropdown

3. **Start Your Server**:

   ```bash
   npm start
   ```

4. **Test the Collection**:
   - Click on any request in the collection
   - Click **Send** to test

### Method 2: Manual Setup

If you prefer to set up manually, follow the detailed instructions in [`POSTMAN_COLLECTION.md`](POSTMAN_COLLECTION.md).

## 🚀 Quick Test Sequence

After importing, test these requests in order:

1. **Health Check**: `GET /health` - Verify server is running
2. **Service Info**: `GET /` - Get API overview
3. **Add KOGE Token**: `POST /api/symbol/custom` - Add your Alpha token
4. **Search KOGE**: `GET /api/search/KOGE` - Find your added token
5. **Get Prices**: `GET /api/prices` - Get current tracked prices

## 📊 Collection Structure

```
Binance Symbol API/
├── Service Information/
│   ├── Get Service Information
│   └── Health Check
├── Symbol Management/
│   ├── Get All Symbols
│   ├── Search Symbols - BTC
│   ├── Search Symbols - KOGE
│   ├── Get Specific Symbol - BTCUSDT
│   ├── Get Specific Symbol - KOGE
│   ├── Get Coin Pairs - BTC
│   └── Add Custom Symbol - KOGE Alpha
├── Price Information/
│   └── Get Current Prices
├── Documentation/
│   └── Get API Documentation
├── Advanced Examples/
│   ├── Get USDT Pairs Only
│   ├── Search ETH Symbols
│   ├── Get ETH Pairs
│   └── Add Another Custom Token
└── Error Testing/
    ├── Symbol Not Found
    ├── Search Too Short Query
    └── Invalid Custom Symbol Request
```

## 🔧 Environment Variables

The environment includes these pre-configured variables:

| Variable       | Value                    | Description               |
| -------------- | ------------------------ | ------------------------- |
| `baseUrl`      | `http://localhost:10000` | API base URL              |
| `port`         | `10000`                  | Server port               |
| `customSymbol` | `KOGEUSDT`               | Custom symbol for testing |
| `testCoin`     | `BTC`                    | Default coin for testing  |
| `searchQuery`  | `BTC`                    | Default search query      |
| `quoteAsset`   | `USDT`                   | Default quote asset       |
| `limit`        | `10`                     | Default response limit    |

## 🧪 Testing Features

### Automated Tests

Each request includes automated tests that verify:

- ✅ Status codes
- ✅ Response structure
- ✅ Required fields
- ✅ Data types
- ✅ Response times

### Error Testing

Dedicated error testing requests to verify:

- ❌ Invalid symbols (404 errors)
- ❌ Short search queries (400 errors)
- ❌ Missing required fields (400 errors)

### Global Scripts

- **Pre-request**: Logs request information
- **Tests**: Validates response times and logs errors

## 🪙 Testing Your KOGE Alpha Token

The collection includes a specific request to add your KOGE Alpha token:

**Request**: `POST /api/symbol/custom`
**Body**:

```json
{
  "symbol": "KOGEUSDT",
  "baseAsset": "KOGE",
  "quoteAsset": "USDT",
  "name": "KOGE Alpha Token - BSC Contract: 0xe6df05ce8c8301223373cf5b969afcb1498c5528"
}
```

After adding, you can:

1. Search for it: `GET /api/search/KOGE`
2. Get details: `GET /api/symbol/KOGEUSDT`
3. Find pairs: `GET /api/coin/KOGE`

## 🔄 Collection Runner

To test all endpoints automatically:

1. Right-click on **Binance Symbol API** collection
2. Select **Run collection**
3. Choose which requests to run
4. Click **Run Binance Symbol API**
5. View automated test results

## 📱 Mobile Testing

The collection works with Postman mobile app:

1. Sync collection to Postman cloud
2. Access from mobile app
3. Change `baseUrl` to your computer's IP if testing remotely

## 🚨 Troubleshooting

### Server Not Running

If you get connection errors:

```bash
# Start the server
npm start

# Verify it's running
curl http://localhost:10000/health
```

### Port Issues

If port 10000 is busy:

1. Change server port in `index.js`
2. Update `baseUrl` in Postman environment
3. Restart server

### Import Issues

If import fails:

1. Verify JSON file is valid
2. Try importing one file at a time
3. Check Postman version (v9+ recommended)

## 📖 Additional Resources

- **Complete API Documentation**: [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md)
- **Detailed Postman Guide**: [`POSTMAN_COLLECTION.md`](POSTMAN_COLLECTION.md)
- **Project README**: [`README.md`](README.md)

## 🎯 Pro Tips

1. **Use Variables**: Leverage environment variables for dynamic testing
2. **Check Tests Tab**: View automated test results after each request
3. **Use Console**: Check Postman console for debug information
4. **Save Responses**: Use response data in subsequent requests
5. **Organize**: Create your own folders for specific testing scenarios

Happy Testing! 🚀
