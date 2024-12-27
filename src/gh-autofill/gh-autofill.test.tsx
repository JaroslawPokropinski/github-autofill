/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, screen, waitFor, within } from "@testing-library/react";
import { GhAutofill } from "./gh-autofill";
import { setup } from "@/test-utils";
import { vi, MockInstance } from "vitest";

function mockGhFetch(users: string[], repos: string[]) {
  return vi.spyOn(global, "fetch").mockImplementation(async (req) => {
    const items =
      typeof req === "string" && req.includes("users")
        ? users.map((user) => ({
            id: `${user}_id`,
            login: user,
            html_url: `https://github.com/${user}`,
          }))
        : repos.map((repo) => ({
            id: `${repo}_id`,
            name: repo,
            owner: { id: `${users[0]}_id`, login: users[0] },
            html_url: `https://github.com/${users[0]}/${repo}`,
          }));

    return {
      ok: true,
      headers: {
        get() {
          return "application/json";
        },
      } as any,
      json: () =>
        Promise.resolve({
          items,
        }),
    } as Response;
  });
}

describe("GhAutofill", () => {
  let fetchSpy: MockInstance<typeof global.fetch>;
  let windowOpenSpy: MockInstance<typeof window.open>;

  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });

    fetchSpy = mockGhFetch(["c", "a"], ["d", "b"]);

    windowOpenSpy = vi
      .spyOn(window, "open")
      .mockImplementation((() => {}) as any);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("renders", () => {
    setup(<GhAutofill />);

    const headline = screen.getByPlaceholderText(/Type to search.../i);

    expect(headline).toBeInTheDocument();
  });

  it("searches only after 3 chars", async () => {
    const { user } = setup(<GhAutofill debounceTime={0} />);

    const input = screen.getByPlaceholderText(/Type to search.../i);

    await user.type(input, "abcd");

    await waitFor(() => {
      expect(fetchSpy).toHaveBeenCalledTimes(4); // user and repo fetch for c and d (2*2)
    });
  });

  it("has debounced searches", async () => {
    const { user } = setup(<GhAutofill debounceTime={500} />);

    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });

    const input = screen.getByPlaceholderText(/Type to search.../i);

    await user.type(input, "abcd");
    await act(() => vi.advanceTimersByTime(1000));

    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("shows sorted results", async () => {
    const { user } = setup(<GhAutofill />);

    const input = screen.getByPlaceholderText(/Type to search.../i);

    await user.type(input, "abc");
    await act(() => vi.advanceTimersByTime(1000));

    const dropdown = screen.getByRole("menu");
    const results = within(dropdown).getAllByRole("option");
    expect(results[0]).toHaveTextContent("a");
    expect(results[1]).toHaveTextContent("b");
    expect(results[2]).toHaveTextContent("c");
    expect(results[3]).toHaveTextContent("d");
  });

  it("opens page on click", async () => {
    const { user } = setup(<GhAutofill openOnClick />);

    const input = screen.getByPlaceholderText(/Type to search.../i);

    await user.type(input, "abc");
    await act(() => vi.advanceTimersByTime(1000));

    const dropdown = screen.getByRole("menu");
    const results = within(dropdown).getAllByRole("option");

    await user.click(results[0]);

    expect(windowOpenSpy).toHaveBeenCalledTimes(1);
    expect(windowOpenSpy).toHaveBeenCalledWith(
      "https://github.com/a",
      "_blank"
    );
  });

  it("displays error", async () => {
    const { user } = setup(<GhAutofill openOnClick />);

    fetchSpy.mockRejectedValueOnce(new Error("Something went wrong"));

    const input = screen.getByPlaceholderText(/Type to search.../i);

    await user.type(input, "abc");
    await act(() => vi.advanceTimersByTime(1000));

    expect(screen.queryByText("Something went wrong")).toBeTruthy();
  });

  it("shows empty results message", async () => {
    const { user } = setup(<GhAutofill />);

    mockGhFetch([], []);

    const input = screen.getByPlaceholderText(/Type to search.../i);

    await user.type(input, "abc");
    await act(() => vi.advanceTimersByTime(1000));

    expect(screen.queryByText("No results found")).toBeTruthy();
  });

  it("supports keyboard navigation", async () => {
    const { user } = setup(<GhAutofill openOnClick />);

    const input = screen.getByPlaceholderText(/Type to search.../i);

    await user.type(input, "abc");
    await act(() => vi.advanceTimersByTime(1000));

    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{Enter}");

    expect(windowOpenSpy).toHaveBeenCalledTimes(1);
    expect(windowOpenSpy).toHaveBeenCalledWith(
      "https://github.com/c/b",
      "_blank"
    );
  });
});
