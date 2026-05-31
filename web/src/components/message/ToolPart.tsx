import { useState } from "react"
import type { MessageEnvelope } from "../../types"
import { formatToolParams } from "./messageHelpers"

export default function ToolPartDisplay({ part }: { part: { tool: string; state: NonNullable<MessageEnvelope["parts"][0]["state"]> } }) {
  const [expandLevel, setExpandLevel] = useState(0) // 0=collapsed, 1=command, 2=command+output
  const state = part.state
  if (!state) return null

  const statusIcon = state.status === "completed" ? "✓" : state.status === "error" ? "✗" : state.status === "running" ? "⟳" : "○"
  const statusClass = state.status
  const params = formatToolParams(state.input)
  const hasOutput = state.status === "completed" || state.status === "error"
  const output = state.status === "completed" ? state.output : state.status === "error" ? state.error : ""
  const title = state.status === "completed" || state.status === "running" ? state.title : undefined

  function handleClick() {
    if (expandLevel === 0) {
      setExpandLevel(1)
    } else if (expandLevel === 1 && hasOutput) {
      setExpandLevel(2)
    } else {
      setExpandLevel(0)
    }
  }

  const canExpand = Boolean(params || hasOutput)

  return (
    <div className={`tool-part ${statusClass}`}>
      <div className="tool-header" onClick={canExpand ? handleClick : undefined} style={{ cursor: canExpand ? "pointer" : "default" }}>
        <span className={`tool-status ${statusClass}`}>{statusIcon}</span>
        <span className="tool-name">{part.tool}</span>
        {title && <span className="tool-title">{title}</span>}
        {canExpand && (
          <span className="tool-chevron">
            {expandLevel === 2 ? "▲" : expandLevel === 1 ? "▼" : "›"}
          </span>
        )}
      </div>
      {expandLevel >= 1 && params && (
        <div className="tool-params">
          <pre>{params}</pre>
        </div>
      )}
      {expandLevel >= 2 && output && (
        <div className="tool-output">
          <pre>{output}</pre>
        </div>
      )}
    </div>
  )
}
