import { useState } from "react"
import type { ProviderInfo } from "../types"

type Props = {
  providers: ProviderInfo[]
  connectedProviderIDs: string[]
  currentModelID: string | null
  onSelect: (modelID: string) => void
  onClose: () => void
}

export default function ModelPicker({ providers, connectedProviderIDs, currentModelID, onSelect, onClose }: Props) {
  const [filter, setFilter] = useState("")

  const filterLower = filter.trim().toLowerCase()

  const connected = providers
    .filter((p) => connectedProviderIDs.includes(p.id))
    .map((p) => {
      const models = filterLower
        ? Object.fromEntries(
            Object.entries(p.models).filter(
              ([id, m]) =>
                m.name.toLowerCase().includes(filterLower) ||
                id.toLowerCase().includes(filterLower) ||
                p.name.toLowerCase().includes(filterLower)
            )
          )
        : p.models
      return { ...p, models }
    })
    .filter((p) => Object.keys(p.models).length > 0)

  return (
    <div className="mpicker-overlay" onClick={onClose}>
      <div className="mpicker-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="mpicker-header">
          <span className="mpicker-title">Select model</span>
          <button className="mpicker-close" onClick={onClose} aria-label="Close">
            <i className="ti ti-x" />
          </button>
        </div>
        <div className="mpicker-filter-row">
          <input
            className="mpicker-filter"
            placeholder="Filter providers or models…"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            autoFocus
          />
        </div>
        <div className="mpicker-list">
          {connected.map((provider) => (
            <div key={provider.id} className="mpicker-group">
              <div className="mpicker-provider">{provider.name}</div>
              {Object.entries(provider.models).map(([id, model]) => (
                <button
                  key={id}
                  className={`mpicker-item${currentModelID === id ? " active" : ""}`}
                  onClick={() => { onSelect(id); onClose() }}
                >
                  <span className="mpicker-model-name">{model.name}</span>
                  <span className="mpicker-model-id">{id}</span>
                  {currentModelID === id && (
                    <i className="ti ti-check mpicker-check" />
                  )}
                </button>
              ))}
            </div>
          ))}
          {connected.length === 0 && (
            <div className="mpicker-empty">
              {filterLower ? "No matching models" : "No connected providers"}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
