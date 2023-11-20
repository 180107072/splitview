import { Orientation } from "./common/splitview";

type Options = {
  orientation: Orientation
}

export class View {
  element: HTMLDivElement;
  orientation: Orientation

  constructor(element: HTMLDivElement, options: Options) {
    this.element = element
    this.orientation = options.orientation
  }

  getPosition() {
    const { left, top } = this.element.getBoundingClientRect()
    if (this.orientation === Orientation.VERTICAL) {
      return top
    }
    return left
  }

  setPosition(position: number) {
    if (this.orientation === Orientation.VERTICAL)
      this.element.style.top = `${position}px`;
    else
      this.element.style.left = `${position}px`;
  }

  fromPointer(e: MouseEvent) {
    return this.orientation === Orientation.VERTICAL ? [e.clientY, Math.sign(e.movementY)] : [e.clientX, Math.sign(e.movementX)]
  }

  setSize(value: number) {
    if (this.orientation === Orientation.VERTICAL)
      this.element.style.height = `${value}px`;
    else
      this.element.style.width = `${value}px`;
  }

  getSize() {
    const { width, height } = this.element.getBoundingClientRect()

    if (this.orientation === Orientation.VERTICAL) {
      return height
    }

    return width
  }
}

