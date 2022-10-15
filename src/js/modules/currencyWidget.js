const currencyWidget = async () => {
    const response = await fetch("https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json");
    const data = await response.json();
    const result = await data;

    const usdRates = document.querySelector('[data-value="USD"]');
    const eurRates = document.querySelector('[data-value="EUR"]');
    const gbpRates = document.querySelector('[data-value="GBP"]');

    result.forEach((item) => {
        switch (item['cc']) {
            case "USD":
                usdRates.textContent = item["rate"].toFixed(2);
                break;
            case "EUR":
                eurRates.textContent = item["rate"].toFixed(2);
                break;
            case "GBP":
                gbpRates.textContent = item["rate"].toFixed(2);
        }
    })

    const getZero = (n) => {
        if (n <= 9) {
            return `0${n}`;
        } else {
            return n;
        }
    }

    const previousDay = () => {
        let currentDateArr = result[0]["exchangedate"].split(".");

        if (currentDateArr[0] !== "01") {
            currentDateArr[0] = getZero(currentDateArr[0] - 1);
        } else {
            if (currentDateArr[1] === '02' || currentDateArr[1] === '04' || currentDateArr[1] === '06' || currentDateArr[1] === '08' || currentDateArr[1] === '09' || currentDateArr[1] === '11') {
                currentDateArr[0] = "31";
                currentDateArr[1] = getZero(currentDateArr[1] - 1);
            } else if (currentDateArr[1] === '05' || currentDateArr[1] === '07' || currentDateArr[1] === '10' || currentDateArr[1] === '12') {
                currentDateArr[0] = "30";
                currentDateArr[1] = getZero(currentDateArr[1] - 1);
            } else if (currentDateArr[1] === '01') {
                currentDateArr[0] = "31";
                currentDateArr[1] = "12";
                currentDateArr[2] = currentDateArr[2] - 1;
            } else if (currentDateArr[1] === '03') {
                if (+currentDateArr[2] % 4 !== 0) {
                    currentDateArr[0] = "28";
                    currentDateArr[1] = getZero(currentDateArr[1] - 1);
                } else {
                    currentDateArr[0] = "29";
                    currentDateArr[1] = getZero(currentDateArr[1] - 1);
                }
            }
        }
        return currentDateArr;
    }

    let prevDate = previousDay().reverse().join("");

    const prevDayResponse = await fetch(`https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${prevDate}&json`);
    const prevDaydata = await prevDayResponse.json();
    const prevdayResult = await prevDaydata;

    let prevUsdRate;
    let prevEurRate;
    let prevGbpRate;

    prevdayResult.forEach((item) => {
        switch (item['cc']) {
            case "USD":
                prevUsdRate = item["rate"].toFixed(2);
                break;
            case "EUR":
                prevEurRate = item["rate"].toFixed(2);
                break;
            case "GBP":
                prevGbpRate = item["rate"].toFixed(2);
        }
    })

    const currencyChange = () => {
        if (usdRates.textContent > prevUsdRate) {
            usdRates.classList.add("decrease", "decrease-arrow")
        } else {
            usdRates.classList.add("increase", "increase-arrow")
        }

        if (eurRates.textContent > prevEurRate ) {
            eurRates.classList.add("decrease", "decrease-arrow")
        } else {
            eurRates.classList.add("increase", "increase-arrow")
        }

        if (gbpRates.textContent > prevGbpRate) {
            gbpRates.classList.add("decrease", "decrease-arrow")
        } else {
            gbpRates.classList.add("increase", "increase-arrow")
        }
    }

    currencyChange();
}

export default currencyWidget;