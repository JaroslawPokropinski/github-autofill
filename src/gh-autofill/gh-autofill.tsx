import { useEffect, useMemo, useRef, useState } from "react";
import { debounce } from "lodash-es";
import { useFetchGh } from "./useFetchGh";
import { Box, Input, Portal, Spinner } from "@chakra-ui/react";
import { useComponentBounds } from "./useComponentBounds";
import { usePageSize } from "./usePageSize";
import { Field } from "@/components/ui/field";
import { CombinedResult, GhAutofillProps, GhRepo, GhUser } from "./types";
import { SearchResults } from "./search-results";
import { focusElement } from "@/utils";

export function GhAutofill({ debounceTime = 500 }: GhAutofillProps) {
  const [inputText, setInputText] = useState("");
  const [debouncedInputText, setDebouncedInputText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const inputBounds = useComponentBounds(inputRef.current);
  const pageSize = usePageSize();

  const debouncedSetInputText = useMemo(
    () => debounce(setDebouncedInputText, debounceTime),
    [debounceTime]
  );

  const updateFocus = () => {
    setIsFocused(
      !!inputRef.current?.contains(document.activeElement) ||
        !!dropdownRef.current?.contains(document.activeElement)
    );
  };

  const handleInputChange = (value: string) => {
    setIsFetching(value.length >= 3); // set fetching to true to immidiately display the spinner
    setDebouncedInputText("");
    setInputText(value);
    debouncedSetInputText(value);
  };

  const {
    data: users,
    error: usersError,
    isFetching: isFetchingUsers,
  } = useFetchGh<GhUser>(
    `https://api.github.com/search/users?${new URLSearchParams({
      q: debouncedInputText,
      per_page: "50",
    }).toString()}`,
    debouncedInputText.length >= 3
  );

  const {
    data: repos,
    error: reposError,
    isFetching: isFetchingRepos,
  } = useFetchGh<GhRepo>(
    `https://api.github.com/search/repositories?${new URLSearchParams({
      q: debouncedInputText,
      per_page: "50",
    }).toString()}`,
    debouncedInputText.length >= 3
  );

  const combinedResults = useMemo<CombinedResult[]>(
    () =>
      [
        ...users.map((user) => ({
          type: "user" as const,
          id: user.id,
          name: user.login,
          url: user.html_url,
        })),
        ...repos.map((repo) => ({
          type: "repo" as const,
          id: repo.id,
          name: repo.name,
          url: repo.html_url,
          owner: repo.owner.login,
        })),
      ].sort((a, b) => a.name.localeCompare(b.name)),
    [users, repos]
  );

  // handle fetching state
  useEffect(() => {
    setIsFetching(isFetchingRepos || isFetchingUsers);
  }, [isFetchingRepos, isFetchingUsers]);

  return (
    <Box>
      {/* Autofill input field */}
      <Field
        invalid={!!usersError || !!reposError}
        errorText={usersError || reposError}
        pos="relative"
      >
        <Input
          type="text"
          placeholder="Type to search..."
          value={inputText}
          onChange={(event) => handleInputChange(event.target.value)}
          ref={inputRef}
          onFocus={() => updateFocus()}
          onBlur={() => setTimeout(() => updateFocus(), 0)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              inputRef.current?.blur();
            }

            if (event.key === "ArrowDown") {
              event.preventDefault();
              focusElement(dropdownRef.current?.children[0]);
            }
          }}
        />

        <Box
          pos="absolute"
          right={0}
          top="50%"
          transform={"translateY(-50%)"}
          paddingX="8px"
        >
          {isFetching && <Spinner />}
        </Box>
      </Field>
      <Portal>
        {/* Dropdown container */}
        {inputBounds && (
          <Box // overlay used to prevent the global scrollbar from appearing
            pos="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            overflow="hidden"
            pointerEvents="none"
            display={
              isFocused &&
              combinedResults.length > 0 &&
              !(usersError || reposError)
                ? "block"
                : "none"
            }
          >
            <Box
              ref={dropdownRef}
              pos="absolute"
              top={`${inputBounds.bottom + 4}px`}
              maxH={`${pageSize.height - inputBounds.bottom - 8}px`}
              left={`${inputBounds.left}px`}
              right={`${pageSize.width - inputBounds.right}px`}
              overflowY="auto"
              bgColor="Background"
              rounded="md"
              paddingY="4px"
              paddingX="8px"
              pointerEvents="auto"
              display={
                isFocused &&
                combinedResults.length > 0 &&
                !(usersError || reposError)
                  ? "block"
                  : "none"
              }
              onFocus={() => updateFocus()}
              onBlur={() => setTimeout(() => updateFocus(), 0)}
            >
              <SearchResults
                results={combinedResults}
                inputRef={inputRef}
                error={!!usersError || !!reposError}
                isLoading={isFetching}
                onSelect={(item) => {
                  handleInputChange(item.name);
                  window.open(item.url, "_blank");
                }}
              />
            </Box>
          </Box>
        )}
      </Portal>
    </Box>
  );
}
