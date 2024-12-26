import { Box } from "@chakra-ui/react";
import { SearchResultsProps } from "./types";
import { focusElement } from "@/utils";

export function SearchResults({
  results,
  inputRef,
  onSelect,
  error,
  isLoading,
}: SearchResultsProps) {
  if (error) return null;

  if (results.length === 0 && isLoading) {
    return null;
  }

  if (results.length === 0) {
    return <Box padding="4px">No results found</Box>;
  }

  return (
    <>
      {results.map((item) => (
        <Box
          key={item.id}
          padding="4px"
          cursor="pointer"
          onClick={() => onSelect(item)}
          onKeyDown={(ev) => {
            if (ev.key === "Enter") {
              ev.preventDefault();
              onSelect(item);
            }

            if (ev.key === "Escape") {
              ev.preventDefault();
              ev.currentTarget?.blur();
            }

            if (
              ev.key === "ArrowUp" &&
              ev.currentTarget.previousElementSibling
            ) {
              ev.preventDefault();
              focusElement(ev.currentTarget.previousElementSibling);
            }

            if (
              ev.key === "ArrowUp" &&
              !ev.currentTarget.previousElementSibling
            ) {
              ev.preventDefault();
              focusElement(inputRef.current);
            }

            if (ev.key === "ArrowDown" && ev.currentTarget.nextElementSibling) {
              ev.preventDefault();
              focusElement(ev.currentTarget.nextElementSibling);
            }

            if (
              ev.key === "ArrowDown" &&
              !ev.currentTarget.nextElementSibling
            ) {
              ev.preventDefault();
              focusElement(ev.currentTarget.parentElement?.children[0]);
            }
          }}
          _hover={{
            bgColor: "bg.subtle",
          }}
          _focus={{
            bgColor: "bg.subtle",
          }}
          role="option"
          tabIndex={0}
        >
          {item.type === "repo" ? (
            <>
              {item.name}
              <Box as="span" ml={2} color="fg.muted">
                {item.owner}/{item.name}
              </Box>
            </>
          ) : (
            item.name
          )}
        </Box>
      ))}
    </>
  );
}
