import type { Meta, StoryObj } from "@storybook/react";

import { GhAutofill } from "./index";

const meta = {
  component: GhAutofill,
  render: ({ ...args }) => <GhAutofill openOnClick {...args} />,
} satisfies Meta<typeof GhAutofill>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
