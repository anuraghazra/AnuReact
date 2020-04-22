// Conditionals
const isEvent = name => name.startsWith('on');

const isNew = (prev, next, key) => prev[key] !== next[key];

const isNewEvent = (prevProps, nextProps, name) => {
  return isEvent(name) && isNew(prevProps, nextProps, name);
}

const isOldEvent = (prevProps, nextProps, name) => {
  return isEvent(name) && (!(name in nextProps) || isNew(prevProps, nextProps, name))
}

const isTextNode = vnode => typeof vnode === "string" || typeof vnode === "number";
const isPlainDom = vnode => typeof vnode.type === "string";
const isComponent = vnode => typeof vnode.type === "function";


export {
  isEvent,
  isNew,
  isNewEvent,
  isOldEvent,
  isTextNode,
  isPlainDom,
  isComponent
}