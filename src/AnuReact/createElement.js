import { mount } from "./mount";
import { isEvent } from './utils'

const createElement = (type, props, ...children) => {
  // children.flat() allows us to do <ul>{childs}</ul>
  return { type, props, children: children.flat(), dom: null };
};

const createVElement = vElement => {
  let vdom = document.createElement(vElement.type);
  let props = vElement.props;

  for (const propName in props) {
    if (isEvent(propName)) {
      let eventType = propName.substr(2).toLocaleLowerCase();
      vdom.addEventListener(eventType, props[propName]);
      continue;
    } else {
      vdom[propName] = props[propName]
    }
  }

  if (vElement.children) {
    vElement.children.forEach(child => {
      mount(child, vdom);
    });
  }
  vElement.dom = vdom;
  return vElement;
};

export { createElement, createVElement };
