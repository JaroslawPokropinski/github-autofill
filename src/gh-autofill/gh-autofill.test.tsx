/* eslint-disable @typescript-eslint/no-explicit-any */
import { screen, waitFor } from "@testing-library/react";
import { GhAutofill } from "./gh-autofill";
import { setup } from "@/test";

describe("GhAutofill", () => {
  beforeEach(() => {
    vitest.useRealTimers();
  });

  it("renders", () => {
    setup(<GhAutofill />);

    const headline = screen.getByPlaceholderText(/Type to search.../i);

    expect(headline).toBeInTheDocument();
  });

  it("searches only after 3 chars", async () => {
    const { user } = setup(<GhAutofill debounceTime={0} />);

    vitest.useFakeTimers({
      shouldAdvanceTime: true,
    });

    const fetchSpy = vitest.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve({}),
    } as any);

    const input = screen.getByPlaceholderText(/Type to search.../i);

    await user.type(input, "abcd");

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(4); // user and repo fetch for c and d (2*2)
    });
  });

  it("has debounced searches", async () => {
    const { user } = setup(<GhAutofill debounceTime={500} />);

    vitest.useFakeTimers({
      shouldAdvanceTime: true,
    });

    const fetchSpy = vitest.spyOn(global, "fetch").mockResolvedValue({
      json: () => Promise.resolve({}),
    } as any);

    const input = screen.getByPlaceholderText(/Type to search.../i);

    await user.type(input, "abcd");

    vitest.advanceTimersByTime(1000);
    vitest.clearAllTimers();

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(2); // user and repo fetch
    });
  });

  it("shows sorted results", async () => {
    // TODO
  });

  it("opens page on click", async () => {
    // TODO
  });

  it("displays error", async () => {
    // TODO
  });

  it("shows empty results message", async () => {
    // TODO
  });

  it("supports keyboard navigation", async () => {
    // TODO
  });
});
