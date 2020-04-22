import Component from "./Component";
import { mount } from "./mount";
import { createElement } from "./createElement";

const AnuReact = {
  Component,
  createElement,
  render: mount,
};
export { Component, createElement }
export default AnuReact;
