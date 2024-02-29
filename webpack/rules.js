/*
 * @Author: SongQian
 * @LastEditors: SongQian
 * @Date: 2022/06/23 16:26
 * @eMail: onlylove117225594632vip.qq.com
 * @Description: 这是一个魔术，来自Author创作，需要修改请留下大名~!
 */
/**
 * Developer    :   SongQian
 * Time         :   2019/03/09
 * eMail        :   onlylove1172559463@vip.qq.com
 * Description  :   生产编译处理配置
 */
const tsTransformPaths = require('@zerollup/ts-transform-paths');

module.exports = function (miniCssExtractPlugin) {
  
  const JS_Loader = {
    test: /\.(js|jsx|tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets:[['@babel/preset-env', { targets : { node: "current" } }]]
      }
    }
  }

  const TS_Loader = {
    test : /\.ts$/,
    loader: 'ts-loader',
    exclude: /node_modules/,
    options: {
      getCustomTransformers: (program) => {
        const transformer = tsTransformPaths(program);
        return {
          before: [transformer.before],
          afterDeclarations: [transformer.afterDeclarations]
        };
      }
    }
  }

  var URL_Loaer = {
    test: /\.(png|jpg|gif)$/i,
    type: 'asset',
    generator: {
      filename:  'assets/images/[name].[ext]?cache=[hash:8]'
    }
  }

  var SASS_Loader = {
    test: /\.(sa|sc|c)ss$/i,
    use: [
      miniCssExtractPlugin.loader,
      { loader: 'css-loader', options: { url: true, sourceMap: false } },
      { loader: 'sass-loader' }
    ]
  }

  var File_Loader = {
    test: /\.(eot|ttf|otf|woff|woff2|svg)$/i,
    type: "asset/resource",
    generator: {
      filename: 'assets/css/font/[name].[ext]'
    }
  }

  var JSON_Loader = {
    test: /\.json$/i,
    type: "asset/resource",
    generator: {
      filename: 'assets/data/[name].[hash:8].json'
    }
  }

  return [
    JS_Loader,
    TS_Loader,
    URL_Loaer,
    SASS_Loader,
    File_Loader,
    JSON_Loader
  ]
}