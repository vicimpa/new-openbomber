import { assign, entries } from "./object";

type PropsElement<E extends HTMLElement> = {
  [K in keyof E]: E[K] extends string ? (
    K
  ) : E[K] extends object ? (
    K extends 'style' ? K : never
  ) : K extends `on${string}` ? (
    K
  ) : E[K] extends string ? (
    K
  ) : never
}[keyof E];

type Props<E extends HTMLElement> = {
  [K in PropsElement<E>]?: K extends 'style' ? (
    Partial<E[K]> & {
      [_: `--${string}`]: any;
    }
  ) : E[K]
} & {
  ref?: (elem: E) => void;
  appendTo?: Element;
};

export const dom = <K extends keyof HTMLElementTagNameMap>(
  type: K,
  props: Props<HTMLElementTagNameMap[K]> = {},
  ...children: (Node | string)[]
) => {
  const _elem = document.createElement(type);
  const { ref, appendTo, ..._props } = props;

  entries(_props)
    .forEach(([key, value]) => {
      if (key.toString().startsWith('on')) {
        assign(_elem, { [key]: value });
        return;
      }

      if (key in _props) {
        if (typeof _elem[key] !== 'object')
          assign(_elem, { [key]: value });
        else if (_elem[key])
          assign(_elem[key], value as any);
      }

    });

  ref?.(_elem);

  children.forEach(child => {
    if (typeof child === 'string')
      child = document.createTextNode(child);

    _elem.appendChild(child);
  });

  appendTo?.appendChild(_elem);

  return _elem;
};

export const body = () => {
  return document.body;
};