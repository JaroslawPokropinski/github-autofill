import { useCallback, useEffect, useState } from "react";

export function usePageSize() {
  const getPageSize = useCallback(
    () => ({
      width: document.documentElement.clientWidth,
      height: document.documentElement.clientHeight,
    }),
    []
  );

  const [pageSize, setPageSize] = useState(getPageSize());

  // Update the page size when the window is resized
  useEffect(() => {
    const handleResize = () => setPageSize(getPageSize());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [getPageSize]);

  return pageSize;
}
