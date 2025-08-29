// Simple test script for new UI APIs
const axios = require("axios")

const BASE_URL = "http://localhost:10001"

async function testCoinNamesAPI() {
  console.log("🧪 Testing Coin Names API...")
  try {
    const response = await axios.get(
      `${BASE_URL}/api/coin-names?include_trending=true&include_alpha=true&limit=5`
    )
    console.log("✅ Coin Names API Response:")
    console.log(`   Total coins: ${response.data.total}`)
    console.log(`   Include trending: ${response.data.include_trending}`)
    console.log(`   Include alpha: ${response.data.include_alpha}`)
    console.log("   Sample coins:")
    response.data.coins.slice(0, 3).forEach((coin, index) => {
      console.log(
        `   ${index + 1}. ${coin.name} (${coin.symbol}) - Type: ${coin.type}`
      )
    })
    return true
  } catch (error) {
    console.log("❌ Coin Names API Error:", error.message)
    return false
  }
}

async function testSelectedCoinsPricesAPI() {
  console.log("\n🧪 Testing Selected Coins Prices API...")
  try {
    const response = await axios.post(`${BASE_URL}/api/selected-coins-prices`, {
      coins: ["BTC", "ETH", "BNB", "KOGE"],
      currency: "usd",
    })
    console.log("✅ Selected Coins Prices API Response:")
    console.log(`   Currency: ${response.data.currency}`)
    console.log(`   Requested: ${response.data.requested_count} coins`)
    console.log(`   Found: ${response.data.found_count} coins with prices`)
    console.log("   Coin prices:")
    response.data.coins.forEach((coin, index) => {
      if (coin.current_price) {
        console.log(
          `   ${index + 1}. ${
            coin.symbol
          }: $${coin.current_price.toLocaleString()}`
        )
      } else {
        console.log(`   ${index + 1}. ${coin.symbol}: Price not available`)
      }
    })
    return true
  } catch (error) {
    console.log("❌ Selected Coins Prices API Error:", error.message)
    return false
  }
}

async function runTests() {
  console.log("🎯 Testing New UI-Specific APIs\n")

  const test1 = await testCoinNamesAPI()
  const test2 = await testSelectedCoinsPricesAPI()

  console.log("\n📊 Test Results:")
  console.log(`   Coin Names API: ${test1 ? "✅ PASS" : "❌ FAIL"}`)
  console.log(`   Selected Prices API: ${test2 ? "✅ PASS" : "❌ FAIL"}`)

  if (test1 && test2) {
    console.log("\n🎉 All tests passed! Your UI APIs are working correctly.")
    console.log("\n📝 You can now use these APIs in your UI:")
    console.log("   1. GET /api/coin-names - For dropdown coin selection")
    console.log(
      "   2. POST /api/selected-coins-prices - For batch price fetching"
    )
  } else {
    console.log("\n⚠️  Some tests failed. Please check the server status.")
  }
}

runTests().catch(console.error)
