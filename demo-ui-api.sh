#!/bin/bash

# UI-Specific CoinGecko API Demo Script
# Make sure the CoinGecko server is running with: npm run coingecko

echo "🎯 UI-Specific CoinGecko API Demo"
echo "================================="
echo ""

BASE_URL="http://localhost:10001"

echo "1. 📋 Get Coin Names Only (for UI selection dropdown)"
echo "curl \"$BASE_URL/api/coin-names?limit=20&include_trending=true&include_alpha=true\""
curl -s "$BASE_URL/api/coin-names?limit=20&include_trending=true&include_alpha=true" | python3 -m json.tool 2>/dev/null || curl -s "$BASE_URL/api/coin-names?limit=20&include_trending=true&include_alpha=true"
echo -e "\n"

echo "2. 💰 Get Prices for Selected Coins (BTC, ETH, BNB, KOGE)"
echo "curl -X POST -H \"Content-Type: application/json\" -d '{\"coins\":[\"BTC\",\"ETH\",\"BNB\",\"KOGE\"],\"currency\":\"usd\"}' \"$BASE_URL/api/selected-coins-prices\""
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"coins":["BTC","ETH","BNB","KOGE"],"currency":"usd"}' \
  "$BASE_URL/api/selected-coins-prices" | python3 -m json.tool 2>/dev/null || curl -s -X POST -H "Content-Type: application/json" -d '{"coins":["BTC","ETH","BNB","KOGE"],"currency":"usd"}' "$BASE_URL/api/selected-coins-prices"
echo -e "\n"

echo "3. 🪙 Get Coin Names Only (no trending, no alpha)"
echo "curl \"$BASE_URL/api/coin-names?limit=10&include_trending=false&include_alpha=false\""
curl -s "$BASE_URL/api/coin-names?limit=10&include_trending=false&include_alpha=false" | python3 -m json.tool 2>/dev/null || curl -s "$BASE_URL/api/coin-names?limit=10&include_trending=false&include_alpha=false"
echo -e "\n"

echo "4. 💎 Get Prices for Different Coins (using coin IDs)"
echo "curl -X POST -H \"Content-Type: application/json\" -d '{\"coins\":[\"bitcoin\",\"ethereum\",\"binancecoin\",\"dogecoin\"],\"currency\":\"usd\"}' \"$BASE_URL/api/selected-coins-prices\""
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"coins":["bitcoin","ethereum","binancecoin","dogecoin"],"currency":"usd"}' \
  "$BASE_URL/api/selected-coins-prices" | python3 -m json.tool 2>/dev/null || curl -s -X POST -H "Content-Type: application/json" -d '{"coins":["bitcoin","ethereum","binancecoin","dogecoin"],"currency":"usd"}' "$BASE_URL/api/selected-coins-prices"
echo -e "\n"

echo "5. 🔍 Test Error Handling (empty coins array)"
echo "curl -X POST -H \"Content-Type: application/json\" -d '{\"coins\":[]}' \"$BASE_URL/api/selected-coins-prices\""
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"coins":[]}' \
  "$BASE_URL/api/selected-coins-prices" | python3 -m json.tool 2>/dev/null || curl -s -X POST -H "Content-Type: application/json" -d '{"coins":[]}' "$BASE_URL/api/selected-coins-prices"
echo -e "\n"

echo "6. 📚 Updated API Documentation"
echo "curl \"$BASE_URL/api/docs\""
curl -s "$BASE_URL/api/docs" | python3 -c "
import sys, json
data = json.load(sys.stdin)
print(json.dumps({
    'title': data['title'],
    'ui_endpoints': data.get('ui_endpoints', {}),
    'examples': data.get('examples', {})
}, indent=2))
" 2>/dev/null || curl -s "$BASE_URL/api/docs"
echo -e "\n"

echo "✅ UI API Demo Complete!"
echo ""
echo "🎯 UI Workflow:"
echo "   1. Use /api/coin-names to populate your coin selection dropdown"
echo "   2. When user selects coins, use /api/selected-coins-prices to get their prices"
echo ""
echo "🔗 Useful URLs:"
echo "   - Coin Names for UI: http://localhost:10001/api/coin-names"
echo "   - API Docs: http://localhost:10001/api/docs"
echo "   - Health Check: http://localhost:10001/health"
echo ""
echo "📱 Example UI Flow:"
echo "   GET /api/coin-names?include_trending=true&include_alpha=true"
echo "   → User selects: BTC, ETH, BNB, KOGE"
echo "   POST /api/selected-coins-prices {coins: ['BTC','ETH','BNB','KOGE']}"
echo "   → Display prices in UI"