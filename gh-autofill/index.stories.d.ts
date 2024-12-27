import { StoryObj } from '@storybook/react';
import { GhAutofill } from './index';
declare const meta: {
    component: typeof GhAutofill;
    render: ({ ...args }: import('./types').GhAutofillProps) => import("react/jsx-runtime").JSX.Element;
};
export default meta;
type Story = StoryObj<typeof meta>;
export declare const Default: Story;
