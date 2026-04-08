import { useEffect, useRef } from "react";
import gsap from "gsap";

export const FILL_SPEED = 800;
export const WOBBLE_AMPLITUDE = 3;
export const WOBBLE_FREQUENCY = 40;

export function useLiquidFill(
  rangeStart: Date | null,
  hoverDate: Date | null,
  rangeEnd: Date | null,
  selectionPhase: "idle" | "selecting" | "complete",
  gridRef: React.RefObject<HTMLDivElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
) {
  const liquidAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const wobblePhaseRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const leadingEdgeRef = useRef<{
    x: number;
    y: number;
    height: number;
    active: boolean;
    dampen: number;
    cellLeft: number;
    cellRight: number;
    isRoundedLeft: boolean;
    isRoundedRight: boolean;
  }>({
    x: 0,
    y: 0,
    height: 0,
    active: false,
    dampen: 1,
    cellLeft: 0,
    cellRight: 0,
    isRoundedLeft: false,
    isRoundedRight: false,
  });

  useEffect(() => {
    if (!gridRef.current) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const activeCells = gridRef.current.querySelectorAll(".liquid-fill");
      gsap.set(activeCells, { scaleX: 1, autoAlpha: 1 });
      return;
    }

    const currentTargetDate = rangeEnd || hoverDate;

    if (!rangeStart && !currentTargetDate) {
      if (liquidAnimationRef.current) liquidAnimationRef.current.kill();
      const allCells = gridRef.current.querySelectorAll(".liquid-fill");
      gsap.to(allCells, {
        scaleX: 0,
        duration: 0.3,
        ease: "power2.inOut",
        stagger: { amount: 0.2, from: "center" },
      });
      leadingEdgeRef.current.active = false;
      return;
    }

    if (!rangeStart || !currentTargetDate) return;

    const dates = [rangeStart, currentTargetDate].sort(
      (a, b) => a.getTime() - b.getTime(),
    );
    const [minDate, maxDate] = dates;
    const dayNodes = Array.from(
      gridRef.current.querySelectorAll("[data-date]"),
    ) as HTMLElement[];
    const inRangeNodes = dayNodes.filter((node) => {
      const nodeTime = Number(node.dataset.date);
      return nodeTime >= minDate.getTime() && nodeTime <= maxDate.getTime();
    });

    const outOfRangeNodes = dayNodes.filter(
      (node) => !inRangeNodes.includes(node),
    );
    if (outOfRangeNodes.length > 0) {
      const outFills = outOfRangeNodes
        .map((n) => n.querySelector(".liquid-fill"))
        .filter(Boolean);
      gsap.set(outFills, { scaleX: 0 });
    }

    if (inRangeNodes.length === 0) return;

    if (liquidAnimationRef.current) {
      liquidAnimationRef.current.kill();
    }
    const isDraggingBackwards =
      currentTargetDate.getTime() < rangeStart.getTime();

    const fillSequence = isDraggingBackwards
      ? [...inRangeNodes].reverse()
      : [...inRangeNodes];

    const tl = gsap.timeline({
      onUpdate: () => {},
      onComplete: () => {
        if (selectionPhase === "complete") {
          gsap.to(leadingEdgeRef.current, { dampen: 0, duration: 0.3 });
        }
      },
    });

    if (selectionPhase === "selecting") {
      leadingEdgeRef.current.active = true;
      leadingEdgeRef.current.dampen = 1;
    } else if (selectionPhase === "complete" && leadingEdgeRef.current.active) {
      gsap.to(leadingEdgeRef.current, {
        dampen: 0,
        duration: 0.3,
        onComplete: () => {
          leadingEdgeRef.current.active = false;
        },
      });
    }

    liquidAnimationRef.current = tl;
    let totalDurationCounter = 0;

    fillSequence.forEach((node, index) => {
      const fillElt = node.querySelector(".liquid-fill") as HTMLElement;
      if (!fillElt) return;

      const isLeftMost = node === inRangeNodes[0];
      const isRightMost = node === inRangeNodes[inRangeNodes.length - 1];

      const rect = node.getBoundingClientRect();
      const durationForCell = Math.max(0.05, rect.width / FILL_SPEED);

      gsap.set(fillElt, {
        transformOrigin: isDraggingBackwards ? "right center" : "left center",
      });

      const isLast = index === fillSequence.length - 1;

      tl.to(
        fillElt,
        {
          scaleX: 1,
          ease: "none",
          duration: durationForCell,
          onUpdate: function () {
            if (!leadingEdgeRef.current.active) return;
            const progress = this.progress();
            const gridRect = gridRef.current?.getBoundingClientRect();
            if (!gridRect) return;

            const fillWidth = rect.width * progress;
            let lx = isDraggingBackwards
              ? rect.right - fillWidth
              : rect.left + fillWidth;

            leadingEdgeRef.current = {
              x: lx - gridRect.left,
              y: rect.top - gridRect.top,
              height: rect.height,
              active: true,
              dampen: leadingEdgeRef.current.dampen,
              cellLeft: rect.left - gridRect.left,
              cellRight: rect.right - gridRect.left,
              isRoundedLeft: isLeftMost,
              isRoundedRight: isRightMost,
            };
          },
        },
        totalDurationCounter,
      );

      totalDurationCounter += durationForCell;

      if (index < fillSequence.length - 1) {
        const nextNode = fillSequence[index + 1];
        const nextRect = nextNode.getBoundingClientRect();
        if (nextRect.top !== rect.top) {
          totalDurationCounter += 0.06;
        }
      }
    });
  }, [rangeStart, hoverDate, rangeEnd, selectionPhase, gridRef]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry) {
        canvas.width = entry.contentRect.width;
        canvas.height = entry.contentRect.height;
      }
    });

    if (gridRef.current) {
      resizeObserver.observe(gridRef.current);
    } else {
      resizeObserver.observe(canvas);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const edge = leadingEdgeRef.current;

      if (edge.active && edge.dampen > 0.01) {
        wobblePhaseRef.current -= 0.15;

        const R = edge.height / 2;
        let yMin = 0;
        let yMax = edge.height;

        if (edge.isRoundedLeft && edge.x < edge.cellLeft + R) {
          const dx = edge.cellLeft + R - edge.x;
          const dy = Math.sqrt(Math.max(0, R * R - dx * dx));
          yMin = R - dy;
          yMax = R + dy;
        } else if (edge.isRoundedRight && edge.x > edge.cellRight - R) {
          const dx = edge.x - (edge.cellRight - R);
          const dy = Math.sqrt(Math.max(0, R * R - dx * dx));
          yMin = R - dy;
          yMax = R + dy;
        }

        const trueAmplitude = WOBBLE_AMPLITUDE * edge.dampen;

        ctx.beginPath();
        ctx.strokeStyle = "rgba(59, 130, 246, 0.6)";
        ctx.lineWidth = 3;

        ctx.moveTo(edge.x, edge.y + Math.floor(yMin));

        for (let py = Math.floor(yMin); py <= Math.ceil(yMax); py += 2) {
          const px =
            edge.x +
            Math.sin(
              wobblePhaseRef.current + (py / WOBBLE_FREQUENCY) * Math.PI * 2,
            ) *
              trueAmplitude;
          ctx.lineTo(px, edge.y + py);
        }

        ctx.stroke();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
    };
  }, [canvasRef, gridRef]);
}
