# Dynamic Interval Configuration Guide

## 🎯 **Easy Interval Changes - Multiple Methods**

Yes! I've made the intervals **completely dynamic and super easy to change**. You now have **5 different ways** to set custom intervals:

## 🚀 **Method 1: NPM Scripts (Easiest)**

```bash
# Predefined intervals for both APIs
npm run start:1s    # Both APIs: 1 second
npm run start:2s    # Both APIs: 2 seconds
npm run start:5s    # Both APIs: 5 seconds
npm run start:10s   # Both APIs: 10 seconds

# Individual API intervals
npm run binance:1s     # Binance only: 1 second
npm run coingecko:5s   # CoinGecko only: 5 seconds

# Preset configurations
npm run safe           # Binance: 2s, CoinGecko: 5s (recommended)
npm run quick          # Both: 1 second (fast)
npm run aggressive     # Binance: 1s, CoinGecko: 2s (may hit limits)
```

## ⚡ **Method 2: Environment Variables**

```bash
# Set custom intervals
BINANCE_INTERVAL=3 COINGECKO_INTERVAL=7 npm run both

# Individual servers
BINANCE_INTERVAL=1 npm start
COINGECKO_INTERVAL=10 npm run coingecko

# Persistent (add to your shell profile)
export BINANCE_INTERVAL=2
export COINGECKO_INTERVAL=5
npm run both
```

## 🔧 **Method 3: Configuration Script (Most Flexible)**

```bash
# Show current configuration
./config-intervals.sh show

# Quick start with same interval for both
./config-intervals.sh quick 3          # Both APIs: 3 seconds

# Start with specific intervals
./config-intervals.sh start both 1 10  # Binance: 1s, CoinGecko: 10s

# Change running server intervals (via API)
./config-intervals.sh change binance 5
./config-intervals.sh change coingecko 2

# Preset configurations
./config-intervals.sh safe             # Safe intervals
./config-intervals.sh aggressive       # Fast intervals
```

## 🎛️ **Method 4: Command Line Arguments**

```bash
# Override interval for specific server
node index.js --interval=1           # Binance: 1 second
node coingecko-server.js --interval=10  # CoinGecko: 10 seconds

# Combined with npm scripts
npm start -- --interval=3
npm run coingecko -- --interval=15
```

## 🌐 **Method 5: Runtime API (Change While Running!)**

```bash
# Change Binance interval to 5 seconds
curl -X POST -H "Content-Type: application/json" \
  -d '{"seconds":5}' \
  http://localhost:10000/api/config/interval

# Change CoinGecko interval to 10 seconds
curl -X POST -H "Content-Type: application/json" \
  -d '{"seconds":10}' \
  http://localhost:10001/api/config/interval

# Check current configuration
curl http://localhost:10000/api/config
curl http://localhost:10001/api/config
```

## 📊 **Current Configuration Display**

```bash
# Show all current settings
npm run config

# Or use the script
./config-intervals.sh show
```

**Example Output:**

```
📊 Current Configuration:
   Binance API:   2 seconds
   CoinGecko API: 5 seconds

🧪 Testing Binance API configuration...
✅ Binance API is running
   Interval: 2s
   Calls/min: 30

🧪 Testing CoinGecko API configuration...
✅ CoinGecko API is running
   Interval: 5s
   Calls/min: 12
```

## ⚠️ **Rate Limit Guidelines**

| API           | Free Tier Limit | Safe Minimum | Recommended | Max Safe |
| ------------- | --------------- | ------------ | ----------- | -------- |
| **Binance**   | 1,200/min       | 0.05s        | 2s+         | 1s       |
| **CoinGecko** | 50/min          | 1.2s         | 5s+         | 2s       |

## 🎯 **Quick Examples for Your Use Cases**

### **Real-time Trading (Aggressive)**

```bash
npm run aggressive  # Binance: 1s, CoinGecko: 2s
```

### **Regular Monitoring (Balanced)**

```bash
npm run safe        # Binance: 2s, CoinGecko: 5s
```

### **Slow Monitoring (Conservative)**

```bash
npm run start:10s   # Both: 10 seconds
```

### **Custom Intervals**

```bash
# Binance every 1s, CoinGecko every 30s
BINANCE_INTERVAL=1 COINGECKO_INTERVAL=30 npm run both
```

### **Change While Running**

```bash
# Start with default
npm run both

# Change Binance to 1 second (in another terminal)
curl -X POST -H "Content-Type: application/json" \
  -d '{"seconds":1}' \
  http://localhost:10000/api/config/interval
```

## 🔄 **Priority Order (Highest to Lowest)**

1. **Command line arguments** (`--interval=N`)
2. **Environment variables** (`BINANCE_INTERVAL`, `COINGECKO_INTERVAL`)
3. **Default values** (Binance: 2s, CoinGecko: 5s)

## 📁 **Configuration Files**

- **[.env.example](file:///Users/aungmyatmoe/AMM/Work/Projects/Binance-Alert/.env.example)** - Example environment file
- **[config-intervals.sh](file:///Users/aungmyatmoe/AMM/Work/Projects/Binance-Alert/config-intervals.sh)** - Interactive configuration script
- **[package.json](file:///Users/aungmyatmoe/AMM/Work/Projects/Binance-Alert/package.json)** - Updated with interval scripts

## 🎉 **Summary**

**Yes, it's super easy to change intervals now!** You have **5 different methods** ranging from simple npm scripts to runtime API calls. Pick the method that works best for your workflow:

- **Quick testing**: `npm run start:1s`
- **Production**: `npm run safe`
- **Custom needs**: `BINANCE_INTERVAL=3 npm run both`
- **While running**: Use the API endpoints to change intervals dynamically

The system is now **completely flexible** and **developer-friendly**! 🚀
