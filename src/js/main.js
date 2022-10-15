import dateInput from "./modules/dateInput";
import currencyWidget from "./modules/currencyWidget";
import converter from "./modules/converter";

window.addEventListener("DOMContentLoaded", () => {
    "use strict";
    dateInput();
    currencyWidget();
    converter();
})