import { Children, FC, HTMLAttributes, PropsWithChildren, isValidElement, useEffect, useRef } from "react";
import { Orientation } from "./common/splitview";
import { View } from "./view";

type SplitViewProps = {
  orientation?: Orientation
  sash?: FC
  minSize?: number
} & PropsWithChildren & HTMLAttributes<HTMLDivElement>

export const SplitView: FC<SplitViewProps> = ({ orientation = Orientation.HORIZONTAL, minSize = 50, children }) => {
  const index = useRef<null | number>(null);

  const panes = useRef<View[]>([]);
  const sashes = useRef<View[]>([])
  const containerRef = useRef<View | null>(null);

  const addPane = (idx: number, element: HTMLDivElement | null) => {
    if (!element || panes.current[idx] !== undefined) return;

    panes.current[idx] = new View(element, { orientation })
  };

  const addSash = (idx: number, element: HTMLDivElement | null) => {
    if (!element || sashes.current[idx] !== undefined) return;

    sashes.current[idx] = new View(element, { orientation });
  }

  const setView = (element: HTMLDivElement | null) => {
    if (!element) return;

    containerRef.current = new View(element, { orientation });
  }

  const distributeInitialSizes = () => {
    if (!containerRef.current) return

    const viewSize = containerRef.current.getSize()

    const size = viewSize / panes.current.length

    for (let i = 0; i < panes.current.length; i++) {
      const pane = panes.current[i]

      const sash = sashes.current[i]

      pane.setSize(size)
      pane.setPosition(size * i)

      if (!sash) continue;

      sash.setPosition(pane.getSize() * i)
    }
  }

  const getSash = (i: number) => {
    if (!containerRef.current || i === 0) return 0

    const sash = sashes.current[i]

    if (!sash) {
      return containerRef.current.getSize()
    }

    return sash.getPosition()
  }

  const syncSizes = () => {
    for (let i = 0; i < panes.current.length; i++) {
      const pane = panes.current[i]

      const from = getSash(i)
      const to = getSash(i + 1)

      const distance = to - from

      pane.setSize(distance)
      pane.setPosition(from)
    }
  }

  const onDrag = (e: MouseEvent) => {
    if (index.current === null || !containerRef.current) return;

    const sash = sashes.current[index.current]

    let [pointer, direction] = sash.fromPointer(e)

    if (!direction) return

    sash.setPosition(pointer)

    const moveSashes = (i: number) => {
      let stack = 1


      while (true) {
        i += direction

        const sash = sashes.current[i]

        if (!sash) break

        const left = sash.getPosition()

        const distance = (pointer - left) * direction * -1

        if (distance > minSize * stack) break

        sash.setPosition(pointer + minSize * stack * direction)

        stack += 1
      }

    }

    moveSashes(index.current!)
    syncSizes()
  }

  useEffect(() => {
    distributeInitialSizes()

    document.addEventListener("mousemove", onDrag);
    return () => document.removeEventListener("mousemove", onDrag);
  }, [])

  const childrenToRender = Children.toArray(children).filter(isValidElement)

  const sashCount = Array.from({ length: childrenToRender.length - 1 }, (_, i) => i + 1)

  return (
    <div
      ref={setView}
      className='splitview__root'
      onMouseUp={() => index.current = null}
    >
      {childrenToRender.map((child, idx) =>
        <div
          key={idx}
          ref={(ref) => addPane(idx, ref)}
          className='splitview__pane'
        >
          {child}
        </div>
      )}
      {sashCount.map((idx) =>
        <div
          key={idx}
          ref={(ref) => addSash(idx, ref)}
          className={`splitview__sash ${orientation === Orientation.VERTICAL ? 'splitview__sash_vertical' : 'splitview__sash_horizontal'}`}
          onMouseDown={() => index.current = idx}
        />
      )}
    </div>
  );
};
