loadEnv(process.env.APP_ENV)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgo: false, // 圧縮無効
          },
        },
      ],
    })
    return config
  },

  images: {
    disableStaticImages: true, // importした画像の型定義設定を無効にする
  },
}

module.exports = nextConfig

/**
 * @param {string} appEnv
 */
function loadEnv(appEnv = "develop") {
  const env = {
    ...require(`./env/env.${appEnv}`),
    NEXT_PUBLIC_APP_ENV: appEnv,
  }

  Object.entries(env).forEach(([key, value]) => {
    process.env[key] = value
  })
}
