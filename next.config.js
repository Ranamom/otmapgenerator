module.exports = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.node = {
        fs: "empty",
      }
    }

    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: "worker-loader",
      options: {
        filename: "static/[hash].worker.js",
        publicPath: "/_next/",
      },
    })

    return config
  },
}
