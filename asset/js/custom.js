// load spinner
let spinner = isLoad => {
    if (isLoad) document.querySelector("#spinner").classList.replace("d-none", "d-flex");
    else document.querySelector("#spinner").classList.replace("d-flex", "d-none");
}

// copy email address to clipboard
let copyEmailAddress = _ => {
    navigator.clipboard.writeText(localStorage.ns + "@inbox.testmail.app");
    alert("Copied the email address: " + localStorage.ns + "@inbox.testmail.app");
}

// user input validation
let loginValidation = elem => {
    elem.value.trim() !== "" ? elem.parentNode.nextElementSibling.classList.add("d-none") : elem.parentNode.nextElementSibling.classList.remove("d-none");
}

// check namespace and api key exist or not
let isExist = (obj) => {
    if (obj.result !== "success") return false;
}

// get object from json format
let nsKeyFetch = (ns, key) => {
    return fetch(`https://api.testmail.app/api/json?apikey=${key}&namespace=${ns}&pretty=true`).then(r => r.json()).then(get => {
        let exist = isExist(get);

        if (exist === false) {
            document.querySelector(".ci-alert").classList.remove("d-none");

            return false;
        } else return get;
    });
}

// store data with no expiration date
let setStorage = (ns, apikey) => {
    localStorage.ns = ns;
    localStorage.apikey = apikey;
}

// display user email
let displayEmail = async _ => {
    if (localStorage.ns && localStorage.apikey) {
        spinner(true);

        let emailStart = document.querySelector("#email .start");
        let obj;

        await nsKeyFetch(localStorage.ns, localStorage.apikey).then(result => obj = result);
        if (obj.count !== 0) emailStart.innerHTML = "";

        document.getElementById("email-address").innerHTML = `<span onclick="copyEmailAddress();"><i class='bx bx-copy'></i> <span>${localStorage.ns}.{tag}@inbox.testmail.app</span></span>`;

        obj.emails.forEach(email => {
            let startCard = document.createElement("div");
            startCard.classList.add("card", "border-info");
            startCard.innerHTML = `
            <div class="card-header">
                <h6 class="fw-medium mb-0">${email.from}</h6>
                <small>${email.envelope_to}</small>
            </div>
            <div class="card-body">
                <h5 class="card-title fw-bold fs-6">${email.subject}</h5>
                <p class="card-text text-truncate fw-light">${email.text}</p>
            </div>
            `;

            startCard.addEventListener("click", _ => {
                for (let children of startCard.parentNode.children) children.classList.remove("active-email");
                startCard.classList.add("active-email");
                emailStart.nextElementSibling.firstElementChild.innerHTML = `${email.html}`;
                emailStart.classList.remove("active-sidebar");
            });

            emailStart.appendChild(startCard);
        });

        document.getElementById("email").classList.remove("d-none");

        spinner(false);
    } else {
        document.getElementById("login").classList.remove("d-none");
    }
}

// get value from user and check the value is right or wrong then further process
document.querySelector("#btn-login").addEventListener("click", async _ => {
    document.querySelectorAll(".login-box input").forEach((e) => { loginValidation(e); });

    const uiAlert = document.querySelectorAll(".login-box .ui-alert");
    for (let alert of uiAlert) if (!alert.classList.contains("d-none")) return false;

    let ns = document.querySelector("#namespace").value;
    let apikey = document.querySelector("#apikey").value;
    let obj;

    await nsKeyFetch(ns, apikey).then(result => obj = result);
    if (obj === false) return false;

    setStorage(ns, apikey);
    location.href = "./";
});

// clear data from local storage
document.querySelector("#btn-logout").addEventListener("click", _ => {
    localStorage.removeItem("ns");
    localStorage.removeItem("apikey");
    location.href = "./";
});

// activate sidebar
document.querySelector("#btn-toggle").addEventListener("click", _ => {
    document.querySelector("#email .start").classList.toggle("active-sidebar");
});

// show api key
document.querySelector("#show-key").addEventListener("click", function () {
    if (this.lastElementChild.classList.contains("d-none")) {
        document.getElementById("apikey").type = "text";

        this.firstElementChild.classList.add("d-none");
        this.lastElementChild.classList.remove("d-none");
    } else {
        document.getElementById("apikey").type = "password";

        this.firstElementChild.classList.remove("d-none");
        this.lastElementChild.classList.add("d-none");
    }
});

// initial load
onload = _ => {
    displayEmail();
}