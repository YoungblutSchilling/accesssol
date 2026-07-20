import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import axe from 'axe-core'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('AccessSol demo workbench', () => {
  it('has no detectable axe violations outside layout-dependent contrast checks', async () => {
    const { container } = render(<App />)
    const result = await axe.run(container, { rules: { 'color-contrast': { enabled: false } } })
    expect(result.violations).toEqual([])
  })

  it('implements arrow-key tab selection and focus', async () => {
    const user = userEvent.setup()
    render(<App />)
    const credential = screen.getByRole('tab', { name: 'Credential' })
    const permission = screen.getByRole('tab', { name: 'Permission' })

    credential.focus()
    await user.keyboard('{ArrowRight}')

    expect(permission).toHaveAttribute('aria-selected', 'true')
    expect(permission).toHaveFocus()
    expect(screen.getByRole('heading', { name: 'Update programme permission' })).toBeInTheDocument()
  })
})
