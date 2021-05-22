import * as Vue from "https://unpkg.com/vue@3.0.11/dist/vue.esm-browser.js";
import { h } from "https://unpkg.com/vue@3.0.11/dist/vue.runtime.esm-browser.js";
import htm from "https://unpkg.com/htm@3.0.4/dist/htm.module.js?module";

import "https://unpkg.com/d3@6.7.0/dist/d3.js";
import "https://unpkg.com/d3-drag@2.0.0/dist/d3-drag.js";
import "https://unpkg.com/d3-zoom@2.0.0/dist/d3-zoom.js";

import * as cola from "./lib/cola.esm.js";

const html = htm.bind(h);
const { d3 } = window;

export { Vue, html, d3, cola };