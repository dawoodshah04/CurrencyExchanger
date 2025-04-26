const API_KEY = "25073c690ff6e87f15bdbe2d";
const BASE_URL = "https://v6.exchangerate-api.com/v6";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button"); // Fixed selector
const from = document.querySelector(".from select");
const to = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// Populate dropdowns with currency options
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "PKR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let imgTag = element.parentElement.querySelector("img");
  imgTag.src = newSrc;
};

const getExchangeRate = async () => {
  const amount = document.querySelector(".amount input");
  let amountValue = amount.value;
  
  // Show loading state
  msg.textContent = "Getting exchange rate...";
  btn.disabled = true;
  
  if(amountValue === "" || amountValue <= 0) {
    amountValue = 1;
    amount.value = "1";
  }

  const URL = `${BASE_URL}/${API_KEY}/pair/${from.value}/${to.value}/${amountValue}`;
  
  try {
    const response = await fetch(URL);
    const data = await response.json();
    
    if (data.result === "success") {
      const finalAmount = data.conversion_result.toFixed(2);
      msg.textContent = `${amountValue} ${from.value} = ${finalAmount} ${to.value}`;
    } else {
      throw new Error(data.error-type || "Currency conversion failed");
    }
  } catch (error) {
    msg.textContent = "An error occurred. Please try again.";
    console.error(error);
  } finally {
    btn.disabled = false;
  }
};

btn.addEventListener("click", async (evt) => {
  evt.preventDefault();
  getExchangeRate();
});

// Initialize exchange rate on load
getExchangeRate();