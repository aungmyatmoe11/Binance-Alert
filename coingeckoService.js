const axios = require("axios")

class CoinGeckoService {
  constructor() {
    this.coins = []
    this.coinMap = new Map()
    this.lastUpdate = null
    this.updateInterval = 60 * 60 * 1000 // 1 hour in milliseconds
    this.baseUrl = "https://api.coingecko.com/api/v3"
    this.rateLimitDelay = 1100 // 1.1 seconds between requests (free tier: 50 calls/minute)
  }

  /**
   * Fetch and cache all coins from CoinGecko
   */
  async updateCoins() {
    try {
      console.log("🔄 Updating coin information from CoinGecko...")

      // Add delay to respect rate limits
      await this.delay(this.rateLimitDelay)

      const response = await axios.get(`${this.baseUrl}/coins/list`, {
        timeout: 15000,
        headers: {
          Accept: "application/json",
          "User-Agent": "BinanceAlert-CoinGecko/1.0",
        },
      })

      this.coins = response.data.map((coin) => ({
        id: coin.id,
        symbol: coin.symbol.toUpperCase(),
        name: coin.name,
        platforms: coin.platforms || {},
      }))

      // Create maps for faster lookups
      this.coinMap.clear()
      this.coins.forEach((coin) => {
        this.coinMap.set(coin.id, coin)
        this.coinMap.set(coin.symbol, coin)
        this.coinMap.set(coin.name.toLowerCase(), coin)
      })

      this.lastUpdate = new Date()
      console.log(`✅ Updated ${this.coins.length} CoinGecko coins`)

      return this.coins
    } catch (error) {
      console.error("❌ Error updating CoinGecko coins:", error.message)
      if (error.response?.status === 429) {
        console.error("   Rate limit exceeded. Please wait before retrying.")
      }
      throw error
    }
  }

  /**
   * Get all coins with optional filtering
   */
  async getAllCoins(filter = {}) {
    await this.ensureCoinsLoaded()

    let filtered = [...this.coins]

    if (filter.symbol) {
      filtered = filtered.filter((coin) =>
        coin.symbol.includes(filter.symbol.toUpperCase())
      )
    }

    if (filter.name) {
      filtered = filtered.filter((coin) =>
        coin.name.toLowerCase().includes(filter.name.toLowerCase())
      )
    }

    return filtered
  }

  /**
   * Search coins by name, symbol, or ID
   */
  async searchCoins(query) {
    await this.ensureCoinsLoaded()

    const searchTerm = query.toLowerCase()

    return this.coins.filter(
      (coin) =>
        coin.id.toLowerCase().includes(searchTerm) ||
        coin.symbol.toLowerCase().includes(searchTerm) ||
        coin.name.toLowerCase().includes(searchTerm)
    )
  }

  /**
   * Get specific coin information
   */
  async getCoin(coinIdOrSymbol) {
    await this.ensureCoinsLoaded()

    const key = coinIdOrSymbol.toLowerCase()
    return this.coinMap.get(key) || this.coinMap.get(key.toUpperCase()) || null
  }

  /**
   * Get current prices for specific coins
   */
  async getCoinPrices(coinIds, vsCurrency = "usd") {
    try {
      if (!coinIds || coinIds.length === 0) {
        return []
      }

      // Add delay to respect rate limits
      await this.delay(this.rateLimitDelay)

      const idsParam = Array.isArray(coinIds) ? coinIds.join(",") : coinIds
      const url = `${this.baseUrl}/simple/price`

      const response = await axios.get(url, {
        params: {
          ids: idsParam,
          vs_currencies: vsCurrency,
          include_24hr_change: true,
          include_24hr_vol: true,
          include_last_updated_at: true,
        },
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "User-Agent": "BinanceAlert-CoinGecko/1.0",
        },
      })

      return response.data
    } catch (error) {
      console.error("❌ Error fetching CoinGecko prices:", error.message)
      if (error.response?.status === 429) {
        console.error("   Rate limit exceeded. Please wait before retrying.")
      }
      return {}
    }
  }

  /**
   * Get detailed coin information
   */
  async getCoinDetails(coinId) {
    try {
      await this.delay(this.rateLimitDelay)

      const response = await axios.get(`${this.baseUrl}/coins/${coinId}`, {
        params: {
          localization: false,
          tickers: false,
          market_data: true,
          community_data: false,
          developer_data: false,
          sparkline: false,
        },
        timeout: 15000,
        headers: {
          Accept: "application/json",
          "User-Agent": "BinanceAlert-CoinGecko/1.0",
        },
      })

      return response.data
    } catch (error) {
      console.error(`❌ Error fetching details for ${coinId}:`, error.message)
      return null
    }
  }

  /**
   * Search for KOGE specifically
   */
  async findKoge() {
    await this.ensureCoinsLoaded()

    const kogeVariants = ["koge", "kog", "koge-alpha", "kogecoin"]
    const results = []

    for (const variant of kogeVariants) {
      const matches = this.coins.filter(
        (coin) =>
          coin.id.toLowerCase().includes(variant) ||
          coin.symbol.toLowerCase().includes(variant) ||
          coin.name.toLowerCase().includes(variant)
      )
      results.push(...matches)
    }

    // Remove duplicates
    const uniqueResults = results.filter(
      (coin, index, self) => index === self.findIndex((c) => c.id === coin.id)
    )

    return uniqueResults
  }

  /**
   * Get trending coins
   */
  async getTrendingCoins() {
    try {
      await this.delay(this.rateLimitDelay)

      const response = await axios.get(`${this.baseUrl}/search/trending`, {
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "User-Agent": "BinanceAlert-CoinGecko/1.0",
        },
      })

      return response.data.coins || []
    } catch (error) {
      console.error("❌ Error fetching trending coins:", error.message)
      return []
    }
  }

  /**
   * Get top coins by market cap
   */
  async getTopCoins(limit = 10, vsCurrency = "usd") {
    try {
      await this.delay(this.rateLimitDelay)

      const response = await axios.get(`${this.baseUrl}/coins/markets`, {
        params: {
          vs_currency: vsCurrency,
          order: "market_cap_desc",
          per_page: limit,
          page: 1,
          sparkline: false,
          price_change_percentage: "24h",
        },
        timeout: 15000,
        headers: {
          Accept: "application/json",
          "User-Agent": "BinanceAlert-CoinGecko/1.0",
        },
      })

      return response.data
    } catch (error) {
      console.error("❌ Error fetching top coins:", error.message)
      return []
    }
  }

  /**
   * Rate limiting delay
   */
  async delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Ensure coins are loaded and up to date
   */
  async ensureCoinsLoaded() {
    const now = new Date()

    if (
      !this.lastUpdate ||
      now - this.lastUpdate > this.updateInterval ||
      this.coins.length === 0
    ) {
      await this.updateCoins()
    }
  }

  /**
   * Get service statistics
   */
  getStats() {
    return {
      totalCoins: this.coins.length,
      lastUpdate: this.lastUpdate,
      uniqueSymbols: new Set(this.coins.map((c) => c.symbol)).size,
      apiEndpoint: this.baseUrl,
      rateLimitDelay: this.rateLimitDelay,
    }
  }

  /**
   * Find coin by contract address
   */
  async findByContractAddress(
    contractAddress,
    platform = "binance-smart-chain"
  ) {
    await this.ensureCoinsLoaded()

    return this.coins.filter((coin) => {
      const platforms = coin.platforms || {}
      return Object.values(platforms).some(
        (address) =>
          address && address.toLowerCase() === contractAddress.toLowerCase()
      )
    })
  }

  /**
   * Get supported platforms
   */
  async getSupportedPlatforms() {
    try {
      await this.delay(this.rateLimitDelay)

      const response = await axios.get(`${this.baseUrl}/asset_platforms`, {
        timeout: 10000,
        headers: {
          Accept: "application/json",
          "User-Agent": "BinanceAlert-CoinGecko/1.0",
        },
      })

      return response.data
    } catch (error) {
      console.error("❌ Error fetching platforms:", error.message)
      return []
    }
  }
}

module.exports = CoinGeckoService
