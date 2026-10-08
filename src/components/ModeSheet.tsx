"use client";

import { Check, ChevronLeft, Shuffle, ShieldCheck, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MODE_INFO, getModeInfo } from "@/lib/modes";
import type { Level, Mode } from "@/types/game";
import { hasDarkConsent, setDarkConsent } from "@/utils/modePrefs";

type Step = "mode" | "consent" | "level";

type ModeSheetProps = {
  open: boolean;
  currentModes: Mode[];
  currentLevel: Level | null;
  onApply: (modes: Mode[], level: Level | null) => void;
  onClose: () => void;
};

function toggle(modes: readonly Mode[], mode: Mode): Mode[] {
  return modes.includes(mode) ? modes.filter((m) => m !== mode) : [...modes, mode];
}

export function ModeSheet({ open, currentModes, currentLevel, onApply, onClose }: ModeSheetProps) {
  const [step, setStep] = useState<Step>("mode");
  const [selected, setSelected] = useState<Mode[]>(currentModes);
  const [wasOpen, setWasOpen] = useState(open);
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstOptionRef = useRef<HTMLButtonElement>(null);

  // Reset to the first step each time the sheet opens. Adjusting state during render (rather
  // than in an effect) avoids an extra render pass — see https://react.dev/learn/you-might-not-need-an-effect.
  if (open !== wasOpen) {
    setWasOpen(open);
    if (open) {
      setStep("mode");
      setSelected(currentModes);
    }
  }

  useEffect(() => {
    if (!open) return;
    // Let the sheet (re)render its new step before focusing, so screen readers announce it first.
    const id = requestAnimationFrame(() => firstOptionRef.current?.focus());
    return () => cancelAnimationFrame(id);
  }, [open, step]);

  if (!open) return null;

  function toggleMode(mode: Mode) {
    const info = getModeInfo(mode);
    const turningOn = !selected.includes(mode);
    if (turningOn && info.requiresConsent && !hasDarkConsent()) {
      setStep("consent");
      return;
    }
    setSelected((prev) => toggle(prev, mode));
  }

  function confirmConsent() {
    setDarkConsent();
    setSelected((prev) => toggle(prev, "dark"));
    setStep("mode");
  }

  function applySelection() {
    if (selected.length === 0) return;
    const soleLeveled = selected.length === 1 ? getModeInfo(selected[0]).levels : undefined;
    if (soleLeveled) {
      setStep("level");
      return;
    }
    onApply(selected, null);
    onClose();
  }

  function pickLevel(level: Level | null) {
    onApply(selected, level);
    onClose();
  }

  const soleMode = selected.length === 1 ? getModeInfo(selected[0]) : undefined;

  return (
    <div
      className="sheet-overlay"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") onClose();
      }}
    >
      <div
        ref={dialogRef}
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mode-sheet-title"
      >
        <div className="sheet-head">
          {step !== "mode" ? (
            <button type="button" className="icon-btn" onClick={() => setStep("mode")} aria-label="Quay lại bước trước">
              <ChevronLeft size={20} aria-hidden />
            </button>
          ) : (
            <span className="w-11" aria-hidden="true" />
          )}
          <h2 id="mode-sheet-title" className="font-display text-lg font-extrabold">
            {step === "mode" && "Chọn bộ câu hỏi"}
            {step === "consent" && "Xác nhận độ tuổi"}
            {step === "level" && soleMode?.label}
          </h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Đóng">
            <X size={20} aria-hidden />
          </button>
        </div>

        {step === "mode" && (
          <div className="sheet-body">
            <p className="sheet-hint">Chọn một hoặc nhiều bộ câu hỏi — có thể trộn lẫn với nhau.</p>
            {MODE_INFO.map((info, index) => {
              const checked = selected.includes(info.id);
              return (
                <button
                  key={info.id}
                  ref={index === 0 ? firstOptionRef : undefined}
                  type="button"
                  role="checkbox"
                  aria-checked={checked}
                  className="mode-option"
                  data-accent={info.accent}
                  data-active={checked}
                  onClick={() => toggleMode(info.id)}
                >
                  <span className="mode-option-icon">
                    <info.Icon size={22} aria-hidden />
                  </span>
                  <span className="mode-option-text">
                    <span className="mode-option-label">{info.label}</span>
                    <span className="mode-option-tagline">{info.tagline}</span>
                  </span>
                  <span className="option-checkbox" data-checked={checked} aria-hidden="true">
                    {checked && <Check size={14} strokeWidth={3} aria-hidden />}
                  </span>
                </button>
              );
            })}
            <button type="button" className="btn btn-primary mt-2 w-full" disabled={selected.length === 0} onClick={applySelection}>
              Áp dụng{selected.length > 1 ? ` (${selected.length} bộ)` : ""}
            </button>
          </div>
        )}

        {step === "consent" && (
          <div className="sheet-body">
            <div className="consent-box">
              <ShieldCheck size={28} aria-hidden />
              <p className="consent-title">Nội dung dành cho người từ 18 tuổi trở lên</p>
              <p className="consent-text">
                Dark Mode chứa nội dung gợi cảm, thân mật dành cho các cặp đôi trưởng thành, đồng thuận. Bạn có thể bỏ
                qua bất kỳ câu nào và đổi mức độ bất cứ lúc nào.
              </p>
            </div>
            <button
              ref={firstOptionRef}
              type="button"
              className="btn btn-primary w-full"
              onClick={confirmConsent}
            >
              Tôi đã đủ 18 tuổi, tiếp tục
            </button>
            <button type="button" className="btn btn-ghost w-full" onClick={() => setStep("mode")}>
              Quay lại
            </button>
          </div>
        )}

        {step === "level" && soleMode?.levels && (
          <div className="sheet-body">
            {(() => {
              // Only highlight a level as "current" if this exact single mode is already applied.
              const isCurrentSelection = currentModes.length === 1 && currentModes[0] === selected[0];
              return (
                <>
                  <button
                    ref={firstOptionRef}
                    type="button"
                    className="level-option"
                    data-accent={soleMode.accent}
                    data-active={isCurrentSelection && currentLevel == null}
                    onClick={() => pickLevel(null)}
                  >
                    <span className="level-option-rank">
                      <Shuffle size={16} aria-hidden />
                    </span>
                    <span className="level-option-text">
                      <span className="level-option-label">Tất cả cấp độ</span>
                      <span className="level-option-hint">Trộn ngẫu nhiên mọi giai đoạn</span>
                    </span>
                  </button>
                  {soleMode.levels.map((levelInfo) => (
                    <button
                      key={levelInfo.value}
                      type="button"
                      className="level-option"
                      data-accent={soleMode.accent}
                      data-active={isCurrentSelection && levelInfo.value === currentLevel}
                      onClick={() => pickLevel(levelInfo.value)}
                    >
                      <span className="level-option-rank">{levelInfo.value}</span>
                      <span className="level-option-text">
                        <span className="level-option-label">{levelInfo.label}</span>
                        <span className="level-option-hint">{levelInfo.hint}</span>
                      </span>
                    </button>
                  ))}
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
