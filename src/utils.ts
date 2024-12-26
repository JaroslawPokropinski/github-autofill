export function focusElement(element: Element | undefined | null) {
  if (!element) return;
  if (!(element instanceof HTMLElement)) return;

  element.focus();
}
