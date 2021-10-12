import { RenderKit, Template } from '../types.ts';
import Children from './Children.js';

export default class FragmentTag implements Template {
  children: Children;
  dom: Element | undefined;

  constructor(children: Array<Template>) {
    this.children = new Children(children);
  }

  render(renderKit: RenderKit) {
    this.dom = this.children.render(renderKit) as Element;
    return this.dom;
  }

  rerender(renderKit: RenderKit) {
    this.dom = this.children.rerender(renderKit) as Element;
    return this.dom;
  }

  willChange(_renderKit: RenderKit) {
    return true;
  }

  remove() {
    this.children.remove();
  }
}
