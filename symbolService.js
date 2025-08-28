const axios = require("axios")

class SymbolService {
  constructor() {
    this.symbols = []
    this.symbolMap = new Map()
    this.lastUpdate = null
    this.updateInterval = 60 * 60 * 1000 // 1 hour in milliseconds
  }

  /**
   * Fetch and cache all symbols from Binance
   */
  async updateSymbols() {
    try {
      console.log("🔄 Updating symbol information from Binance...")

      const response = await axios.get(
        "https://api.binance.com/api/v3/exchangeInfo",
        {
          timeout: 10000,
        }
      )

      this.symbols = response.data.symbols
        .filter((symbol) => symbol.status === "TRADING")
        .map((symbol) => ({
          symbol: symbol.symbol,
          baseAsset: symbol.baseAsset,
          quoteAsset: symbol.quoteAsset,
          pair: `${symbol.baseAsset}/${symbol.quoteAsset}`,
          status: symbol.status,
          permissions: symbol.permissions || [],
        }))

      // Create a map for faster lookups
      this.symbolMap.clear()
      this.symbols.forEach((symbol) => {
        this.symbolMap.set(symbol.symbol, symbol)
        this.symbolMap.set(symbol.baseAsset, symbol)
      })

      this.lastUpdate = new Date()
      console.log(`✅ Updated ${this.symbols.length} trading symbols`)

      return this.symbols
    } catch (error) {
      console.error("❌ Error updating symbols:", error.message)
      throw error
    }
  }

  /**
   * Get all symbols with optional filtering
   */
  async getAllSymbols(filter = {}) {
    await this.ensureSymbolsLoaded()

    let filtered = [...this.symbols]

    if (filter.quoteAsset) {
      filtered = filtered.filter(
        (symbol) => symbol.quoteAsset === filter.quoteAsset.toUpperCase()
      )
    }

    if (filter.baseAsset) {
      filtered = filtered.filter(
        (symbol) => symbol.baseAsset === filter.baseAsset.toUpperCase()
      )
    }

    return filtered
  }

  /**
   * Search symbols by name or symbol
   */
  async searchSymbols(query) {
    await this.ensureSymbolsLoaded()

    const searchTerm = query.toUpperCase()

    return this.symbols.filter(
      (symbol) =>
        symbol.symbol.includes(searchTerm) ||
        symbol.baseAsset.includes(searchTerm) ||
        symbol.quoteAsset.includes(searchTerm) ||
        symbol.pair.includes(searchTerm)
    )
  }

  /**
   * Get specific symbol information
   */
  async getSymbol(symbolOrAsset) {
    await this.ensureSymbolsLoaded()

    const key = symbolOrAsset.toUpperCase()
    return this.symbolMap.get(key) || null
  }

  /**
   * Get symbols for a specific coin (e.g., all BTC pairs)
   */
  async getCoinPairs(coinSymbol) {
    await this.ensureSymbolsLoaded()

    const coin = coinSymbol.toUpperCase()
    return this.symbols.filter(
      (symbol) => symbol.baseAsset === coin || symbol.quoteAsset === coin
    )
  }

  /**
   * Get current prices for symbols
   */
  async getSymbolPrices(symbols) {
    try {
      if (!symbols || symbols.length === 0) {
        return []
      }

      const symbolsParam = symbols.map((s) => `"${s}"`).join(",")
      const url = `https://api.binance.com/api/v3/ticker/price?symbols=[${symbolsParam}]`

      const response = await axios.get(url, {
        timeout: 5000,
        headers: {
          Accept: "application/json",
          "User-Agent": "BinanceAlert/1.0",
        },
      })

      return response.data
    } catch (error) {
      console.error("❌ Error fetching prices:", error.message)
      return []
    }
  }

  /**
   * Add custom/manual symbol (for tokens not on Binance)
   */
  addCustomSymbol(symbol, baseAsset, quoteAsset = "USDT") {
    const customSymbol = {
      symbol: symbol.toUpperCase(),
      baseAsset: baseAsset.toUpperCase(),
      quoteAsset: quoteAsset.toUpperCase(),
      pair: `${baseAsset.toUpperCase()}/${quoteAsset.toUpperCase()}`,
      status: "CUSTOM",
      permissions: ["CUSTOM"],
      isCustom: true,
    }

    this.symbols.push(customSymbol)
    this.symbolMap.set(customSymbol.symbol, customSymbol)
    this.symbolMap.set(customSymbol.baseAsset, customSymbol)

    console.log(`✅ Added custom symbol: ${customSymbol.symbol}`)
    return customSymbol
  }

  /**
   * Ensure symbols are loaded and up to date
   */
  async ensureSymbolsLoaded() {
    const now = new Date()

    if (
      !this.lastUpdate ||
      now - this.lastUpdate > this.updateInterval ||
      this.symbols.length === 0
    ) {
      await this.updateSymbols()
    }
  }

  /**
   * Get service statistics
   */
  getStats() {
    return {
      totalSymbols: this.symbols.length,
      lastUpdate: this.lastUpdate,
      customSymbols: this.symbols.filter((s) => s.isCustom).length,
      uniqueBaseAssets: new Set(this.symbols.map((s) => s.baseAsset)).size,
      uniqueQuoteAssets: new Set(this.symbols.map((s) => s.quoteAsset)).size,
    }
  }
}

module.exports = SymbolService
