/// <reference types="cypress" />

describe("Homepage", () => {
    beforeEach(() => {
        cy.visit("/")
    })

    it("should display hero section with a small introduction.", () => {
        cy.get(".hero")
            .should('have.text', 'Hi! My name is Jimmy Nguyen I am a Freelance Software Engineer living in the Netherlands who likes to create fully-functional and maintainable software solutions. Currently not available for work.')
        cy.get(".availability").should("exist")
    })

    it("should display about section with different types of text.", () => {
        cy.get(".about-buttons").should("exist")
            .should("contain.text", "Short version")
            .should("contain.text", "Medium version")
            .should("contain.text", "Long version")

        cy.get(".about-text").should("exist")
            .should("contain.text", `Hello! I am a Software Engineer who has a lot of experience in creating quality software for different kinds of businesses!Full-stack development? I got you! Need some help with migrations to the Cloud?I'm your guy! Need a small web application or a huge enterprise application? I can help :)`)

        cy.get(".about-buttons").get('#short-version-button').click({force: true})

        cy.get(".about-text").should("contain.text", "I do cool stuff with computers and code.")

        cy.get(".about-buttons").get('#long-version-button').click({force: true})

        cy.get(".about-text").should("contain.text", "Hello! I am a Software Engineer/Full-stack Developer/Cloud Engineer, living in the Netherlands, who has a lot of experience in creating quality software for different kinds of businesses!")
    })
})