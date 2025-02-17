import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import App from '../../client/appCalculator/AppCalculator'
import '@testing-library/jest-dom'

describe('AppCalculator Component', () => {
  beforeEach(() => {
    render(<App />)
  })

  describe('Initial Render', () => {
    test('displays zero as default value', () => {
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('0')
    })

    test('renders all number and operation buttons', () => {
      const buttons = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '+', '-', '×', '÷', '=', 'AC', '+/-', '%']
      buttons.forEach((button) => {
        expect(screen.getByText(button)).toBeInTheDocument()
      })
    })

    test('limits input to 9 characters', () => {
      const longNumber = '1234567890'
      longNumber.split('').forEach((num) => {
        fireEvent.click(screen.getByText(num))
      })
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('123,456,789')
    })
  })

  describe('Basic Operations', () => {
    test('handles empty addition operation', () => {
      fireEvent.click(screen.getByText('+'))
      fireEvent.click(screen.getByText('='))
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('0')
    })

    test('handles multiple operations sequence', () => {
      fireEvent.click(screen.getByText('2'))
      fireEvent.click(screen.getByText('×'))
      fireEvent.click(screen.getByText('-'))
      fireEvent.click(screen.getByText('÷'))
      fireEvent.click(screen.getByText('+'))
      fireEvent.click(screen.getByText('='))
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('4')
    })

    test('performs basic addition', () => {
      fireEvent.click(screen.getByText('2'))
      fireEvent.click(screen.getByText('+'))
      fireEvent.click(screen.getByText('3'))
      fireEvent.click(screen.getByText('='))
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('5')
    })

    test('performs basic subtraction', () => {
      fireEvent.click(screen.getByText('5'))
      fireEvent.click(screen.getByText('-'))
      fireEvent.click(screen.getByText('3'))
      fireEvent.click(screen.getByText('='))
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('2')
    })

    test('performs basic multiplication', () => {
      fireEvent.click(screen.getByText('4'))
      fireEvent.click(screen.getByText('×'))
      fireEvent.click(screen.getByText('3'))
      fireEvent.click(screen.getByText('='))
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('12')
    })

    test('performs basic multiplication', () => {
      fireEvent.click(screen.getByText('4'))
      fireEvent.click(screen.getByText('×'))
      fireEvent.click(screen.getByText('2'))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('16')
    })

    test('displays scientific notation for large multiplication results', () => {
      fireEvent.click(screen.getByText('999,999,999'))
      fireEvent.click(screen.getByText('×'))
      fireEvent.click(screen.getByText('999,999,999'))
      fireEvent.click(screen.getByText('='))
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('1.0e+18')
    })

    test('displays infinity after pressing many times with large numbers', () => {
      fireEvent.click(screen.getByText('999,999,999'))
      fireEvent.click(screen.getByText('×'))
      fireEvent.click(screen.getByText('999,999,999'))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('='))
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('Infinity')
    })

    test('performs basic division', () => {
      fireEvent.click(screen.getByText('6'))
      fireEvent.click(screen.getByText('÷'))
      fireEvent.click(screen.getByText('2'))
      fireEvent.click(screen.getByText('='))
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('3')
    })

    test('displays error on division by zero', () => {
      fireEvent.click(screen.getByText('6'))
      fireEvent.click(screen.getByText('÷'))
      fireEvent.click(screen.getByText('0'))
      fireEvent.click(screen.getByText('='))
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('Error')
    })

    test('performs division with decimal numbers', () => {
      fireEvent.click(screen.getByText('6'))
      fireEvent.click(screen.getByText('÷'))
      fireEvent.click(screen.getByText('2'))
      fireEvent.click(screen.getByText(','))
      fireEvent.click(screen.getByText('5'))
      fireEvent.click(screen.getByText('='))

      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('2.4')
    })
  })

  describe('Special Functions', () => {
    test('clears display when AC button is pressed', () => {
      fireEvent.click(screen.getByText('5'))
      fireEvent.click(screen.getByText('AC'))
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('0')
    })

    test('toggles number to negative', () => {
      fireEvent.click(screen.getByText('5'))
      fireEvent.click(screen.getByText('+/-'))
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('-5')
    })

    test('toggles negative number to positive', () => {
      fireEvent.click(screen.getByText('5'))
      fireEvent.click(screen.getByText('+/-'))
      fireEvent.click(screen.getByText('+/-'))
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('5')
    })

    test('converts number to percentage', () => {
      fireEvent.click(screen.getByText('5'))
      fireEvent.click(screen.getByText('0'))
      fireEvent.click(screen.getByText('%'))
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('0.5')
    })
  })

  describe('Error Handling', () => {
    test('displays error message for division by zero', () => {
      fireEvent.click(screen.getByText('5'))
      fireEvent.click(screen.getByText('÷'))
      fireEvent.click(screen.getByText('0'))
      fireEvent.click(screen.getByText('='))
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('Error')
    })
  })

  describe('History Feature', () => {
    test('renders history button', () => {
      const historyButton = screen.getByText('View History')
      expect(historyButton).toBeInTheDocument()
    })

    test('stores calculation in localStorage', () => {
      localStorage.clear()

      fireEvent.click(screen.getByText('2'))
      fireEvent.click(screen.getByText('+'))
      fireEvent.click(screen.getByText('3'))
      fireEvent.click(screen.getByText('='))

      const history = JSON.parse(localStorage.getItem('history') || '[]')
      expect(history).toContain('2 + 3 = 5')
    })
  })

  describe('Continuous Operations', () => {
    test('processes multiple operations sequentially', () => {
      fireEvent.click(screen.getByText('2'))
      fireEvent.click(screen.getByText('+'))
      fireEvent.click(screen.getByText('3'))
      fireEvent.click(screen.getByText('='))
      fireEvent.click(screen.getByText('×'))
      fireEvent.click(screen.getByText('4'))
      fireEvent.click(screen.getByText('='))
      const display = screen.getByRole('textbox')
      expect(display).toHaveValue('20')
    })
  })
})
