import React from 'react';
import {render, fireEvent, waitFor, screen} from '@testing-library/react'
import '@testing-library/jest-dom'

import About from  "./About"

describe("<About />", () => {
    test("render default about medium text", () => {
        render(<About />)

        expect(screen.queryByText("Full-stack development?")).toBeVisible()
    })
})