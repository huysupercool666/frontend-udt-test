// import React from 'react'
// import { render, fireEvent, screen } from '@testing-library/react'
// import AppCalculator from './AppCalculator'
// import '@testing-library/jest-dom'

// describe('AppCalculator Component', () => {
//   beforeEach(() => {
//     render(<AppCalculator />)
//   })

//   // Test initial display
//   describe('Initial Render', () => {
//     test('should display default value as 0', () => {
//       const display = screen.getByRole('textbox')
//       expect(display).toHaveValue('0')
//     })

//     test('should display all number and operation buttons', () => {
//       const buttons = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '×', '÷', '=', 'AC', '+/-', '%']
//       buttons.forEach(button => {
//         expect(screen.getByText(button)).toBeInTheDocument()
//       })
//     })
//   })

//   // Test basic operations
//   describe('Basic Operations', () => {
//     test('should perform addition correctly', () => {
//       fireEvent.click(screen.getByText('2'))
//       fireEvent.click(screen.getByText('+'))
//       fireEvent.click(screen.getByText('3'))
//       fireEvent.click(screen.getByText('='))
//       const display = screen.getByRole('textbox')
//       expect(display).toHaveValue('5')
//     })

//     test('should perform subtraction correctly', () => {
//       fireEvent.click(screen.getByText('5'))
//       fireEvent.click(screen.getByText('-'))
//       fireEvent.click(screen.getByText('3'))
//       fireEvent.click(screen.getByText('='))
//       const display = screen.getByRole('textbox')
//       expect(display).toHaveValue('2')
//     })

//     test('should perform multiplication correctly', () => {
//       fireEvent.click(screen.getByText('4'))
//       fireEvent.click(screen.getByText('×'))
//       fireEvent.click(screen.getByText('3'))
//       fireEvent.click(screen.getByText('='))
//       const display = screen.getByRole('textbox')
//       expect(display).toHaveValue('12')
//     })

//     test('should perform division correctly', () => {
//       fireEvent.click(screen.getByText('6'))
//       fireEvent.click(screen.getByText('÷'))
//       fireEvent.click(screen.getByText('2'))
//       fireEvent.click(screen.getByText('='))
//       const display = screen.getByRole('textbox')
//       expect(display).toHaveValue('3')
//     })
//   })

//   // Test special functions
//   describe('Special Functions', () => {
//     test('AC button should clear display to 0', () => {
//       fireEvent.click(screen.getByText('5'))
//       fireEvent.click(screen.getByText('AC'))
//       const display = screen.getByRole('textbox')
//       expect(display).toHaveValue('0')
//     })

//     test('+/- button should toggle number sign', () => {
//       fireEvent.click(screen.getByText('5'))
//       fireEvent.click(screen.getByText('+/-'))
//       const display = screen.getByRole('textbox')
//       expect(display).toHaveValue('-5')
//     })

//     test('% button should calculate percentage', () => {
//       fireEvent.click(screen.getByText('5'))
//       fireEvent.click(screen.getByText('0'))
//       fireEvent.click(screen.getByText('%'))
//       const display = screen.getByRole('textbox')
//       expect(display).toHaveValue('0.5')
//     })
//   })

//   // Test error handling
//   describe('Error Handling', () => {
//     test('should display Error when dividing by zero', () => {
//       fireEvent.click(screen.getByText('5'))
//       fireEvent.click(screen.getByText('÷'))
//       fireEvent.click(screen.getByText('0'))
//       fireEvent.click(screen.getByText('='))
//       const display = screen.getByRole('textbox')
//       expect(display).toHaveValue('Error')
//     })

//     test('should limit input length', () => {
//       const longNumber = '1234567890'
//       longNumber.split('').forEach(num => {
//         fireEvent.click(screen.getByText(num))
//       })
//       const display = screen.getByRole('textbox')
//       expect(display.value.length).toBeLessThanOrEqual(9)
//     })
//   })

//   // Test history feature
//   describe('History Feature', () => {
//     test('View History button should be visible', () => {
//       const historyButton = screen.getByText('View History')
//       expect(historyButton).toBeInTheDocument()
//     })

//     test('should save calculation to localStorage', () => {
//       localStorage.clear()

//       fireEvent.click(screen.getByText('2'))
//       fireEvent.click(screen.getByText('+'))
//       fireEvent.click(screen.getByText('3'))
//       fireEvent.click(screen.getByText('='))

//       const history = JSON.parse(localStorage.getItem('history') || '[]')
//       expect(history).toContain('2 + 3 = 5')
//     })
//   })

//   describe('Continuous Operations', () => {
//     test('should handle multiple operations in sequence', () => {
//       fireEvent.click(screen.getByText('2'))
//       fireEvent.click(screen.getByText('+'))
//       fireEvent.click(screen.getByText('3'))
//       fireEvent.click(screen.getByText('='))
//       fireEvent.click(screen.getByText('×'))
//       fireEvent.click(screen.getByText('4'))
//       fireEvent.click(screen.getByText('='))
//       const display = screen.getByRole('textbox')
//       expect(display).toHaveValue('20')
//     })
//   })
// })
