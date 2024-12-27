import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "./components/ui/provider";

export function setup(jsx: JSX.Element) {
  return {
    user: userEvent.setup(),
    ...render(<Provider>{jsx}</Provider>),
  };
}
