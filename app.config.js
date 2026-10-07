// Pages settings apply only to the portfolio export, never to EAS/APK builds.
module.exports = ({ config }) => process.env.MINDHUB_PAGES === '1'
  ? {
      ...config,
      web: { ...config.web, bundler: 'metro', output: 'single' },
      experiments: { ...config.experiments, baseUrl: '/MindHub_App' },
    }
  : config;
