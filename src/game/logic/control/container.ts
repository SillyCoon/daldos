import { BaseControl } from './base-control';

export class Container implements BaseControl {
  constructor(className: string, id = '') {
    const nativeContainer = document.createElement('div');
    nativeContainer.className = className;
    nativeContainer.id = id;
    this.nativeElement = nativeContainer;
  }

  nativeElement: HTMLDivElement;

  remove(element: HTMLElement | BaseControl) {
    if ('nativeElement' in element) {
      this.nativeElement.removeChild(element.nativeElement);
    } else {
      this.nativeElement.removeChild(element);
    }
  }

  append(...elements: HTMLElement[]) {
    const nativeElements = elements.map(element => this.extractNativeFrom(element));
    this.nativeElement.append(...nativeElements);
  }

  appendElement(element: HTMLElement) {
    this.nativeElement.appendChild(this.extractNativeFrom(element));
  }

  prepend(element: HTMLElement) {
    this.nativeElement.prepend(this.extractNativeFrom(element));
  }

  get parent() {
    return this.nativeElement.parentElement;
  }

  private extractNativeFrom(element: HTMLElement | BaseControl) {
    return 'nativeElement' in element ? element.nativeElement : element;
  }
}
