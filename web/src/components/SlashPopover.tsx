import type { CommandInfo } from "../types"

type Props = {
  commands: CommandInfo[]
  activeIndex: number
  onSelect: (cmd: CommandInfo) => void
  onHover: (index: number) => void
}

export default function SlashPopover({ commands, activeIndex, onSelect, onHover }: Props) {
  if (commands.length === 0) return null

  return (
    <div className="slash-popover">
      {commands.map((cmd, index) => (
        <button
          key={cmd.name}
          type="button"
          className={`slash-item${index === activeIndex ? " active" : ""}`}
          onMouseDown={(e) => { e.preventDefault(); onSelect(cmd) }}
          onTouchStart={(e) => {
            // Record touch start position so we can detect scroll vs tap
            const touch = e.touches[0]
            const startY = touch.clientY
            const startX = touch.clientX

            const onTouchEnd = (endEvt: TouchEvent) => {
              e.currentTarget.removeEventListener("touchend", onTouchEnd)
              const t = endEvt.changedTouches[0]
              const dy = Math.abs(t.clientY - startY)
              const dx = Math.abs(t.clientX - startX)
              if (dy < 8 && dx < 8) {
                endEvt.preventDefault()
                onSelect(cmd)
              }
            }
            e.currentTarget.addEventListener("touchend", onTouchEnd, { once: true })
          }}
          onMouseEnter={() => onHover(index)}
        >
          <span className="slash-name">/{cmd.name}</span>
          {cmd.description && (
            <span className="slash-description">{cmd.description}</span>
          )}
        </button>
      ))}
    </div>
  )
}
