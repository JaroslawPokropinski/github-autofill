import { useEffect, useState } from "react";

export function useFetchGh<T>(url: string, condition?: boolean) {
  const [isFetching, setIsFetching] = useState(false);
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    if (condition === false) {
      setData([]);
      setError("");
      return;
    }
    setIsFetching(true);

    const abortController = new AbortController();
    fetch(url, {
      signal: abortController.signal,
    })
      .then(async (response) => {
        const isJson = response.headers.get("content-type")?.includes("json");
        if (!response.ok) {
          const json = isJson ? await response.json() : undefined;
          throw new Error(
            json?.message || response.statusText || "Unknown error"
          );
        }

        if (!isJson) {
          throw new Error("Response type is invalid");
        }

        return response.json();
      })
      .then((data: { items?: T[] }) => {
        setData(data.items ?? []);
        setError("");
      })
      .catch((error: Error) => {
        if (error.name === "AbortError") return;

        setData([]);
        setError(error.message);
      })
      .finally(() => {
        setIsFetching(false);
      });

    return () => {
      abortController.abort();
    };
  }, [condition, url]);

  return { isFetching, data, error };
}
