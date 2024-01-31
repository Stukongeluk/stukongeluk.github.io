import { AboutComponent } from "../src/app/about/about.component"

describe('AboutComponent.cy.ts', () => {
  it('should mount', () => {
    cy.mount(AboutComponent)
  })
})