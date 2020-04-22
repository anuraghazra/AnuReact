import Component from "./Component";
import { createVElement } from "./createElement";
import { isNew, isNewEvent, isOldEvent } from './utils'

function diff(oldTree, newTree) {
  if (!newTree) return [];
  if (oldTree.type !== newTree.type) return newTree;
  if (oldTree === newTree) return oldTree;

  if (typeof oldTree === "string" && typeof newTree === "string") {
    return newTree;
  }
  if (typeof oldTree === "number" && typeof newTree === "number") {
    return newTree;
  }
  newTree.dom = oldTree.dom;
  if (oldTree.type === newTree.type) {
    diffAttribs(oldTree, newTree);
    diffChildren(oldTree.children, newTree.children, newTree);
  }
}

function diffAttribs(oldTree, newTree) {
  let prevProps = oldTree.props || {};
  let nextProps = newTree.props || {};
  let dom = newTree.dom;

  // remove old event listeners
  let prevPropNames = Object.keys(prevProps);
  let nextPropNames = Object.keys(nextProps);


  // remove old event listeners
  prevPropNames
    .filter(name => isOldEvent(prevProps, nextProps, name))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      dom.removeEventListener(eventType, prevProps[name])
    })
  // add new event listeners
  nextPropNames
    .filter(name => isNewEvent(prevProps, nextProps, name))
    .forEach(name => {
      let eventType = name.toLocaleLowerCase().substr(2)
      newTree.dom.addEventListener(eventType, nextProps[name])
    })

  // remove old attribs
  prevPropNames
    .filter(name => !(name in nextProps))
    .forEach(name => newTree.dom[name] = '')

  // add new attribs
  nextPropNames
    .filter(name => isNew(prevProps, nextProps, name))
    .forEach(name => newTree.dom[name] = nextProps[name])
}

function diffChildren(oldTreeChilds, newTreeChilds, parentNode) {
  let oldChildLength = oldTreeChilds.length;
  let newChildLength = newTreeChilds.length;

  let length =
    oldChildLength > newChildLength ? oldChildLength : newChildLength;

  for (let i = 0; i < length; i++) {
    let prevNode = oldTreeChilds[i];
    let nextNode = newTreeChilds[i];

    if (typeof prevNode === "undefined" && nextNode) {
      let vElm = createVElement(nextNode);
      parentNode.dom.appendChild(vElm.dom);
      return;
    }
    if (typeof nextNode === "undefined" && prevNode) {
      parentNode.dom.removeChild(prevNode.dom);
      return;
    }

    // compare text node
    let isText = () =>
      (typeof prevNode === "number" && typeof nextNode === "number") ||
      (typeof prevNode === "string" && typeof nextNode === "string");

    if (isText()) {
      if (prevNode !== nextNode) {
        parentNode.dom.textContent = nextNode;
      }
    }

    // diff Components
    if (
      typeof prevNode.type === "function" &&
      typeof nextNode.type === "function"
    ) {
      let { _instance } = prevNode;

      // TODO: fix Functional component not updating
      if (!(_instance instanceof Component)) {
        // let vElm = createVElement(nextNode.type(nextNode.props));
        // console.log(prevNode)
        // diff(prevNode, nextNode.type(nextNode.props), parentNode.dom);
        continue
      }
      let { _currentVDom } = _instance;

      // get props
      // let prevProps = prevNode.props;
      let nextProps = nextNode.props;

      nextNode.dom = prevNode.dom;
      nextNode._instance = _instance;
      // update props
      nextNode._instance.props = nextProps;

      const prevVNode = _currentVDom;
      const nextVNode = _instance.render();

      nextNode._instance._currentVDom = nextVNode;
      diff(prevVNode, nextVNode, _instance._parentNode);
    }

    if (typeof prevNode === "object" && typeof nextNode === "object") {
      diff(prevNode, nextNode, prevNode.dom);
    }
  }
}

export default diff;
