// https://docs.cypress.io/api/introduction/api.html

describe("Test texts are displayed", () => {
  it("visits the app root url and check header text", () => {
    cy.visit("/");
    cy.contains("header", "Granuteo Get your weather anywhere, anytime");
  });

  it("Test the presence of city input text helper", () => {
    cy.contains("Search a city from which display the weather:");
  });
});
