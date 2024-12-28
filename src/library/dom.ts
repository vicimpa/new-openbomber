import { assign, entries } from "./object";

type Props<E extends HTMLElement> = Partial<E> & {
  ref?: (elem: E) => void;
  appendTo?: Element;
};

export const dom = <K extends keyof HTMLElementTagNameMap>(
  type: K,
  props: Props<HTMLElementTagNameMap[K]> = {},
  ...children: Element[]
) => {
  const _elem = document.createElement(type);
  const { ref, appendTo, ..._props } = props;

  entries(_elem).forEach(([key, value]) => {
    if (key in _props) {
      if (typeof _elem[key] !== 'object')
        assign(_elem, { [key]: value });
      else if (_elem[key])
        assign(_elem[key], { [key]: value });
    }
  });

  ref?.(_elem);

  children.forEach(child => {
    _elem.appendChild(child);
  });

  appendTo?.appendChild(_elem);

  return _elem;
};

export const body = () => {
  return document.body;
};