export const corsProxy = "https://thingproxy.freeboard.io/fetch/"

export const binanceApiBaseUrl = 'https://api.binance.com/api/v3/ticker/price?symbol='
export const bitfinexApiBaseUrl = 'https://api.bitfinex.com/v1/pubticker/'
export const huobiApiBaseUrl = 'https://api.huobi.pro/market/detail/merged?symbol='
export const krakenApiBaseUrl = 'https://api.kraken.com/0/public/Ticker?pair='

export const binanceHistoryUrl = 'https://api.binance.com/api/v3/trades?limit=5&symbol='
export const bitfinexHistoryUrl = 'https://api-pub.bitfinex.com/v2/trades/t'
export const huobHistoryUrl = 'https://api.huobi.pro/market/history/trade?size=5&symbol='
export const krakenHistoryUrl = 'https://api.kraken.com/0/public/Depth?count=2&pair='

export const binanceMapper = (data, symbol) => {
    let errorMsg = data ? (data.msg ? data.msg : undefined) : "Couldn't connect to Binance."
    return { id: 0, name: 'Binance', errorMsg, symbol, price: data.price ? data.price : undefined }
}
export const bitfinexMapper = (data, symbol) => {
    let errorMsg = data ? (data.message ? data.message : undefined) : "Couldn't connect to Bitfinex."
    return { id: 1, name: 'Bitfinex', errorMsg, symbol, price: data.last_price }
}
export const huobiMapper = (data, symbol) => {
    let errorMsg = data ? (data['err-msg'] ? data['err-msg'] : undefined) : "Couldn't connect to Huobi."
    return { id: 2, name: 'Huobi', errorMsg, symbol, price: data.tick?.open }
}
export const krakenMapper = (data, symbol) => {
    let errorMsg = data ? (data.error ? data.error[0] : undefined) : "Couldn't connect to Kraken."
    return { id: 3, name: 'Kraken', errorMsg, symbol, price: data.result ? data.result[Object.keys(data.result)[0]].l[0] : undefined }
}

export const fetchAndUpdateResults = (searchInput, setFinalData, setShowResults) => {
    Promise.all([
        fetch(`${corsProxy + binanceApiBaseUrl + searchInput.toUpperCase()}`),
        fetch(`${corsProxy + bitfinexApiBaseUrl + searchInput}`),
        fetch(`${corsProxy + huobiApiBaseUrl + searchInput.toLowerCase()}`),
        fetch(`${corsProxy + krakenApiBaseUrl + searchInput.toUpperCase()}`)
    ]).then((responses) => {
        return Promise.all(responses.map((response) => {
            return response.json();
        }));
    }).then((jsonData) => {
        return setFinalData([
            binanceMapper(jsonData[0], searchInput),
            bitfinexMapper(jsonData[1], searchInput),
            huobiMapper(jsonData[2], searchInput),
            krakenMapper(jsonData[3], searchInput),
        ]);
    }).then(() => {
        setShowResults(true)
    }).catch((err) => {
        console.log(err);
    })
}

// Details
export const binanceDetailsMapper = data => {
    return data.map(dataItem => {
        return { qty: dataItem.qty, price: dataItem.price }
    })
}
export const bitfinexDetailsMapper = data => {
    return data.map(dataItem => {
        return { qty: dataItem[2], price: dataItem[3] }
    })
}
export const huobiDetailsMapper = data => {
    return data.data.map(dataItem => {
        return { qty: dataItem.data[0].amount, price: dataItem.data[0].price }
    })
}
export const krakenDetailsMapper = data => {
    return data.result[Object.keys(data.result)[0]].asks.map(dataItem => {
        return { qty: dataItem[1], price: dataItem[0] }
    })
}

export const fetchAndUpdateDetails = (item, setModalContent, setShowModalContent) => {
    let url, mapper;

    switch (item.name) {
        case "Binance":
            url = binanceHistoryUrl + item.symbol.toUpperCase()
            mapper = binanceDetailsMapper;
            break;
        case "Bitfinex":
            url = bitfinexHistoryUrl + item.symbol.toUpperCase() + "/hist?limit=5";
            mapper = bitfinexDetailsMapper;
            break;
        case "Huobi":
            url = huobHistoryUrl + item.symbol.toLowerCase();
            mapper = huobiDetailsMapper;
            break;
        case "Kraken":
            url = krakenHistoryUrl + item.symbol.toUpperCase();
            mapper = krakenDetailsMapper;
            break;
    };

    fetch(corsProxy + url)
        .then((response) => {
            return response.json();
        }).then((jsonData) => {
            return setModalContent(mapper(jsonData));
        }).then(() => {
            setShowModalContent(true)
        }).catch((err) => {
            console.log(err);
        })
}