import { navbar } from "./navbar";
import { sidebar } from "./sidebar";
import  { hopeTheme } from  "vuepress-theme-hope";

const theme = hopeTheme({
  pure: false,
  repo: "https://github.com/holajacky/vuepress-plugin-next-search",
  repoLabel: "Github",
  iconAssets: "iconfont",
  fullscreen: true,
  logo: "images/home.gif",
  navbar,
  sidebar,
  author: "holajacky",
  themeColor: {
    blue: "#2196f3",
    red: "#f26d6d",
    orange: "#fb9b5f",
    purple: "#b96ad9",
    pink: "#ff95ca"
  },
  navbarLayout: {
    left: ["Brand"],
    center: [],
    right: ["Search","Links","Language","Repo","Outlook"],
  },
  editLink: true,
  editLinkPattern: ":repo/blob/:branch/docs/:path",
  lastUpdated: true,
  contributors: false,
  blog: {
    avatar: "images/home.gif",
    name: "holajacky",
    description: "求求你，不要再卷了😭",
    intro: "https://github.com/holajacky/vuepress-plugin-next-search",
    medias: {
        Github: "https://github.com/holajacky/",
    }
  },
  plugins: {
    blog: true,
    mdEnhance: {
        container: true,
        tabs: true,
        codetabs: true,
        footnote: true,
        tasklist: true,
        align: true,
        sub: true,
        sup: true,
        mark: true,
        imageSize: true,
    },
  }
})

export { theme }
