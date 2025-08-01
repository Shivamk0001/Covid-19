import { useEffect, useState } from "react";
import {
  FormControl,
  Select,
  MenuItem,
  Card,
  CardContent,
} from "@mui/material";
import InfoBox from "./InfoBox";
import Map from "./Map";
import "./App.css";
import Table from "./Table";
import { sortData, prettyPrintStat } from "./Util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));

          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
          setMapCountries(data);
        });
    };

    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const CountryCode = event.target.value;
    setCountry(CountryCode);

    const url =
      CountryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${CountryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(CountryCode);
        setCountryInfo(data);
        setMapCenter({
          lat: data.countryInfo.lat,
          lng: data.countryInfo.long,
        });
        setMapZoom(4.5);
      });
  };

  console.log("Country Info >>>", countryInfo);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER </h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">
                <h3>Worldwide</h3>
              </MenuItem>

              {countries.map((country) => (
                <MenuItem value={country.value}>
                  <h3>{country.name}</h3>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            onClick={() => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />

          <InfoBox
            onClick={() => setCasesType("recovered")}
            title="Recovered"
            isGreen
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />

          <InfoBox
            onClick={() => setCasesType("deaths")}
            title="Deaths"
            isDark
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

      <Card className="app__right">
        <CardContent>
          <h3 className="app__dataCollection"> Cases By Country</h3>

          <Table countries={tableData} />

          <h3 className="app__graphTitle">World Wide {casesType}</h3>
          <LineGraph className="app__graph" casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
