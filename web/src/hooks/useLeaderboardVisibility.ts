import { useCallback, useEffect, useRef, useState } from "react";

export const useLeaderboardVisibility = () => {
  const [visiblePositions, setVisiblePositions] = useState<Set<number>>(new Set());
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const elementsMap = useRef<Map<number, HTMLElement>>(new Map());

  // Callback ref to capture the scroll container when it mounts
  const scrollContainerRef = useCallback((node: HTMLElement | null) => {
    setScrollContainer(node);
  }, []);

  // Create observer when scroll container becomes available
  useEffect(() => {
    if (!scrollContainer) return;

    // Disconnect previous observer if any
    observerRef.current?.disconnect();

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
        root: scrollContainer,
        threshold: 0.5,
      },
    );

    // Observe any elements that were registered before the observer was created
    elementsMap.current.forEach((el) => {
      observerRef.current?.observe(el);
    });

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [scrollContainer]);

  const observeEntry = useCallback(
    (el: HTMLElement | null, position: number) => {
      // Get previously registered element for this position
      const prevEl = elementsMap.current.get(position);

      // If same element, nothing to do
      if (prevEl === el) return;

      // If element is being removed (null) or replaced, unobserve the old one
      if (prevEl) {
        observerRef.current?.unobserve(prevEl);
        elementsMap.current.delete(position);
      }

      // Register and observe the new element
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

  return { scrollContainerRef, visiblePositions, observeEntry, getMaxVisiblePosition };
};
