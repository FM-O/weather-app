describe("Inputs and cities list are displayed and interactive", () => {
  const cityInput = "#city-input";
  const citiesResultArea = ".cs-cities-searched";

  it("should display an input text", () => {
    cy.visit("/");
    cy.get(cityInput).should("be.visible");
  });

  it("should display a list of suggested cities", () => {
    cy.get(citiesResultArea)
      .should("be.visible")
      .find("li")
      .should("have.length", 3)
      .eq(0)
      .contains("Paris");

    cy.get(citiesResultArea).find("li").eq(1).contains("New York");

    cy.get(citiesResultArea).find("li").eq(2).contains("Shanghai");
  });

  it("should fill the city's input and show results", () => {
    cy.intercept(
      "get",
      `https://api.openweathermap.org/geo/1.0/direct?q=Lyon&limit=5&appid=9ca60a667e3c849942c2b0261f7aa955`,
      {
        fixture: "city-results.json",
      }
    ).as("getCities");

    cy.get(cityInput).type("Lyon");

    cy.wait("@getCities");

    cy.get(citiesResultArea)
      .find("li")
      .should("have.length.gt", 0)
      .contains("Lyon");
  });
});

describe("Weather slots are displayed and filled", () => {
  const citiesResultArea = ".cs-cities-searched";
  const weatheButton = '[data-cy="get-weather-button"]';
  const weatherTimeslotsContainer = '[data-cy="weather-timeslots-container"]';
  const timeslot = '[data-cy="timeslot"]';

  it("should display the get weather button", () => {
    cy.get(citiesResultArea)
      .find("li")
      .eq(0)
      .click()
      .then(() => {
        cy.get(weatheButton).should("be.visible");
      });
  });

  it("should display the weather slots for the 5 next days", () => {
    cy.get(weatheButton)
      .click()
      .then(() => {
        cy.get(weatherTimeslotsContainer).should("be.visible");
        cy.get(timeslot).should("have.length.gt", 0);
      });
  });

  it("should have the weather slot filled with date", () => {
    cy.get(timeslot)
      .find(".w-item-date")
      .contains(
        /[a-zA-Z]+\s[a-zA-Z]{3}\s\d{2}:\d{2}:\d{2}|\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/
      );
  });

  it("should have the weather slot filled with weather trend", () => {
    cy.get(timeslot)
      .find(".w-item-trend")
      .find(".trend-icon")
      .should("be.visible");

    cy.get(timeslot).find(".w-item-trend").contains(/[a-z]/i);
  });

  it("should have the weather slot filled with temperatures", () => {
    const degreesRegex = /\d{2}[/.\d{2}]{0,1}\sC°/;

    cy.get(timeslot)
      .find(".w-item-temp")
      .should("be.visible")
      .contains(degreesRegex);

    cy.get(timeslot).find(".w-item-min-temp").contains(degreesRegex);

    cy.get(timeslot).find(".w-item-max-temp").contains(degreesRegex);
  });

  it("should have the weather slot filled with wind and humidity data", () => {
    cy.get(timeslot)
      .find(".w-item-wind")
      .contains(/\d+[/.\d{2}]{0,1}\skm\/h/);

    cy.get(timeslot)
      .find(".w-item-humidity")
      .contains(/\d{2}%/);
  });
});

describe("Weather chart is displayed and shows data", () => {
  it("should display the weather chart and the tracker line", () => {
    cy.get(".w-highcharts").should("be.visible");

    cy.get(".highcharts-tracker-line").should("be.visible");
  });
});
