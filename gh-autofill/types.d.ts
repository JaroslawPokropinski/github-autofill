export type GhAutofillProps = {
    debounceTime?: number;
    openOnClick?: boolean;
};
export type SearchResultsProps = {
    results: CombinedResult[];
    onSelect: (item: CombinedResult) => void;
    error?: boolean;
    isLoading?: boolean;
    inputRef: React.RefObject<HTMLInputElement>;
};
export type GhUser = {
    id: number;
    login: string;
    html_url: string;
};
export type GhRepo = {
    id: number;
    name: string;
    owner: GhUser;
    html_url: string;
};
export type CombinedResult = {
    type: "user" | "repo";
    id: number;
    name: string;
    url: string;
    owner?: string;
};
