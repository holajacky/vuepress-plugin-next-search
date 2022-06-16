## vuepress-plugin-next-search

[VuePress v2] plugin that adds search box.\
[VuePress v2] 搜索插件.

[vuepress v2]: https://v2.vuepress.vuejs.org/

![Version](https://img.shields.io/npm/v/vuepress-plugin-next-search.svg?style=flat-square&logo=npm)
![Downloads](https://img.shields.io/npm/dm/vuepress-plugin-next-search.svg?style=flat-square&logo=npm)
![Total downloads](https://img.shields.io/npm/dt/vuepress-plugin-next-search?style=flat-square&logo=npm)

**三个源码都看了，没错，咱就是……缝合怪，感谢以下三位作者**\
[leo-buneev/vuepress-plugin-fulltext-search](https://github.com/leo-buneev/vuepress-plugin-fulltext-search)\
[z3by/vuepress-plugin-flexsearch](https://github.com/z3by/vuepress-plugin-flexsearch)\
[ota-meshi/vuepress2-plugin-full-text-search](https://github.com/ota-meshi/vuepress2-plugin-full-text-search)

> 理论上支持所有语言的搜索，只是理论奥！\
> In theory, it supports search in all languages, but in theory!

<h2><a href="http://vuepress-plugin-next-search.holajacky.com" target="_blank">在线文档 / Online Docs</a></h2>

**推荐使用在线文档查看如何使用**\
**Recommend using online documentation to see how to use**

**文档只有中文，来个英语牛B的大佬帮忙更新下英文文档，万分感谢**\
**But the document is only in Chinese,I hope someone kind can help me update the English document**

## 为什么造轮子？

企业内部局域网有一个大型文档，不对外开放，又想全文搜索，所以就有了这个\
同时上面前两位的作品，中文搜索有问题，第三位的作品，样式有问题，所以，就有了咱出手来个回首掏，借花献给全世界的小可爱们（褒义词，蟹蟹）\
There is no need to translate the above sentence

## 安装/Install

```shell
npm i -D vuepress-plugin-next-search
```

## 用法/Usage

```js
const { nextSearchPlugin } = require('vuepress-plugin-next-search')
```

```js
import { nextSearchPlugin } from 'vuepress-plugin-next-search'
```

例如 / e.g.  `.vuepress/config.ts`

```js
  plugins: [
    nextSearchPlugin({
      fullText: true,
      placeholder: '搜索',
      frontmatter: {
        tag: '标签',
        category: '分类',
      }
    }),
  ]
```

或者这样

```js
  plugins: [
    nextSearchPlugin({}),
  ]
```

## 配置/Config

### fullText
类型 / `type：boolean`\
默认值 / `default: true`\
是否开启文章正文搜索/Whether to enable article body search\
默认搜索范围/default search scope：
- 标题 / `title`
- 正文 / `content`
- 标签和分类（如果`frontmatter`内有的话）/`tag`&`category`

如果关掉了这个，插件只是不会再正文内进行搜索，但是还是会在标题和frontmatter内进行搜索的\
If false is selected,Just don't search in the content

如果你想通过`tag`或者`category`搜索的话，你需要在每个.md的`frontmatter`内这样写
举个栗子/e.g.
```md
---
category:
- 分类1
- 分类2
tag:
- 标签1
- 标签2
---
```

默认是开启状态，除非你的文档内容是学术类等文章，内容巨多，否则的话建议开启，
对用户来说0.1秒还是0.2秒出结果，真的无所谓，他们不在乎的------我说的

### placeholder

类型 / `type：string`\
默认值 / `default: '搜索'`\
你懂得，不多BB/YOU KNOW,NO BB

### frontmatter

下面两个是自定义显示文字，大聪明，你懂我的意思吧？

#### tag

类型 / `type：string`\
默认值 / `default: '标签'`

#### category

类型 / `type：string`\
默认值 / `default: '分类'`
