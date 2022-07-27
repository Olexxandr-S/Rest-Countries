const pirateFlag = "../images/Pirate_Flag.png";
const regionSelect = document.querySelector("#region");
const subregionSelect = document.querySelector("#subregion");
const countriesDiv = document.querySelector("#countries");
const countriesInfo = document.querySelector("#countriesInfo");

const lowerCase = (string) => {
  const newText = string.toLowerCase();
  return newText;
};

const regions = ["Africa", "America", "Asia", "Europe", "Oceania"];
let subregions = [];
let countries = [];

if (subregions.length == 0) {
  subregionSelect.setAttribute("disabled", "");
}

for (idx in regions) {
  let option = document.createElement("option");
  option.text = regions[idx];
  option.setAttribute("value", regions[idx]);
  regionSelect.appendChild(option);
}

regionSelect.addEventListener("change", (event) => {
  subregionSelect.replaceChildren([]);
  countriesDiv.replaceChildren([]);
  countriesInfo.replaceChildren([]);
  countries = [];

  fetch(`https://restcountries.com/v3.1/region/${event.target.value}`)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      for (country of data) {
        countries.push(country);
      }

      let pickSubregionOption = document.createElement("option");
      pickSubregionOption.text = "Pick a subregion";
      pickSubregionOption.value = " ";
      pickSubregionOption.setAttribute("disabled", "disabled");
      pickSubregionOption.setAttribute("hidden", "hidden");
      pickSubregionOption.setAttribute("selected", "selected");
      subregionSelect.appendChild(pickSubregionOption);

      subregions = [...new Set(countries.map((country) => country.subregion))];

      for (subregion of subregions) {
        let option = document.createElement("option");
        option.text = subregion;
        option.setAttribute("value", subregion);
        subregionSelect.appendChild(option);
      }
      subregionSelect.removeAttribute("disabled");
    });
});

subregionSelect.addEventListener("change", (event) => {
  countriesDiv.replaceChildren([]);
  countriesInfo.replaceChildren([]);

  let subregion = event.target.value;
  let subregionCountries = countries.filter(
    (country) => country.subregion === subregion
  );
  subregionCountries.forEach((country) => {
    let h2 = document.createElement("h2");
    h2.innerText =
      country.name.common == "Russia" || country.name.common == "Belarus"
        ? `Fucking ${lowerCase(country.name.common)}`
        : country.name.official;
    h2.className = "country";

    let flag = document.createElement("img");
    flag.alt = `${country.name.common}'s flag`;
    flag.src = `${
      country.name.common == "Russia" || country.name.common == "Belarus"
        ? "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Pirate_Flag_of_Jack_Rackham.svg/744px-Pirate_Flag_of_Jack_Rackham.svg.png"
        : country.flags.png
    }`;

    let div = document.createElement("div");
    div.className = "countriesDiv";
    div.appendChild(h2);
    div.appendChild(flag);

    countriesDiv.appendChild(div);
    h2.addEventListener("click", () => {
      countriesInfo.replaceChildren([]);

      countriesInfo.className = "info";
      let info = document.createElement("h3");
      info.className = "facts";
      info.innerText = "FACTS:";

      let countryCapital = document.createElement("h3");
      countryCapital.innerText = `capital: ${country.capital}`;
      countryCapital.className = "infoMargin";

      let area = document.createElement("h3");
      area.innerText = `area: ${country.area}`;
      area.className = "infoMargin";

      let currencies = document.createElement("ul");
      currencies.className = "uls";
      let currenciesHead = document.createElement("h3");
      currenciesHead.innerText = "Currencies:";
      currencies.appendChild(currenciesHead);
      for (currencyInfo in country.currencies) {
        let currency = document.createElement("li");
        currency.innerText = `${country.currencies[currencyInfo].name} : ${country.currencies[currencyInfo].symbol}`;
        currencies.appendChild(currency);
      }

      let languages = document.createElement("ul");
      languages.className = "uls";
      let languagesHead = document.createElement("h3");
      languagesHead.innerText = "Languages:";
      languages.appendChild(languagesHead);
      for (lng in country.languages) {
        let language = document.createElement("li");
        language.innerText = `${lng} : ${country.languages[lng]}`;
        languages.appendChild(language);
      }

      let view = document.createElement("a");
      view.className = "view";
      view.innerHTML = "View on map &#8658";
      view.href = country.maps.openStreetMaps;
      view.target = "_blank";

      countriesInfo.appendChild(info);
      countriesInfo.appendChild(countryCapital);
      countriesInfo.appendChild(area);
      countriesInfo.appendChild(currencies);
      countriesInfo.appendChild(languages);
      countriesInfo.appendChild(view);
    });
  });
});
