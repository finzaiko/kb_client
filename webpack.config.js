const path = require("path");
const webpack = require("webpack");
const replace = require("replace");
// const CopyPlugin = require("copy-webpack-plugin");
// const WebpackCopyBundle = require("webpack-copy-bundle");

module.exports = function (env) {
  const pack = require("./package.json");
  const MiniCssExtractPlugin = require("mini-css-extract-plugin");

  const production = !!(env && env.production);
  const asmodule = !!(env && env.module);
  const standalone = !!(env && env.standalone);

  const babelSettings = {
    extends: path.join(__dirname, "/.babelrc"),
  };

  let config = {
    mode: production ? "production" : "development",
    entry: {
      myapp: "./sources/myapp.js",
    },
    output: {
      path: path.join(__dirname, "codebase"),
      publicPath: "/codebase/",
      filename: "[name].js",
      chunkFilename: "[name].bundle.js",
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: "babel-loader?" + JSON.stringify(babelSettings),
        },
        {
          test: /\.(svg|png|jpg|gif)$/,
          use: "url-loader?limit=25000",
        },
        {
          test: /\.(less|css)$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"],
        },
      ],
    },
    stats: "minimal",
    resolve: {
      extensions: [".js"],
      modules: ["./sources", "node_modules"],
      alias: {
        "jet-views": path.resolve(__dirname, "sources/views"),
        "jet-locales": path.resolve(__dirname, "sources/locales"),
      },
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
      new webpack.DefinePlugin({
        VERSION: `"${pack.version}"`,
        APPNAME: `"${pack.name}"`,
        PRODUCTION: production,
        BUILD_AS_MODULE: asmodule || standalone,
        "process.env": {
          APP_NAME: JSON.stringify(pack.app_name) || "App",
          ENDPOINT: JSON.stringify(env.endpoint),
        },
      }),
	  /*
      new CopyPlugin({
      	patterns: [
      	  { from: "codebase/myapp.css", to: "../www/" },
      	  { from: "codebase/myapp.js", to: "../www/" },
      	],
        }),
		*/
      // new WebpackCopyBundle({
      //   myapp: "../www/",
      // }),
    ],
    devServer: {
      client: {
        logging: "error",
      },
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      static: __dirname,
      historyApiFallback: true,
    },
  };

  if (!production) {
    config.devtool = "inline-source-map";
  }

  if (asmodule) {
    if (!standalone) {
      config.externals = config.externals || {};
      config.externals = ["webix-jet"];
    }

    const out = config.output;
    const sub = standalone ? "full" : "module";

    out.library = pack.name.replace(/[^a-z0-9]/gi, "");
    out.libraryTarget = "umd";
    out.path = path.join(__dirname, "dist", sub);
    out.publicPath = "/dist/" + sub + "/";
  }

  // ARIFIN

  replace({
	regex: "<title>(.*?)</title>",
	replacement: `<title>${pack.app_name}</title>`,
	paths: ["./index.html"],
	recursive: false,
	silent: false,
  });
  replace({
	regex: "<title>(.*?)</title>",
	replacement: `<title>${pack.app_name}</title>`,
	paths: ["./www/index.html"],
	recursive: false,
	silent: false,
  });

  const build = new Date() * 1;
  replace({
    regex: /[?][0-9]+/g,
    replacement: `?${build}`,
    paths: ["./docker-config/index.html"],
    recursive: true,
    silent: true,
  });
  replace({
    regex: /[?][0-9]+/g,
    replacement: `?${build}`,
    paths: ["./www/index.html"],
    recursive: true,
    silent: true,
  });

  return config;
};
