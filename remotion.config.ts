import { Config } from '@remotion/cli/config';

Config.setVideoImageFormat('png');
Config.setOverwriteOutput(true);
Config.setEntryPoint('src/index.ts');
// Browser: on CI (GitHub Actions) set REMOTION_BROWSER to the installed Chrome
// binary. Locally it defaults to the VM's headless-Chrome wrapper.
Config.setBrowserExecutable(
  process.env.REMOTION_BROWSER || '/home/hatch/workspace/what-if-studio/chrome-wrapper.sh',
);
