export class Bound {
  constructor(Template, viewModel, attributes) {
    this.Template = Template
    this.viewModel = viewModel
    this.attributes = attributes || {}
  }

  render({ document, props, publish, state }) {
    props = props || {}
    this.viewModelProps = this.viewModel(state)

    this.props = {
      ...this.viewModelProps,
      ...props,
      ...this.attributes
    }

    this.template = this.Template(this.props)

    return this.template.render({
      document,
      publish,
      state,
      props: this.props
    })
  }

  rerender({ document, state, publish }) {
    this.removeListeners()
    this.removeDom()

    return this.render({ document, state, publish }) // props?
  }

  removeListeners() {
    this.template.removeListeners()
  }

  removeDom() {
    this.template.removeDom()
  }
}

export const bind = (Template, viewModel) => {
  return (attributes) => new Bound(Template, viewModel, attributes)
}
