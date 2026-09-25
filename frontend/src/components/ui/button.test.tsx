import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Button } from "@/components/ui/button"

describe("Button", () => {
  it("クリック時にイベントハンドラーを呼び出す", async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()

    render(<Button onClick={handleClick}>保存</Button>)

    const button = screen.getByRole("button", { name: "保存" })

    expect(button).toBeInTheDocument()

    await user.click(button)

    expect(handleClick).toHaveBeenCalledOnce()
  })
})