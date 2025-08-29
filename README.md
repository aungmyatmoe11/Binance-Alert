# Binance Alert - Cryptocurrency Price Monitor & Symbol API

A comprehensive Node.js application that monitors cryptocurrency prices using **both Binance and CoinGecko APIs** with cron jobs and provides complete REST APIs for symbol lookup and management.

## 🚀 Features

- ⏰ Real-time price monitoring every 2 seconds (Binance) / 5 seconds (CoinGecko)
- 📊 Track top cryptocurrencies (BTC, ETH, BNB, DOGE)
- 🔍 **Dual API Support**: Binance (3,200+ pairs) + CoinGecko (15,000+ coins)
- 📋 Search and filter cryptocurrency symbols
- 💰 Get current prices with symbol information
- ➕ Add custom tokens (like Alpha tokens not on Binance)
- 🪙 **KOGE Alpha Token Support**: Native CoinGecko search + contract lookup
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

## 🏃‍♂️ Running Options

You now have multiple ways to run the application:

### Option 1: Binance API Only (Original)

```bash
npm start
# Runs on http://localhost:10000
```

### Option 2: CoinGecko API Only

```bash
npm run coingecko
# Runs on http://localhost:10001
```

### Option 3: Both APIs Together (Recommended)

```bash
npm run both
# Binance: http://localhost:10000
# CoinGecko: http://localhost:10001
```

Each option will:

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

**Binance API (Port 10000) - Trading Focus:**

```bash
# Get API documentation
curl http://localhost:10000/api/docs

# Search for BTC trading pairs
curl "http://localhost:10000/api/search/BTC"

# Get BTCUSDT with current trading price
curl "http://localhost:10000/api/symbol/BTCUSDT"

# Add custom token (for tokens not on Binance)
curl -X POST -H "Content-Type: application/json" \
  -d '{"symbol":"KOGEUSDT","baseAsset":"KOGE","name":"KOGE Alpha Token"}' \
  "http://localhost:10000/api/symbol/custom"
```

**CoinGecko API (Port 10001) - Research Focus:**

```bash
# Get API documentation
curl http://localhost:10001/api/docs

# Search 15,000+ cryptocurrencies
curl "http://localhost:10001/api/search/bitcoin"

# Get Bitcoin with comprehensive market data
curl "http://localhost:10001/api/coin/bitcoin?detailed=true"

# Find your KOGE Alpha token specifically
curl "http://localhost:10001/api/koge"

# Get top coins by market cap
curl "http://localhost:10001/api/top?limit=5"

# Find coin by contract address
curl "http://localhost:10001/api/contract/0xe6df05ce8c8301223373cf5b969afcb1498c5528"
```

### 📄 Complete API Documentation

**Binance API Documentation:**

- 📋 [Binance API Documentation](API_DOCUMENTATION.md) - Complete Binance API reference
- 🔍 3,200+ trading pairs from Binance exchange
- ⚡ Real-time trading data every 2 seconds
- 💰 Live trading prices and volumes

**CoinGecko API Documentation:**

- 🦎 [CoinGecko API Documentation](COINGECKO_API_DOCUMENTATION.md) - Complete CoinGecko API reference
- 🌍 15,000+ cryptocurrencies from 600+ exchanges
- 📈 Market data, rankings, and trends
- 🪙 Native KOGE Alpha token support
- 🔗 Contract address lookup

**Features Comparison:**
| Feature | Binance API | CoinGecko API |
|---------|-------------|---------------|
| **Coverage** | 3,200+ trading pairs | 15,000+ cryptocurrencies |
| **KOGE Alpha** | Custom symbol only | Native search + contract |
| **Update Speed** | Every 2 seconds | Every 5 seconds |
| **Best For** | Active trading | Research & discovery |

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

### 🪙 Your KOGE Alpha Token

Your KOGE Alpha token can now be found through **both APIs**:

**Method 1: CoinGecko Native Search (Recommended)**

```bash
# Direct KOGE search
curl "http://localhost:10001/api/koge"

# Search by contract address
curl "http://localhost:10001/api/contract/0xe6df05ce8c8301223373cf5b969afcb1498c5528"

# General search
curl "http://localhost:10001/api/search/koge"
```

**Method 2: Binance Custom Symbol**

```bash
# Add as custom symbol
curl -X POST -H "Content-Type: application/json" \
  -d '{
    "symbol":"KOGEUSDT",
    "baseAsset":"KOGE",
    "quoteAsset":"USDT",
    "name":"KOGE Alpha Token - BSC Contract: 0xe6df05ce8c8301223373cf5b969afcb1498c5528"
  }' \
  "http://localhost:10000/api/symbol/custom"

# Then search for it
curl "http://localhost:10000/api/search/KOGE"
```

**Why Both APIs?**

- **CoinGecko**: Better for research, finds real KOGE tokens, contract verification
- **Binance**: Better for trading, custom symbols, real-time trading data

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
