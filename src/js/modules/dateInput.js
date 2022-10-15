const dateInput = () => {
    const date = document.querySelector("#date");
    
    const currentDate = new Date();
    let year = currentDate.getFullYear().toString();
    let month = (currentDate.getMonth() + 1).toString();
    let day = currentDate.getDate().toString();
    
    date.value = year + "-" + month + "-" + day;
    console.log(year + "-" + month + "-" + day)
}

export default dateInput;