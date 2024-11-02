const fetchBbApi = async ({ service, method, params = {} }) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/${service}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Math.floor(Math.random() * 1001).toString(),
        method: method,
        params: params,
      })
    })

    if(!response) {
      throw new BBException(`Status: ${response.status}`)
    }

    if(response.status !== 200) {
      throw new BBException(`Status: ${response.status}`, {status: response.status})
    }

    const data = await response.json()

    if(!data) {
      throw new BBException(`No data`)
    }

    if(data.error) {
      throw new BBException(data.error.message || `Unknown error`, data.error)
    }

    if(!data.result) {
      throw new BBException(`Unknown error`)
    }

    return data.result

  } catch (error) {
    console.log('fetchBbApi error', {service, method, params, error})
    return {
      error: true,
      message: `${error.toString()}`,
      data: error.data,
    }
  }
}

const fetchPrices = async () => {
  const requests = [
    {
      fromCurrency: "BTC",
      toCurrency: "CRC",
    },
    {
      fromCurrency: "BTC",
      toCurrency: "USD",
    },
    {
      fromCurrency: "USD",
      toCurrency: "BTC",
    },
    {
      fromCurrency: "CRC",
      toCurrency: "BTC",
    },
  ];

  try {
    const results = await Promise.all(
      requests.map(async (req) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api-pricer`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify({
            jsonrpc: "2.0",
            id: Math.floor(Math.random() * 1001).toString(),
            method: "getUserRate",
            params: {
              element: req,
            },
          }),
        });

        if (!response.ok) {
          throw new BBException(`Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data) {
          throw new BBException(`No data`);
        }

        if (data.error) {
          throw new BBException(data.message || `Unknown error`, data.error);
        }

        return data;
      })
    );

    return results;
  } catch (error) {
    console.log('fetchPrices error', { error });
    return {
      error: true,
      message: `${error.toString()}`,
      data: error.data,
    };
  }
};

const fetchUsdCrcRate = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api-pricer`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Math.floor(Math.random() * 1001).toString(),
        method: "getRate",
        params: {
          element: {
            fromCurrency: "USD",
            toCurrency: "CRC",
          },
        },
      })
    })

    if(!response) {
      throw new BBException(`Status: ${response.status}`)
    }

    const data = await response.json()

    if(!data) {
      throw new BBException(`No data`)
    }

    if(data.error) {
      throw new BBException(data.message || `Unknown error`, data.error)
    }

    return data

  } catch (error) {
    console.log('fetchPrices error', {error})
    return {
      error: true,
      message: `${error.toString()}`,
      data: error.data,
    }
  }
}

const BBException = (message, data = null) => {
  const error = new Error(message);
  error.data = data;
  return error;
}

export { fetchBbApi, fetchPrices, fetchUsdCrcRate }