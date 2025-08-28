#!/bin/bash

# Binance Symbol API Demo Script
# Make sure the server is running with: npm start

echo "🚀 Binance Symbol API Demo"
echo "=========================="
echo ""

BASE_URL="http://localhost:10000"

echo "1. 📋 Service Information"
echo "curl $BASE_URL/"
curl -s "$BASE_URL/" | python3 -m json.tool 2>/dev/null || curl -s "$BASE_URL/"
echo -e "\n"

echo "2. 🔍 Search for BTC symbols (first 5)"
echo "curl \"$BASE_URL/api/search/BTC?limit=5\""
curl -s "$BASE_URL/api/search/BTC?limit=5" | python3 -m json.tool 2>/dev/null || curl -s "$BASE_URL/api/search/BTC?limit=5"
echo -e "\n"

echo "3. 💰 Get BTCUSDT symbol with current price"
echo "curl \"$BASE_URL/api/symbol/BTCUSDT\""
curl -s "$BASE_URL/api/symbol/BTCUSDT" | python3 -m json.tool 2>/dev/null || curl -s "$BASE_URL/api/symbol/BTCUSDT"
echo -e "\n"

echo "4. ➕ Add KOGE Alpha token as custom symbol"
echo "curl -X POST -H \"Content-Type: application/json\" -d '{\"symbol\":\"KOGEUSDT\",\"baseAsset\":\"KOGE\",\"name\":\"KOGE Alpha Token\"}' \"$BASE_URL/api/symbol/custom\""
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"symbol":"KOGEUSDT","baseAsset":"KOGE","quoteAsset":"USDT","name":"KOGE Alpha Token - BSC Contract: 0xe6df05ce8c8301223373cf5b969afcb1498c5528"}' \
  "$BASE_URL/api/symbol/custom" | python3 -m json.tool 2>/dev/null || curl -s -X POST -H "Content-Type: application/json" -d '{"symbol":"KOGEUSDT","baseAsset":"KOGE","name":"KOGE Alpha Token"}' "$BASE_URL/api/symbol/custom"
echo -e "\n"

echo "5. 🪙 Search for KOGE token"
echo "curl \"$BASE_URL/api/search/KOGE\""
curl -s "$BASE_URL/api/search/KOGE" | python3 -m json.tool 2>/dev/null || curl -s "$BASE_URL/api/search/KOGE"
echo -e "\n"

echo "6. 📊 Get KOGE symbol information"
echo "curl \"$BASE_URL/api/symbol/KOGEUSDT\""
curl -s "$BASE_URL/api/symbol/KOGEUSDT" | python3 -m json.tool 2>/dev/null || curl -s "$BASE_URL/api/symbol/KOGEUSDT"
echo -e "\n"

echo "7. 💵 Get current prices for tracked symbols"
echo "curl \"$BASE_URL/api/prices\""
curl -s "$BASE_URL/api/prices" | python3 -m json.tool 2>/dev/null || curl -s "$BASE_URL/api/prices"
echo -e "\n"

echo "8. 🔗 Get all BTC pairs (first 3)"
echo "curl \"$BASE_URL/api/coin/BTC?limit=3\""
curl -s "$BASE_URL/api/coin/BTC" | python3 -c "import sys,json; data=json.load(sys.stdin); data['pairs']=data['pairs'][:3]; print(json.dumps(data,indent=2))" 2>/dev/null || curl -s "$BASE_URL/api/coin/BTC"
echo -e "\n"

echo "9. 🗂️ Get USDT symbols (first 5)"
echo "curl \"$BASE_URL/api/symbols?quote=USDT&limit=5\""
curl -s "$BASE_URL/api/symbols?quote=USDT&limit=5" | python3 -m json.tool 2>/dev/null || curl -s "$BASE_URL/api/symbols?quote=USDT&limit=5"
echo -e "\n"

echo "10. 📚 API Documentation"
echo "curl \"$BASE_URL/api/docs\""
curl -s "$BASE_URL/api/docs" | python3 -m json.tool 2>/dev/null || curl -s "$BASE_URL/api/docs"
echo -e "\n"

echo "✅ Demo Complete!"
echo ""
echo "🔗 Useful URLs:"
echo "   - API Docs: http://localhost:10000/api/docs"
echo "   - Search BTC: http://localhost:10000/api/search/BTC"
echo "   - Current Prices: http://localhost:10000/api/prices"
echo "   - Health Check: http://localhost:10000/health"