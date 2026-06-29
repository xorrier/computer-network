import { OSI_LAYERS } from "@/data/osiLayers";
import type { OsiLayerId } from "@/types/network";

interface OsiLadderProps {
  activeLayer: OsiLayerId;
  hidden: Set<OsiLayerId>;
  onToggle: (id: OsiLayerId) => void;
}

export function OsiLadder({ activeLayer, hidden, onToggle }: OsiLadderProps) {
  return (
    <div className="osi-ladder">
      <div className="panel-heading">
        <h3>OSI Layers</h3>
        <span className="panel-sub">Toggle visibility · click to focus</span>
      </div>
      <div className="osi-list">
        {OSI_LAYERS.map((layer) => {
          const isActive = layer.id === activeLayer;
          const isHidden = hidden.has(layer.id);
          return (
            <button
              key={layer.id}
              className={
                "osi-row" + (isActive ? " is-active" : "") + (isHidden ? " is-hidden" : "")
              }
              style={{ "--layer": layer.color } as React.CSSProperties}
              onClick={() => onToggle(layer.id)}
              title={isHidden ? "Show layer" : "Hide layer"}
            >
              <span className="osi-num">{layer.number}</span>
              <span className="osi-body">
                <span className="osi-name">{layer.name}</span>
                <span className="osi-pdu mono">{layer.pdu}</span>
              </span>
              {isActive && <span className="osi-active-dot" aria-label="active layer" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
