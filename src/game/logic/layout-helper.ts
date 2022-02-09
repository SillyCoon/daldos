export class LayoutHelper {
  static makeControlButton(
    { name, disabled = false }: { name: string; disabled: boolean },
    clickHandler = null,
  ): HTMLButtonElement {
    const btn = document.createElement('button');
    btn.id = `btn-${name}`;
    btn.textContent = name;
    btn.disabled = disabled;
    if (clickHandler) {
      LayoutHelper.addHandlerTo(btn, 'click', clickHandler);
    }
    return btn;
  }

  static addHandlerTo<T extends keyof HTMLElementEventMap>(
    element: HTMLElement,
    type: T,
    handler: (this: HTMLElement, ev: HTMLElementEventMap[T]) => any,
  ) {
    element.addEventListener<T>(type, handler);
  }
}
