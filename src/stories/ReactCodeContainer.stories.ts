import 'react-virtualized/styles.css';
import 'highlight.js/styles/atom-one-dark.css';

import type { Meta, StoryObj } from '@storybook/react';

import { ReactCodeContainer } from '../index';
import { code } from './code';

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'Example/ReactCodeContainer',
  component: ReactCodeContainer,
  tags: ['autodocs'],
  argTypes: {},
} satisfies Meta<typeof ReactCodeContainer>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Default: Story = {
  args: {
    code: code,
    showLineNumber: true,
    language: 'jsx',
  },
};
