const converter = () => {
    const inputFrom = document.querySelector("#input_from");
    const inputTo = document.querySelector("#input_to")
    const currencyFrom = document.querySelector("#select_curr_from");
    const currencyTo = document.querySelector("#select_curr_to");
    const date = document.querySelector("#date");
    const rateType = document.querySelector("#select_type");
    const switcher = document.querySelector(".switcher_img");

    let selectedDate;
    const dateTransform = () => {
        selectedDate = date.value.split("-").join("");
    }

    const switchCurrencies = () => {
        let right = currencyTo.value;
        currencyTo.value = currencyFrom.value;
        currencyFrom.value = right;
    }

    const getDataNbu = async (currencyName, rateDate) => {
        const response = await fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?valcode=${currencyName}&date=${rateDate}&json`);
        const data = await response.json();
        const result = await data;
        return result;
    }

    const getDataPrvt = async () => {
        const response = await fetch("https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5");
        const data = await response.json();
        const result = await data;
        return result;
    }

    const bindNbuData = async (selectedDate) => {
        if (currencyFrom.value === "UAH" && currencyTo.value !== "UAH") {
            const resultRateTo = await getDataNbu(currencyTo.value, selectedDate);
            inputTo.value = ((1 / resultRateTo[0]["rate"]) * inputFrom.value).toFixed(2);
        } else if (currencyFrom.value !== "UAH" && currencyTo.value === "UAH") {
            const resultRateFrom = await getDataNbu(currencyFrom.value, selectedDate);
            inputTo.value = (resultRateFrom[0]["rate"] * inputFrom.value).toFixed(2);
        } else if (currencyFrom.value === "UAH" && currencyTo.value === "UAH") {
            inputTo.value = inputFrom.value;
        } else {
            const resultRateFrom = await getDataNbu(currencyFrom.value, selectedDate);
            const resultRateTo = await getDataNbu(currencyTo.value, selectedDate);
            inputTo.value = ((resultRateFrom[0]["rate"] / resultRateTo[0]["rate"]) * inputFrom.value).toFixed(2);
        }    
    }

    const bindPrvtData = async () => {
        if (currencyFrom.value === "UAH" && currencyTo.value !== "UAH") {
            const resultRate = await getDataPrvt();
            resultRate.forEach((item) => {
                if (item["ccy"] === currencyTo.value) {
                    inputTo.value = ((1 / item["buy"]) * inputFrom.value).toFixed(2);
                }
            })
        } else if (currencyFrom.value !== "UAH" && currencyTo.value === "UAH") {
            const resultRate = await getDataPrvt();
            resultRate.forEach((item) => {
                if (item["ccy"] === currencyFrom.value) {
                    inputTo.value = (item["buy"] * inputFrom.value).toFixed(2);
                }
            })
        } else if (currencyFrom.value === "UAH" && currencyTo.value === "UAH") {
            inputTo.value = inputFrom.value;
        } else if (currencyFrom.value === "GBP" || currencyTo.value === "GBP") {
            inputTo.value = "There is no GBP rate in Prvtb";
        } else {
            const resultRate = await getDataPrvt();
            let rateFrom;
            let rateTo;
            resultRate.forEach((item) => {
                if (item["ccy"] === currencyFrom.value) {
                    rateFrom = item["buy"]
                } else if (item["ccy"] === currencyTo.value) {
                    rateTo = item["buy"]
                }
            })
            inputTo.value = ((rateFrom / rateTo) * inputFrom.value).toFixed(2);
        }
    }

    const calcActivation = () => {
        if (rateType.value === "NBU") {
            dateTransform();
            bindNbuData(selectedDate)
        } else {
            bindPrvtData()
        }
    }
    
    inputFrom.addEventListener("input", (e) => {
        calcActivation();
    })

    currencyFrom.addEventListener("change", () => {
        calcActivation();
    })

    currencyTo.addEventListener("change", () => {
        calcActivation();
    })

    date.addEventListener("change", () => {
        dateTransform();
        bindNbuData(selectedDate);
    })

    rateType.addEventListener("change", () => {
        calcActivation();
    })

    switcher.addEventListener("click", () => {
        switchCurrencies();
        calcActivation();
    });
}

export default converter;