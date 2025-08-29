const cron = require("node-cron")
const axios = require("axios")
const express = require("express")
const SymbolService = require("./symbolService")

// Initialize services
const symbolService = new SymbolService()
const app = express()

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Add CORS headers
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  )
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  next()
})

// Dynamic configuration with multiple sources
const getIntervalSeconds = () => {
  // Priority: Command line args > Environment variable > Default
  const args = process.argv.slice(2)
  const intervalArg = args.find((arg) => arg.startsWith("--interval="))

  if (intervalArg) {
    const seconds = parseInt(intervalArg.split("=")[1])
    if (seconds && seconds > 0) return seconds
  }

  if (process.env.BINANCE_INTERVAL) {
    const seconds = parseInt(process.env.BINANCE_INTERVAL)
    if (seconds && seconds > 0) return seconds
  }

  return 2 // Default 2 seconds
}

// Configuration
const config = {
  // Target cryptocurrency symbols (USDT pairs)
  // Note: KOGE is not available on Binance, using DOGE as alternative
  symbols: [
    "BTCUSDT", // Bitcoin
    "ETHUSDT", // Ethereum
    "BNBUSDT", // Binance Coin
    "DOGEUSDT", // Dogecoin (KOGE not available on Binance)
  ],
  binanceApi: {
    baseUrl: "https://api.binance.com",
    priceEndpoint: "/api/v3/ticker/price",
    timeout: 5000,
  },
  intervalSeconds: getIntervalSeconds(),
  get cronInterval() {
    return `*/${this.intervalSeconds} * * * * *` // Dynamic cron expression
  },
  port: process.env.PORT || 10000, // Port for Render web service
}

/**
 * Fetch latest prices from Binance API
 * @returns {Promise<Array>} Array of price objects
 */
async function fetchPrices() {
  try {
    console.log("🔄 Fetching latest prices...")

    // Create symbols parameter for API request
    const symbolsParam = config.symbols.map((symbol) => `"${symbol}"`).join(",")
    const url = `${config.binanceApi.baseUrl}${config.binanceApi.priceEndpoint}?symbols=[${symbolsParam}]`

    const response = await axios.get(url, {
      timeout: config.binanceApi.timeout,
      headers: {
        Accept: "application/json",
        "User-Agent": "BinanceAlert/1.0",
      },
    })

    return response.data
  } catch (error) {
    handleError(error)
    return []
  }
}

/**
 * Format and display prices in console
 * @param {Array} prices - Array of price objects from Binance API
 */
function displayPrices(prices) {
  if (!prices || prices.length === 0) {
    console.log("❌ No price data available")
    return
  }

  const timestamp = new Date().toLocaleTimeString()
  const date = new Date().toLocaleDateString()

  console.log(`\n📊 [${date} ${timestamp}] Latest Crypto Prices:`)
  console.log("=".repeat(50))

  prices.forEach(({ symbol, price }) => {
    const coin = symbol.replace("USDT", "")
    const formattedPrice = parseFloat(price).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 6,
    })

    console.log(`💰 ${coin.padEnd(6)}: ${formattedPrice}`)
  })

  console.log("=".repeat(50))
}

/**
 * Handle API errors
 * @param {Error} error - Error object
 */
function handleError(error) {
  const timestamp = new Date().toLocaleTimeString()

  console.error(`\n❌ [${timestamp}] Error occurred:`)

  if (error.response) {
    // API responded with error status
    console.error(
      `   Status: ${error.response.status} - ${error.response.statusText}`
    )
    console.error(
      `   Message: ${error.response.data?.msg || "Unknown API error"}`
    )

    if (error.response.status === 429) {
      console.error("   Rate limit exceeded. Please wait before retrying.")
    }
  } else if (error.request) {
    // Network error
    console.error("   Network error: Unable to reach Binance API")
    console.error("   Please check your internet connection")
  } else {
    // Other error
    console.error(`   Error: ${error.message}`)
  }

  console.error("-".repeat(50))
}

/**
 * REST API Routes
 */

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "running",
    service: "Binance Price Monitor & Symbol API",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    tracking: config.symbols,
    interval_seconds: config.intervalSeconds,
    cron_expression: config.cronInterval,
    endpoints: {
      health: "GET /",
      symbols: "GET /api/symbols",
      search: "GET /api/search/:query",
      symbol: "GET /api/symbol/:symbol",
      prices: "GET /api/prices",
      coin: "GET /api/coin/:coin",
      setInterval: "POST /api/config/interval",
    },
  })
})

app.get("/health", (req, res) => {
  res.json({
    status: "running",
    service: "Binance Price Monitor",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    tracking: config.symbols,
    interval_seconds: config.intervalSeconds,
    cron_expression: config.cronInterval,
    stats: symbolService.getStats(),
  })
})

// Dynamic interval configuration endpoint
app.post("/api/config/interval", (req, res) => {
  try {
    const { seconds } = req.body

    if (!seconds || seconds < 1 || seconds > 300) {
      return res.status(400).json({
        success: false,
        error: "Interval must be between 1 and 300 seconds",
        current_interval: config.intervalSeconds,
      })
    }

    const oldInterval = config.intervalSeconds
    config.intervalSeconds = seconds

    res.json({
      success: true,
      message: "Interval updated successfully",
      old_interval: oldInterval,
      new_interval: config.intervalSeconds,
      cron_expression: config.cronInterval,
      note: "Restart server for changes to take effect",
    })

    console.log(`📊 Interval changed from ${oldInterval}s to ${seconds}s`)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Get current configuration
app.get("/api/config", (req, res) => {
  res.json({
    success: true,
    config: {
      interval_seconds: config.intervalSeconds,
      cron_expression: config.cronInterval,
      port: config.port,
      tracking_symbols: config.symbols,
      rate_limit_info: {
        binance_rate_limit: "1200 calls per minute",
        current_calls_per_minute: Math.round(60 / config.intervalSeconds),
        safe_minimum_interval: "0.05 seconds (20 per second max)",
      },
    },
  })
})

// Get all symbols
app.get("/api/symbols", async (req, res) => {
  try {
    const { quote, base, limit = 100 } = req.query

    const filter = {}
    if (quote) filter.quoteAsset = quote
    if (base) filter.baseAsset = base

    const symbols = await symbolService.getAllSymbols(filter)
    const limitedSymbols = symbols.slice(0, parseInt(limit))

    res.json({
      success: true,
      total: symbols.length,
      returned: limitedSymbols.length,
      symbols: limitedSymbols,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Search symbols
app.get("/api/search/:query", async (req, res) => {
  try {
    const { query } = req.params
    const { limit = 50 } = req.query

    if (!query || query.length < 2) {
      return res.status(400).json({
        success: false,
        error: "Query must be at least 2 characters long",
      })
    }

    const results = await symbolService.searchSymbols(query)
    const limitedResults = results.slice(0, parseInt(limit))

    res.json({
      success: true,
      query,
      total: results.length,
      returned: limitedResults.length,
      symbols: limitedResults,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Get specific symbol information
app.get("/api/symbol/:symbol", async (req, res) => {
  try {
    const { symbol } = req.params
    const symbolInfo = await symbolService.getSymbol(symbol)

    if (!symbolInfo) {
      return res.status(404).json({
        success: false,
        error: `Symbol '${symbol}' not found`,
      })
    }

    // Try to get current price
    let price = null
    if (!symbolInfo.isCustom) {
      const prices = await symbolService.getSymbolPrices([symbolInfo.symbol])
      if (prices.length > 0) {
        price = prices[0].price
      }
    }

    res.json({
      success: true,
      symbol: symbolInfo,
      currentPrice: price,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Get current prices for tracked symbols
app.get("/api/prices", async (req, res) => {
  try {
    const prices = await fetchPrices()

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      symbols: config.symbols,
      prices: prices,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Get all pairs for a specific coin
app.get("/api/coin/:coin", async (req, res) => {
  try {
    const { coin } = req.params
    const pairs = await symbolService.getCoinPairs(coin)

    if (pairs.length === 0) {
      return res.status(404).json({
        success: false,
        error: `No trading pairs found for '${coin}'`,
      })
    }

    res.json({
      success: true,
      coin: coin.toUpperCase(),
      totalPairs: pairs.length,
      pairs: pairs,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Add custom symbol (for tokens not on Binance like your Alpha token)
app.post("/api/symbol/custom", (req, res) => {
  try {
    const { symbol, baseAsset, quoteAsset = "USDT", name } = req.body

    if (!symbol || !baseAsset) {
      return res.status(400).json({
        success: false,
        error: "Symbol and baseAsset are required",
      })
    }

    const customSymbol = symbolService.addCustomSymbol(
      symbol,
      baseAsset,
      quoteAsset
    )
    if (name) {
      customSymbol.name = name
    }

    res.json({
      success: true,
      message: "Custom symbol added successfully",
      symbol: customSymbol,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// API documentation
app.get("/api/docs", (req, res) => {
  res.json({
    title: "Binance Symbol API Documentation",
    version: "1.0.0",
    endpoints: {
      "GET /": "Service information and available endpoints",
      "GET /health": "Health check with service statistics",
      "GET /api/symbols":
        "Get all trading symbols (query: ?quote=USDT&base=BTC&limit=100)",
      "GET /api/search/:query":
        "Search symbols by name or symbol (query: ?limit=50)",
      "GET /api/symbol/:symbol":
        "Get specific symbol information with current price",
      "GET /api/prices": "Get current prices for tracked symbols",
      "GET /api/coin/:coin": "Get all trading pairs for a specific coin",
      "POST /api/symbol/custom":
        "Add custom symbol (body: {symbol, baseAsset, quoteAsset?, name?})",
      "GET /api/docs": "This documentation",
    },
    examples: {
      searchBTC: "/api/search/BTC",
      getBTCPairs: "/api/coin/BTC",
      getSymbolInfo: "/api/symbol/BTCUSDT",
      getAllUSDTPairs: "/api/symbols?quote=USDT&limit=10",
    },
  })
})

/**
 * Create Express server
 */
function createWebServer() {
  // Initialize symbol service
  symbolService.updateSymbols().catch(console.error)

  // Add your custom Alpha token here
  // Based on the URL you provided, this seems to be KOGE token
  symbolService.addCustomSymbol("KOGEUSDT", "KOGE", "USDT")

  const server = app.listen(config.port, () => {
    console.log(`🌐 Express server running on port ${config.port}`)
    console.log(
      `📡 API Documentation: http://localhost:${config.port}/api/docs`
    )
    console.log(
      `🔍 Symbol Search Example: http://localhost:${config.port}/api/search/BTC`
    )
    console.log(`💰 Current Prices: http://localhost:${config.port}/api/prices`)
  })

  return server
}

/**
 * Initialize and start the price monitoring service
 */
function initializePriceMonitor() {
  console.log("🚀 Binance Price Monitor & Symbol API Starting...")
  console.log("📋 Requested: BTC, ETH, BNB, KOGE (alpha)")
  console.log("⚠️  Note: KOGE not available on Binance - using DOGE instead")
  console.log("➕ Added KOGE as custom symbol for your reference")
  console.log(`📈 Tracking: ${config.symbols.join(", ")}`)
  console.log(`⏰ Update interval: Every 2 seconds`)
  console.log(`🌐 API: ${config.binanceApi.baseUrl}`)
  console.log(`🚀 REST API: http://localhost:${config.port}/api/docs`)
  console.log("-".repeat(50))

  // Create web server for Render deployment
  const server = createWebServer()

  // Schedule cron job to run every 2 seconds
  const task = cron.schedule(
    config.cronInterval,
    async () => {
      try {
        const prices = await fetchPrices()
        displayPrices(prices)
      } catch (error) {
        handleError(error)
      }
    },
    {
      scheduled: false, // Don't start immediately
    }
  )

  // Start the scheduled task
  task.start()
  console.log("✅ Price monitor started successfully!")
  console.log("💡 Press Ctrl+C to stop the monitor\n")

  // Initial fetch
  setTimeout(async () => {
    const prices = await fetchPrices()
    displayPrices(prices)
  }, 1000)
}

/**
 * Graceful shutdown handler
 */
function setupGracefulShutdown() {
  process.on("SIGINT", () => {
    console.log("\n\n🛑 Received SIGINT. Shutting down gracefully...")
    console.log("👋 Binance Price Monitor stopped")
    process.exit(0)
  })

  process.on("SIGTERM", () => {
    console.log("\n\n🛑 Received SIGTERM. Shutting down gracefully...")
    console.log("👋 Binance Price Monitor stopped")
    process.exit(0)
  })
}

// Start the application
if (require.main === module) {
  setupGracefulShutdown()
  initializePriceMonitor()
}

module.exports = {
  fetchPrices,
  displayPrices,
  handleError,
  config,
}
