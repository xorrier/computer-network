import { useState } from "react";
import type { DeviceKind, Lesson, OsiLayerId } from "@/types/network";
import { useStepPlayer } from "@/components/animation/useStepPlayer";
import { PlaybackControls } from "@/components/animation/PlaybackControls";
import { NetworkCanvas } from "@/components/network/NetworkCanvas";
import { OsiLadder } from "@/components/panels/OsiLadder";
import { PacketInspector } from "@/components/panels/PacketInspector";
import { StepNarration } from "@/components/panels/StepNarration";
import { DeviceInfoPanel } from "@/components/panels/DeviceInfoPanel";

interface LessonViewProps {
  lesson: Lesson;
}

export function LessonView({ lesson }: LessonViewProps) {
  const player = useStepPlayer({ stepCount: lesson.steps.length });
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | undefined>();
  const [drawerKind, setDrawerKind] = useState<DeviceKind | null>(null);
  const [hiddenLayers, setHiddenLayers] = useState<Set<OsiLayerId>>(new Set());

  const step = lesson.steps[player.index]!;

  const handleSelectDevice = (id: string) => {
    setSelectedDeviceId(id);
    const kind = lesson.devices.find((d) => d.id === id)?.kind ?? null;
    setDrawerKind(kind);
  };

  const toggleLayer = (id: OsiLayerId) => {
    setHiddenLayers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // When the active layer is hidden, dim the canvas to reinforce the toggle.
  const stageDimmed = hiddenLayers.has(step.layer);

  return (
    <div className="lesson">
      <aside className="lesson-rail lesson-rail--left">
        <OsiLadder activeLayer={step.layer} hidden={hiddenLayers} onToggle={toggleLayer} />
      </aside>

      <section className="lesson-stage">
        <div className={"stage-canvas" + (stageDimmed ? " is-dimmed" : "")}>
          <NetworkCanvas
            devices={lesson.devices}
            links={lesson.links}
            step={step}
            progress={player.progress}
            onSelectDevice={handleSelectDevice}
            selectedDeviceId={selectedDeviceId}
          />
          {stageDimmed && (
            <div className="stage-dim-note">
              Layer {step.layer} hidden — re-enable it on the left to see this step.
            </div>
          )}
        </div>

        <StepNarration step={step} index={player.index} total={lesson.steps.length} />
        <PlaybackControls player={player} stepCount={lesson.steps.length} />
      </section>

      <aside className="lesson-rail lesson-rail--right">
        <PacketInspector step={step} />
      </aside>

      <DeviceInfoPanel kind={drawerKind} onClose={() => setDrawerKind(null)} />
    </div>
  );
}
