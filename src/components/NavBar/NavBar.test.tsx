import React from 'react';
import {render, fireEvent, screen} from '@testing-library/react'
import '@testing-library/jest-dom'

import NavBar from "./NavBar";

describe("<NavBar />", () => {
    test('loads logo in navbar by default', () => {
        render(<NavBar />)
      
        expect(screen.getByAltText("logo")).toBeVisible()
    });

    test('should display all sections in navbar in normal viewport width', () => {
        render(<NavBar />)

        expect(screen.getByText("About")).toBeVisible()
        expect(screen.getByText("Setup")).toBeVisible()
        expect(screen.getByText("Contact")).toBeVisible()
        expect(screen.getByText("LinkedIn")).toBeVisible()
    })

    test('it should display the hamburger menu with a screen width lower than 720 px', () => {
        global.innerWidth = 500;
        global.dispatchEvent(new Event('resize'));
        render(<NavBar />)

        expect(screen.queryByText("About")).toBeFalsy()
        expect(screen.queryByText("Setup")).toBeFalsy()
        expect(screen.queryByText("Contact")).toBeFalsy()
        expect(screen.queryByText("LinkedIn")).toBeFalsy()

        const navButton = screen.getByRole("button")

        expect(navButton).toHaveClass("border")
        expect(navButton.innerHTML).toContain("svg")
    })

    test('it should display the sections in the hamburger menu items if opened', () => {
        global.innerWidth = 500;
        global.dispatchEvent(new Event('resize'));
        render(<NavBar />)

        fireEvent.click(screen.getByRole("button"))

        expect(screen.queryByText("About")).toBeVisible()
        expect(screen.queryByText("Setup")).toBeVisible()
        expect(screen.queryByText("Contact")).toBeVisible()
    })
});
