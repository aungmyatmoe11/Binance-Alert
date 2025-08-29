const cron = require("node-cron")
const axios = require("axios")
const express = require("express")
const CoinGeckoService = require("./coingeckoService")

// Initialize services
const coinGeckoService = new CoinGeckoService()
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

// Configuration
// Dynamic configuration with multiple sources
const getIntervalSeconds = () => {
  // Priority: Command line args > Environment variable > Default
  const args = process.argv.slice(2)
  const intervalArg = args.find((arg) => arg.startsWith("--interval="))

  if (intervalArg) {
    const seconds = parseInt(intervalArg.split("=")[1])
    if (seconds && seconds > 0) return seconds
  }

  if (process.env.COINGECKO_INTERVAL) {
    const seconds = parseInt(process.env.COINGECKO_INTERVAL)
    if (seconds && seconds > 0) return seconds
  }

  return 5 // Default 5 seconds
}

const config = {
  // Target cryptocurrency IDs for CoinGecko (using coin IDs instead of symbols)
  coinIds: [
    "bitcoin", // Bitcoin
    "ethereum", // Ethereum
    "binancecoin", // Binance Coin
    "dogecoin", // Dogecoin
  ],
  port: process.env.PORT || 10001, // Different port from Binance API
  intervalSeconds: getIntervalSeconds(),
  get cronInterval() {
    return `*/${this.intervalSeconds} * * * * *` // Dynamic cron expression
  },
}

/**
 * Fetch latest prices from CoinGecko API
 */
async function fetchCoinGeckoPrices() {
  try {
    console.log("🔄 Fetching latest prices from CoinGecko...")

    const prices = await coinGeckoService.getCoinPrices(config.coinIds, "usd")
    return prices
  } catch (error) {
    handleError(error)
    return {}
  }
}

/**
 * Format and display prices in console
 */
function displayCoinGeckoPrices(prices) {
  if (!prices || Object.keys(prices).length === 0) {
    console.log("❌ No CoinGecko price data available")
    return
  }

  const timestamp = new Date().toLocaleTimeString()
  const date = new Date().toLocaleDateString()

  console.log(`\n📊 [${date} ${timestamp}] CoinGecko Crypto Prices:`)
  console.log("=".repeat(60))

  Object.entries(prices).forEach(([coinId, data]) => {
    const price = data.usd
    const change24h = data.usd_24h_change || 0
    const changeSymbol = change24h >= 0 ? "📈" : "📉"
    const changeColor = change24h >= 0 ? "+" : ""

    const formattedPrice = parseFloat(price).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    })

    const coinName = coinId.charAt(0).toUpperCase() + coinId.slice(1)
    console.log(
      `💰 ${coinName.padEnd(
        12
      )}: ${formattedPrice} ${changeSymbol} ${changeColor}${change24h.toFixed(
        2
      )}%`
    )
  })

  console.log("=".repeat(60))
}

/**
 * Handle API errors
 */
function handleError(error) {
  const timestamp = new Date().toLocaleTimeString()

  console.error(`\n❌ [${timestamp}] CoinGecko Error occurred:`)

  if (error.response) {
    console.error(
      `   Status: ${error.response.status} - ${error.response.statusText}`
    )
    console.error(
      `   Message: ${error.response.data?.error || "Unknown API error"}`
    )

    if (error.response.status === 429) {
      console.error(
        "   Rate limit exceeded. CoinGecko free tier: 50 calls/minute"
      )
    }
  } else if (error.request) {
    console.error("   Network error: Unable to reach CoinGecko API")
    console.error("   Please check your internet connection")
  } else {
    console.error(`   Error: ${error.message}`)
  }

  console.error("-".repeat(50))
}

/**
 * REST API Routes for CoinGecko
 */

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "running",
    service: "CoinGecko Price Monitor & Coin API",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    tracking: config.coinIds,
    interval_seconds: config.intervalSeconds,
    cron_expression: config.cronInterval,
    endpoints: {
      health: "GET /",
      coins: "GET /api/coins",
      search: "GET /api/search/:query",
      coin: "GET /api/coin/:coinId",
      prices: "GET /api/prices",
      trending: "GET /api/trending",
      top: "GET /api/top",
      koge: "GET /api/koge",
      coinNames: "GET /api/coin-names",
      selectedPrices: "POST /api/selected-coins-prices",
      setInterval: "POST /api/config/interval",
    },
  })
})

app.get("/health", (req, res) => {
  res.json({
    status: "running",
    service: "CoinGecko Price Monitor",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    tracking: config.coinIds,
    interval_seconds: config.intervalSeconds,
    cron_expression: config.cronInterval,
    stats: coinGeckoService.getStats(),
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

    // Note: Cron job restart would be needed for this to take effect
    // For now, we'll just update the config

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
      tracking_coins: config.coinIds,
      rate_limit_info: {
        coingecko_free_tier: "50 calls per minute",
        recommended_min_interval: "1.2 seconds",
        current_calls_per_minute: Math.round(60 / config.intervalSeconds),
      },
    },
  })
})

// Get all coins
app.get("/api/coins", async (req, res) => {
  try {
    const { symbol, name, limit = 100 } = req.query

    const filter = {}
    if (symbol) filter.symbol = symbol
    if (name) filter.name = name

    const coins = await coinGeckoService.getAllCoins(filter)
    const limitedCoins = coins.slice(0, parseInt(limit))

    res.json({
      success: true,
      total: coins.length,
      returned: limitedCoins.length,
      coins: limitedCoins,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Search coins
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

    const results = await coinGeckoService.searchCoins(query)
    const limitedResults = results.slice(0, parseInt(limit))

    res.json({
      success: true,
      query,
      total: results.length,
      returned: limitedResults.length,
      coins: limitedResults,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Get specific coin information with price
app.get("/api/coin/:coinId", async (req, res) => {
  try {
    const { coinId } = req.params
    const { detailed = false } = req.query

    const coinInfo = await coinGeckoService.getCoin(coinId)

    if (!coinInfo) {
      return res.status(404).json({
        success: false,
        error: `Coin '${coinId}' not found`,
      })
    }

    let coinData = { ...coinInfo }

    // Get current price
    const prices = await coinGeckoService.getCoinPrices([coinInfo.id], "usd")
    if (prices[coinInfo.id]) {
      coinData.currentPrice = prices[coinInfo.id]
    }

    // Get detailed information if requested
    if (detailed === "true") {
      const details = await coinGeckoService.getCoinDetails(coinInfo.id)
      if (details) {
        coinData.details = {
          description: details.description?.en?.substring(0, 500) + "..." || "",
          marketCap: details.market_data?.market_cap?.usd || null,
          volume24h: details.market_data?.total_volume?.usd || null,
          circulatingSupply: details.market_data?.circulating_supply || null,
          totalSupply: details.market_data?.total_supply || null,
          maxSupply: details.market_data?.max_supply || null,
          homepage: details.links?.homepage?.[0] || null,
          blockchain_site:
            details.links?.blockchain_site?.filter(Boolean) || [],
          categories: details.categories || [],
        }
      }
    }

    res.json({
      success: true,
      coin: coinData,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Get current prices for tracked coins
app.get("/api/prices", async (req, res) => {
  try {
    const prices = await fetchCoinGeckoPrices()

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      coinIds: config.coinIds,
      prices: prices,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Get trending coins
app.get("/api/trending", async (req, res) => {
  try {
    const trending = await coinGeckoService.getTrendingCoins()

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      trending: trending,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Get top coins by market cap
app.get("/api/top", async (req, res) => {
  try {
    const { limit = 10, currency = "usd" } = req.query
    const topCoins = await coinGeckoService.getTopCoins(
      parseInt(limit),
      currency
    )

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      limit: parseInt(limit),
      currency,
      coins: topCoins,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Find KOGE specifically
app.get("/api/koge", async (req, res) => {
  try {
    const kogeCoins = await coinGeckoService.findKoge()

    // Also try to find by contract address
    const contractKoge = await coinGeckoService.findByContractAddress(
      "0xe6df05ce8c8301223373cf5b969afcb1498c5528",
      "binance-smart-chain"
    )

    // Combine results and remove duplicates
    const allKoge = [...kogeCoins, ...contractKoge]
    const uniqueKoge = allKoge.filter(
      (coin, index, self) => index === self.findIndex((c) => c.id === coin.id)
    )

    res.json({
      success: true,
      query: "KOGE Alpha Token",
      contractAddress: "0xe6df05ce8c8301223373cf5b969afcb1498c5528",
      found: uniqueKoge.length,
      coins: uniqueKoge,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Find coin by contract address
app.get("/api/contract/:address", async (req, res) => {
  try {
    const { address } = req.params
    const { platform = "binance-smart-chain" } = req.query

    const coins = await coinGeckoService.findByContractAddress(
      address,
      platform
    )

    res.json({
      success: true,
      contractAddress: address,
      platform,
      found: coins.length,
      coins: coins,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Get coin names only (for UI selection dropdown)
app.get("/api/coin-names", async (req, res) => {
  try {
    const {
      include_trending = "true",
      include_alpha = "true",
      limit = 500,
    } = req.query

    let coinNames = []

    // Get regular coins (names only)
    const allCoins = await coinGeckoService.getAllCoins({})
    const regularCoins = allCoins.slice(0, parseInt(limit)).map((coin) => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol?.toUpperCase() || coin.id.toUpperCase(),
      type: "regular",
    }))

    coinNames = [...regularCoins]

    // Include trending coins if requested
    if (include_trending === "true") {
      try {
        const trending = await coinGeckoService.getTrendingCoins()
        const trendingCoins =
          trending.coins?.map((coin) => ({
            id: coin.item?.id || coin.id,
            name: coin.item?.name || coin.name,
            symbol: (coin.item?.symbol || coin.symbol)?.toUpperCase(),
            type: "trending",
            market_cap_rank: coin.item?.market_cap_rank,
          })) || []

        // Add trending coins that aren't already in the list
        trendingCoins.forEach((trendingCoin) => {
          if (!coinNames.find((coin) => coin.id === trendingCoin.id)) {
            coinNames.push(trendingCoin)
          }
        })
      } catch (error) {
        console.log("Warning: Could not fetch trending coins:", error.message)
      }
    }

    // Include alpha/custom tokens if requested
    if (include_alpha === "true") {
      try {
        // Search for KOGE specifically
        const kogeResults = await coinGeckoService.findKoge()
        const kogeCoins = kogeResults.map((coin) => ({
          id: coin.id,
          name: `${coin.name} - 48 Club Token`,
          symbol: coin.symbol?.toUpperCase() || "KOGE",
          type: "alpha",
          description: "Alpha token from BSC",
        }))

        kogeCoins.forEach((kogeCoin) => {
          if (!coinNames.find((coin) => coin.id === kogeCoin.id)) {
            coinNames.push(kogeCoin)
          }
        })
      } catch (error) {
        console.log("Warning: Could not fetch alpha tokens:", error.message)
      }
    }

    // Sort by name for better UI experience
    coinNames.sort((a, b) => a.name.localeCompare(b.name))

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      total: coinNames.length,
      include_trending: include_trending === "true",
      include_alpha: include_alpha === "true",
      coins: coinNames,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    })
  }
})

// Get prices for multiple selected coins (batch price fetching)
app.post("/api/selected-coins-prices", async (req, res) => {
  try {
    const { coins, currency = "usd" } = req.body

    if (!coins || !Array.isArray(coins) || coins.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Please provide an array of coin IDs or symbols",
      })
    }

    if (coins.length > 100) {
      return res.status(400).json({
        success: false,
        error: "Maximum 100 coins allowed per request",
      })
    }

    // Convert symbols to coin IDs if needed
    const coinIds = []
    const symbolToCoinId = {
      BTC: "bitcoin",
      ETH: "ethereum",
      BNB: "binancecoin",
      DOGE: "dogecoin",
      KOGE: "koge-coin", // This might need to be updated based on actual KOGE ID
    }

    for (const coin of coins) {
      const coinStr = coin.toString().toLowerCase()

      // Check if it's already a coin ID format
      if (coinStr.includes("-") || coinStr.length > 5) {
        coinIds.push(coinStr)
      } else {
        // Convert symbol to coin ID
        const symbol = coin.toString().toUpperCase()
        const coinId = symbolToCoinId[symbol] || coinStr
        coinIds.push(coinId)
      }
    }

    // Remove duplicates
    const uniqueCoinIds = [...new Set(coinIds)]

    // Fetch prices for all coins
    const prices = await coinGeckoService.getCoinPrices(uniqueCoinIds, currency)

    // Format response with coin information
    const results = []

    for (const coinId of uniqueCoinIds) {
      if (prices[coinId]) {
        // Get coin info for better response
        const coinInfo = await coinGeckoService.getCoin(coinId)

        results.push({
          id: coinId,
          name: coinInfo?.name || coinId,
          symbol: coinInfo?.symbol?.toUpperCase() || coinId.toUpperCase(),
          current_price: prices[coinId][currency],
          price_change_24h: prices[coinId][`${currency}_24h_change`] || null,
          market_cap: prices[coinId][`${currency}_market_cap`] || null,
          volume_24h: prices[coinId][`${currency}_24h_vol`] || null,
          last_updated: new Date().toISOString(),
        })
      } else {
        // Coin not found or no price data
        results.push({
          id: coinId,
          name: coinId,
          symbol: coinId.toUpperCase(),
          current_price: null,
          error: "Price data not available",
          last_updated: new Date().toISOString(),
        })
      }
    }

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      currency: currency.toUpperCase(),
      requested_count: coins.length,
      found_count: results.filter((r) => r.current_price !== null).length,
      coins: results,
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
    title: "CoinGecko API Documentation",
    version: "1.0.0",
    description:
      "Complete REST API for CoinGecko cryptocurrency data with UI-specific endpoints",
    endpoints: {
      "GET /": "Service information and available endpoints",
      "GET /health": "Health check with service statistics",
      "GET /api/coins":
        "Get all coins (query: ?symbol=BTC&name=Bitcoin&limit=100)",
      "GET /api/search/:query":
        "Search coins by name, symbol, or ID (query: ?limit=50)",
      "GET /api/coin/:coinId":
        "Get specific coin information with price (query: ?detailed=true)",
      "GET /api/prices": "Get current prices for tracked coins",
      "GET /api/trending": "Get trending coins",
      "GET /api/top":
        "Get top coins by market cap (query: ?limit=10&currency=usd)",
      "GET /api/koge": "Find KOGE Alpha token specifically",
      "GET /api/contract/:address":
        "Find coin by contract address (query: ?platform=binance-smart-chain)",
      "GET /api/coin-names":
        "Get coin names only for UI selection (query: ?include_trending=true&include_alpha=true&limit=500)",
      "POST /api/selected-coins-prices":
        "Get prices for multiple selected coins (body: {coins: ['BTC', 'ETH'], currency: 'usd'})",
      "GET /api/docs": "This documentation",
    },
    ui_endpoints: {
      coin_selection: {
        endpoint: "/api/coin-names",
        method: "GET",
        description: "Get coin names only for dropdown/selection UI",
        parameters: {
          include_trending: "Include trending coins (default: true)",
          include_alpha: "Include alpha tokens like KOGE (default: true)",
          limit: "Maximum number of regular coins (default: 500)",
        },
        example:
          "/api/coin-names?include_trending=true&include_alpha=true&limit=100",
      },
      batch_prices: {
        endpoint: "/api/selected-coins-prices",
        method: "POST",
        description: "Get prices for multiple user-selected coins",
        body_example: {
          coins: ["BTC", "ETH", "BNB", "KOGE"],
          currency: "usd",
        },
        response_includes: [
          "current_price",
          "24h_change",
          "market_cap",
          "volume",
        ],
      },
    },
    examples: {
      searchBitcoin: "/api/search/bitcoin",
      getBitcoinInfo: "/api/coin/bitcoin",
      getTopCoins: "/api/top?limit=5",
      findKoge: "/api/koge",
      contractLookup:
        "/api/contract/0xe6df05ce8c8301223373cf5b969afcb1498c5528",
      coinNamesForUI:
        "/api/coin-names?include_trending=true&include_alpha=true&limit=100",
      selectedCoinsPrices:
        "POST /api/selected-coins-prices with body: {coins: ['BTC', 'ETH', 'BNB', 'KOGE'], currency: 'usd'}",
    },
    rateLimit: "50 calls per minute (CoinGecko free tier)",
    notes: [
      "All prices are in USD unless specified",
      "Rate limiting is automatically handled",
      "Contract address lookup supports multiple platforms",
    ],
  })
})

/**
 * Create Express server
 */
function createCoinGeckoServer() {
  // Initialize CoinGecko service
  coinGeckoService.updateCoins().catch(console.error)

  const server = app.listen(config.port, () => {
    console.log(`🦎 CoinGecko server running on port ${config.port}`)
    console.log(
      `📡 API Documentation: http://localhost:${config.port}/api/docs`
    )
    console.log(
      `🔍 Search Example: http://localhost:${config.port}/api/search/bitcoin`
    )
    console.log(`🪙 Find KOGE: http://localhost:${config.port}/api/koge`)
  })

  return server
}

/**
 * Initialize and start the CoinGecko price monitoring service
 */
function initializeCoinGeckoMonitor() {
  console.log("🦎 CoinGecko Price Monitor & Coin API Starting...")
  console.log("📋 Requested: BTC, ETH, BNB, DOGE")
  console.log("🔍 Will search for KOGE Alpha token...")
  console.log(`📈 Tracking: ${config.coinIds.join(", ")}`)
  console.log(
    `⏰ Update interval: Every ${config.intervalSeconds} seconds (${config.cronInterval})`
  )
  console.log(
    `📊 Calls per minute: ~${Math.round(60 / config.intervalSeconds)}`
  )
  console.log(`🌐 API: https://api.coingecko.com/api/v3`)
  console.log(`🚀 REST API: http://localhost:${config.port}/api/docs`)
  console.log(`⚙️  Config API: http://localhost:${config.port}/api/config`)
  console.log("-".repeat(50))

  // Create web server
  const server = createCoinGeckoServer()

  // Schedule cron job to run every 5 seconds (less frequent due to rate limits)
  const task = cron.schedule(
    config.cronInterval,
    async () => {
      try {
        const prices = await fetchCoinGeckoPrices()
        displayCoinGeckoPrices(prices)
      } catch (error) {
        handleError(error)
      }
    },
    {
      scheduled: false,
    }
  )

  // Start the scheduled task
  task.start()
  console.log("✅ CoinGecko price monitor started successfully!")
  console.log("💡 Press Ctrl+C to stop the monitor\n")

  // Initial fetch after a delay
  setTimeout(async () => {
    console.log("🔍 Searching for KOGE Alpha token...")
    try {
      const kogeResults = await coinGeckoService.findKoge()
      const contractResults = await coinGeckoService.findByContractAddress(
        "0xe6df05ce8c8301223373cf5b969afcb1498c5528"
      )

      if (kogeResults.length > 0 || contractResults.length > 0) {
        console.log("🎉 Found KOGE-related tokens:")
        ;[...kogeResults, ...contractResults].forEach((coin) => {
          console.log(`   • ${coin.name} (${coin.symbol}) - ID: ${coin.id}`)
        })
      } else {
        console.log("⚠️  KOGE Alpha token not found on CoinGecko")
        console.log(
          "   This might be because it's a very new token or not listed yet"
        )
      }
    } catch (error) {
      console.log("❌ Error searching for KOGE:", error.message)
    }

    console.log("\n🔄 Starting price monitoring...")
    const prices = await fetchCoinGeckoPrices()
    displayCoinGeckoPrices(prices)
  }, 2000)

  return { server, task }
}

/**
 * Graceful shutdown handler
 */
function setupGracefulShutdown() {
  process.on("SIGINT", () => {
    console.log(
      "\n\n🛑 Received SIGINT. Shutting down CoinGecko monitor gracefully..."
    )
    console.log("👋 CoinGecko Price Monitor stopped")
    process.exit(0)
  })

  process.on("SIGTERM", () => {
    console.log(
      "\n\n🛑 Received SIGTERM. Shutting down CoinGecko monitor gracefully..."
    )
    console.log("👋 CoinGecko Price Monitor stopped")
    process.exit(0)
  })
}

// Start the application
if (require.main === module) {
  setupGracefulShutdown()
  initializeCoinGeckoMonitor()
}

module.exports = {
  fetchCoinGeckoPrices,
  displayCoinGeckoPrices,
  handleError,
  coinGeckoService,
  config,
}
