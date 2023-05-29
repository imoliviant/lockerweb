const accordinContent = document.querySelectorAll(".accordion-content");

accordinContent.forEach((item, index) => {
    let header = item.querySelector("header");
    header.addEventListener("click", () => {
        item.classList.toggle("open");

        let text = item.querySelector(".description");
        if(item.classList.contains("open")){
            text.style.height = `${text.scrollHeight}px`;
            item.querySelector('i').classList.replace("fa-caret-down", "fa-caret-up");
        } else {
            text.style.height = "0px";
            item.querySelector('i').classList.replace("fa-caret-up", "fa-caret-down");
        }
        console.log(text);
    })
})