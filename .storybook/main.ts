import type { StorybookConfig } from '@storybook/react-vite';
import react from '@vitejs/plugin-react-swc';
const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: {
    autodocs: 'tag',
  },
  // async viteFinal(config) {
  //   config.plugins = [react()]
  //   return config;
  // }
};
export default config;
