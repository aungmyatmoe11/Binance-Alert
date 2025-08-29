const { spawn } = require("child_process")
const path = require("path")

console.log("🚀 Starting Combined Binance + CoinGecko Price Monitor")
console.log("=".repeat(60))

// Start Binance server
console.log("🔸 Starting Binance API Server (Port 10000)...")
const binanceServer = spawn("node", ["index.js"], {
  stdio: ["inherit", "pipe", "pipe"],
  cwd: __dirname,
})

binanceServer.stdout.on("data", (data) => {
  const output = data.toString().trim()
  if (output) {
    console.log(`[BINANCE] ${output}`)
  }
})

binanceServer.stderr.on("data", (data) => {
  const output = data.toString().trim()
  if (output) {
    console.error(`[BINANCE ERROR] ${output}`)
  }
})

// Start CoinGecko server with a delay
setTimeout(() => {
  console.log("🦎 Starting CoinGecko API Server (Port 10001)...")

  const coingeckoServer = spawn("node", ["coingecko-server.js"], {
    stdio: ["inherit", "pipe", "pipe"],
    cwd: __dirname,
  })

  coingeckoServer.stdout.on("data", (data) => {
    const output = data.toString().trim()
    if (output) {
      console.log(`[COINGECKO] ${output}`)
    }
  })

  coingeckoServer.stderr.on("data", (data) => {
    const output = data.toString().trim()
    if (output) {
      console.error(`[COINGECKO ERROR] ${output}`)
    }
  })

  // Handle CoinGecko server exit
  coingeckoServer.on("close", (code) => {
    console.log(`🦎 CoinGecko server process exited with code ${code}`)
    if (code !== 0) {
      console.log("⚠️  CoinGecko server encountered an error")
    }
  })

  // Store reference for cleanup
  process.coingeckoServer = coingeckoServer
}, 3000) // 3 second delay to let Binance server start first

// Handle Binance server exit
binanceServer.on("close", (code) => {
  console.log(`🔸 Binance server process exited with code ${code}`)
  if (code !== 0) {
    console.log("⚠️  Binance server encountered an error")
  }
})

// Store reference for cleanup
process.binanceServer = binanceServer

// Display startup information
setTimeout(() => {
  console.log("\n" + "=".repeat(60))
  console.log("🎉 Both servers should be running now!")
  console.log("")
  console.log("📊 BINANCE API (Port 10000):")
  console.log("   • Service Info: http://localhost:10000/")
  console.log("   • API Docs: http://localhost:10000/api/docs")
  console.log("   • Search Symbols: http://localhost:10000/api/search/BTC")
  console.log("   • Current Prices: http://localhost:10000/api/prices")
  console.log("")
  console.log("🦎 COINGECKO API (Port 10001):")
  console.log("   • Service Info: http://localhost:10001/")
  console.log("   • API Docs: http://localhost:10001/api/docs")
  console.log("   • Search Coins: http://localhost:10001/api/search/bitcoin")
  console.log("   • Find KOGE: http://localhost:10001/api/koge")
  console.log("   • Top Coins: http://localhost:10001/api/top?limit=5")
  console.log("")
  console.log("🔍 KOGE Alpha Token:")
  console.log("   • Binance (Custom): http://localhost:10000/api/search/KOGE")
  console.log("   • CoinGecko (Search): http://localhost:10001/api/koge")
  console.log(
    "   • Contract Lookup: http://localhost:10001/api/contract/0xe6df05ce8c8301223373cf5b969afcb1498c5528"
  )
  console.log("")
  console.log("💡 Use Ctrl+C to stop both servers")
  console.log("=".repeat(60))
}, 8000) // 8 seconds to let both servers fully start

// Graceful shutdown handler
function setupGracefulShutdown() {
  const cleanup = () => {
    console.log("\n🛑 Shutting down both servers...")

    if (process.binanceServer) {
      console.log("  Stopping Binance server...")
      process.binanceServer.kill("SIGTERM")
    }

    if (process.coingeckoServer) {
      console.log("  Stopping CoinGecko server...")
      process.coingeckoServer.kill("SIGTERM")
    }

    setTimeout(() => {
      console.log("👋 Combined server stopped")
      process.exit(0)
    }, 2000)
  }

  process.on("SIGINT", cleanup)
  process.on("SIGTERM", cleanup)

  // Handle process exit
  process.on("exit", () => {
    if (process.binanceServer) {
      process.binanceServer.kill()
    }
    if (process.coingeckoServer) {
      process.coingeckoServer.kill()
    }
  })
}

setupGracefulShutdown()
