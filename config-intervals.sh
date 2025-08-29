#!/bin/bash

# Dynamic Interval Configuration Script for Cryptocurrency APIs
# This script provides easy ways to change API call intervals

echo "🔧 Cryptocurrency API Interval Configuration"
echo "=============================================="
echo ""

# Default configurations
BINANCE_DEFAULT=2
COINGECKO_DEFAULT=5

# Function to display current configuration
show_config() {
    echo "📊 Current Configuration:"
    echo "   Binance API:   ${BINANCE_INTERVAL:-$BINANCE_DEFAULT} seconds"
    echo "   CoinGecko API: ${COINGECKO_INTERVAL:-$COINGECKO_DEFAULT} seconds"
    echo ""
}

# Function to set intervals via environment variables
set_env_intervals() {
    local binance_interval=$1
    local coingecko_interval=$2
    
    echo "🔧 Setting environment variables..."
    export BINANCE_INTERVAL=$binance_interval
    export COINGECKO_INTERVAL=$coingecko_interval
    
    echo "✅ Environment variables set:"
    echo "   BINANCE_INTERVAL=$binance_interval"
    echo "   COINGECKO_INTERVAL=$coingecko_interval"
    echo ""
}

# Function to start servers with specific intervals
start_with_intervals() {
    local binance_interval=$1
    local coingecko_interval=$2
    local mode=$3
    
    case $mode in
        "binance")
            echo "🚀 Starting Binance API with ${binance_interval}s interval..."
            BINANCE_INTERVAL=$binance_interval npm start
            ;;
        "coingecko")
            echo "🦎 Starting CoinGecko API with ${coingecko_interval}s interval..."
            COINGECKO_INTERVAL=$coingecko_interval npm run coingecko
            ;;
        "both")
            echo "🚀🦎 Starting both APIs..."
            echo "   Binance: ${binance_interval}s interval"
            echo "   CoinGecko: ${coingecko_interval}s interval"
            BINANCE_INTERVAL=$binance_interval COINGECKO_INTERVAL=$coingecko_interval npm run both
            ;;
    esac
}

# Function to test API configurations
test_config() {
    local port=$1
    local api_name=$2
    
    echo "🧪 Testing $api_name configuration..."
    
    if curl -s "http://localhost:$port/api/config" > /dev/null; then
        echo "✅ $api_name is running"
        curl -s "http://localhost:$port/api/config" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    config = data['config']
    print(f\"   Interval: {config['interval_seconds']}s\")
    print(f\"   Calls/min: {config['rate_limit_info'].get('current_calls_per_minute', 'N/A')}\")
except:
    print('   Could not parse config')
"
    else
        echo "❌ $api_name is not running"
    fi
    echo ""
}

# Function to change interval via API
change_interval_api() {
    local port=$1
    local interval=$2
    local api_name=$3
    
    echo "🔄 Changing $api_name interval to ${interval}s via API..."
    
    response=$(curl -s -X POST -H "Content-Type: application/json" \
        -d "{\"seconds\":$interval}" \
        "http://localhost:$port/api/config/interval")
    
    echo "$response" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    if data.get('success'):
        print(f\"✅ {data['message']}\")
        print(f\"   Old: {data['old_interval']}s → New: {data['new_interval']}s\")
        print(f\"   Note: {data.get('note', '')}\")
    else:
        print(f\"❌ Error: {data.get('error', 'Unknown error')}\")
except:
    print('❌ API request failed')
"
    echo ""
}

# Main menu
case $1 in
    "show"|"config")
        show_config
        test_config 10000 "Binance API"
        test_config 10001 "CoinGecko API"
        ;;
    
    "set")
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "Usage: $0 set <binance_interval> <coingecko_interval>"
            echo "Example: $0 set 2 5"
            exit 1
        fi
        set_env_intervals $2 $3
        show_config
        ;;
    
    "start")
        mode=${2:-"both"}
        binance_interval=${3:-$BINANCE_DEFAULT}
        coingecko_interval=${4:-$COINGECKO_DEFAULT}
        
        start_with_intervals $binance_interval $coingecko_interval $mode
        ;;
    
    "change")
        if [ -z "$2" ] || [ -z "$3" ]; then
            echo "Usage: $0 change <api> <interval>"
            echo "APIs: binance, coingecko"
            echo "Example: $0 change binance 3"
            exit 1
        fi
        
        api=$2
        interval=$3
        
        case $api in
            "binance")
                change_interval_api 10000 $interval "Binance API"
                ;;
            "coingecko")
                change_interval_api 10001 $interval "CoinGecko API"
                ;;
            *)
                echo "❌ Unknown API: $api"
                echo "Available APIs: binance, coingecko"
                exit 1
                ;;
        esac
        ;;
    
    "quick")
        interval=${2:-1}
        echo "⚡ Quick start with ${interval}s interval for both APIs..."
        start_with_intervals $interval $interval "both"
        ;;
    
    "safe")
        echo "🛡️ Safe start with recommended intervals..."
        echo "   Binance: 2s (safe for 1200/min limit)"
        echo "   CoinGecko: 5s (safe for 50/min limit)"
        start_with_intervals 2 5 "both"
        ;;
    
    "aggressive")
        echo "🔥 Aggressive start with fast intervals..."
        echo "   Binance: 1s (aggressive for 1200/min limit)"
        echo "   CoinGecko: 2s (may hit 50/min limit)"
        echo "   ⚠️  WARNING: May hit rate limits!"
        start_with_intervals 1 2 "both"
        ;;
    
    *)
        echo "🔧 Cryptocurrency API Interval Configuration"
        echo ""
        echo "Usage: $0 <command> [options]"
        echo ""
        echo "Commands:"
        echo "  show                           - Show current configuration"
        echo "  set <binance> <coingecko>     - Set environment variables"
        echo "  start [mode] [b_int] [c_int]  - Start servers with intervals"
        echo "  change <api> <interval>       - Change running API interval"
        echo "  quick [interval]              - Quick start (same interval for both)"
        echo "  safe                          - Start with safe intervals"
        echo "  aggressive                    - Start with aggressive intervals"
        echo ""
        echo "Examples:"
        echo "  $0 show                       # Show current config"
        echo "  $0 set 3 6                    # Set Binance=3s, CoinGecko=6s"
        echo "  $0 start both 2 5             # Start both with specific intervals"
        echo "  $0 change binance 1           # Change running Binance to 1s"
        echo "  $0 quick 3                    # Start both with 3s interval"
        echo "  $0 safe                       # Start with safe intervals"
        echo ""
        echo "Environment Variables:"
        echo "  BINANCE_INTERVAL              # Binance API interval (default: 2s)"
        echo "  COINGECKO_INTERVAL            # CoinGecko API interval (default: 5s)"
        echo ""
        echo "Command Line Arguments:"
        echo "  --interval=N                  # Override interval for specific server"
        echo ""
        echo "Rate Limits:"
        echo "  Binance:   1200 calls/min (safe: ≥0.05s, recommended: ≥2s)"
        echo "  CoinGecko: 50 calls/min   (safe: ≥1.2s, recommended: ≥5s)"
        ;;
esac