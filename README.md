# Binance Alert - Cryptocurrency Price Monitor & Symbol API

A comprehensive Node.js application that monitors cryptocurrency prices from Binance API using cron jobs and provides a complete REST API for symbol lookup and management.

## 🚀 Features

- ⏰ Real-time price monitoring every 2 seconds
- 📊 Track top cryptocurrencies (BTC, ETH, BNB, DOGE)
- 🔍 Comprehensive REST API for symbol lookup
- 📋 Search and filter cryptocurrency symbols
- 💰 Get current prices with symbol information
- ➕ Add custom tokens (like Alpha tokens not on Binance)
- 🖥️ Console logging for local development
- 🛡️ Error handling and graceful shutdown
- ☁️ Ready for Render deployment

## 📋 Prerequisites

- Node.js 18.0.0 or higher
- npm (comes with Node.js)
- Internet connection for Binance API access

## 🛠️ Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

## 🏃‍♂️ Running Locally

Start the price monitor:

```bash
npm start
```

The application will:

- Start monitoring prices every 2 seconds
- Display formatted price data in the console
- Handle API errors gracefully
- Continue running until stopped with Ctrl+C

### Sample Output

```
🚀 Binance Price Monitor Starting...
📋 Requested: BTC, ETH, BNB, KOGE (alpha)
⚠️  Note: KOGE not available on Binance - using DOGE instead
📈 Tracking: BTCUSDT, ETHUSDT, BNBUSDT, DOGEUSDT
⏰ Update interval: Every 2 seconds
🌐 API: https://api.binance.com
--------------------------------------------------
✅ Price monitor started successfully!
💡 Press Ctrl+C to stop the monitor

🌐 Web server running on port 10000
📡 Health check: http://localhost:10000/health

📊 [8/28/2025 11:16:45 PM] Latest Crypto Prices:
==================================================
💰 BTC   : $112,909.18
💰 ETH   : $4,516.23
💰 BNB   : $868.72
💰 DOGE  : $0.22252
==================================================
```

## 📚 REST API

The application includes a comprehensive REST API for cryptocurrency symbol lookup and management.

### 🔗 Quick API Examples

```bash
# Get API documentation
curl http://localhost:10000/api/docs

# Search for BTC-related symbols
curl "http://localhost:10000/api/search/BTC"

# Get specific symbol information with current price
curl "http://localhost:10000/api/symbol/BTCUSDT"

# Get all USDT trading pairs (limited to 10)
curl "http://localhost:10000/api/symbols?quote=USDT&limit=10"

# Get current prices for tracked symbols
curl "http://localhost:10000/api/prices"

# Add your Alpha token (KOGE)
curl -X POST -H "Content-Type: application/json" \
  -d '{"symbol":"KOGEUSDT","baseAsset":"KOGE","name":"KOGE Alpha Token"}' \
  "http://localhost:10000/api/symbol/custom"

# Search for your added KOGE token
curl "http://localhost:10000/api/search/KOGE"
```

### 📄 Complete API Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for comprehensive API documentation including:

- All available endpoints
- Request/response examples
- How to add custom tokens
- Error handling
- Use cases and workflows

### 📮 Postman Collection

Ready-to-use Postman collection for testing all API endpoints:

**Quick Import**:

1. Import [`Binance_Symbol_API.postman_collection.json`](Binance_Symbol_API.postman_collection.json)
2. Import [`Binance_Symbol_API.postman_environment.json`](Binance_Symbol_API.postman_environment.json)
3. Start server: `npm start`
4. Test any endpoint!

**Documentation**:

- 📋 [Postman Setup Guide](POSTMAN_SETUP.md) - Quick start
- 📚 [Complete Postman Documentation](POSTMAN_COLLECTION.md) - Full details

**Collection Features**:

- ✅ 25+ pre-built requests
- 🧪 Automated tests for all endpoints
- 🔧 Environment variables
- ❌ Error testing scenarios
- 📊 Response validation

### 🪙 Your Alpha Token

Based on the Binance Alpha URL you provided, this appears to be a KOGE token. Since it's not available on Binance spot trading, you can add it as a custom symbol:

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

## 🔧 Configuration

**Important Note about KOGE**: After checking Binance's available trading pairs, KOGE (alpha) is not currently listed on Binance. The application uses DOGE (Dogecoin) as an alternative.

The application tracks these cryptocurrencies:

- BTC (Bitcoin)
- ETH (Ethereum)
- BNB (Binance Coin)
- DOGE (Dogecoin) - _替代 KOGE，因为 KOGE 在币安不可用_

To modify the tracked cryptocurrencies, edit the `symbols` array in `index.js`:

```javascript
symbols: [
  "BTCUSDT", // Bitcoin
  "ETHUSDT", // Ethereum
  "BNBUSDT", // Binance Coin
  "DOGEUSDT", // Dogecoin
]
```

## 🌐 Deployment on Render

The application includes a built-in web server to meet Render's requirements for web services.

### 1. Prepare for Deployment

1. Push your code to a GitHub repository
2. The application is already configured with:
   - Web server on port 10000
   - Health check endpoint at `/health`
   - Render configuration in `render.yaml`

### 2. Deploy to Render

1. Go to [Render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `binance-alert` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free tier is sufficient

### 3. Environment Variables (Optional)

Add these on Render if needed:

- `NODE_ENV=production`
- `PORT=10000` (Render will set this automatically)

### 4. Deployment Features

- ✅ **Health Check**: Available at `/health` endpoint
- ✅ **Auto-restart**: Render will restart if the service goes down
- ✅ **Logs**: View real-time price monitoring in Render logs
- ✅ **Zero Configuration**: Ready to deploy as-is

## 🔄 How It Works

1. **Cron Job**: Runs every 2 seconds using node-cron
2. **API Call**: Fetches price data from Binance API
3. **Data Processing**: Formats and displays price information
4. **Error Handling**: Manages API errors and network issues
5. **Logging**: Outputs formatted data to console

## 📚 API Reference

The application uses Binance's public API:

- **Endpoint**: `https://api.binance.com/api/v3/ticker/price`
- **Rate Limit**: 1200 requests per minute
- **Documentation**: [Binance API Docs](https://binance-docs.github.io/apidocs/spot/en/)

## 🐛 Troubleshooting

### Common Issues

1. **Network Errors**: Check internet connection
2. **Rate Limiting**: Reduce frequency if hitting limits
3. **Symbol Not Found**: Verify cryptocurrency symbols exist on Binance

### Error Messages

- `❌ No price data available`: API returned empty response
- `Rate limit exceeded`: Too many requests, wait before retrying
- `Network error`: Unable to reach Binance API

## 📝 License

MIT License - feel free to use this project for your own purposes.

## 🤝 Contributing

Feel free to submit issues and enhancement requests!
