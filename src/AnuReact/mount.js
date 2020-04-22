import Component from "./Component";
import { createVElement } from "./createElement";
import { isPlainDom, isTextNode, isComponent } from './utils'

const mount = (vElement, parentNode) => {
  if (isTextNode(vElement)) {
    let tNode = document.createTextNode(vElement);
    parentNode.appendChild(tNode);
    return tNode;
  }

  if (isPlainDom(vElement)) {
    let vElm = createVElement(vElement);
    parentNode.appendChild(vElm.dom);
    return vElm.dom;
  }

  if (isComponent(vElement)) {
    // check for functional component
    let instance = new vElement.type(vElement.props);
    if (!(instance instanceof Component)) {
      let vElm = createVElement(vElement.type(vElement.props));
      parentNode.appendChild(vElm.dom);
      return vElm.dom;
    }


    const nextVDom = instance.render();

    instance._currentVDom = nextVDom;
    instance._parentNode = parentNode;

    vElement._instance = instance;
    let dom = mount(nextVDom, parentNode);
    vElement.dom = dom;

    return dom;
  }
};

export { mount };
