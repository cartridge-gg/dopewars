import { RefObject, useCallback, useEffect, useRef, useState } from "react";

export const useLeaderboardVisibility = (
  scrollContainerRef: RefObject<HTMLElement>,
) => {
  const [visiblePositions, setVisiblePositions] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsMap = useRef<Map<number, HTMLElement>>(new Map());

  useEffect(() => {
    if (!scrollContainerRef.current) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        setVisiblePositions((prev) => {
          const next = new Set(prev);
          entries.forEach((entry) => {
            const position = parseInt(
              entry.target.getAttribute("data-position") || "-1",
            );
            if (position >= 0) {
              if (entry.isIntersecting) {
                next.add(position);
              } else {
                next.delete(position);
              }
            }
          });
          return next;
        });
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.5,
      },
    );

    elementsMap.current.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [scrollContainerRef]);

  const observeEntry = useCallback(
    (el: HTMLElement | null, position: number) => {
      if (el) {
        el.setAttribute("data-position", position.toString());
        elementsMap.current.set(position, el);
        observerRef.current?.observe(el);
      }
    },
    [],
  );

  const getMaxVisiblePosition = useCallback(() => {
    if (visiblePositions.size === 0) return 0;
    return Math.max(...Array.from(visiblePositions));
  }, [visiblePositions]);

  return { visiblePositions, observeEntry, getMaxVisiblePosition };
};
