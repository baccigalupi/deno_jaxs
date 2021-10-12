import { RenderKit, Template, TemplateDomCollection } from '../types.ts';
import Children from './Children.ts';

export default class FragmentTag implements Template {
  children: Children;
  dom: TemplateDomCollection;

  constructor(children: Array<Template>) {
    this.children = new Children(children);
    this.dom = [];
  }

  render(renderKit: RenderKit) {
    this.dom = this.children.render(renderKit);
    return this.dom;
  }

  rerender(renderKit: RenderKit) {
    this.dom = this.children.rerender(renderKit);
    return this.dom;
  }

  willChange(_renderKit: RenderKit) {
    return true;
  }

  remove() {
    this.children.remove();
  }
}
