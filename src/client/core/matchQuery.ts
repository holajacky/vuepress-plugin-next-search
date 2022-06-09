import { computed, ref, watch } from 'vue'
import type { PageIndex, Suggestion, SearchIndex, SearchIndexRef, Word, Options } from './types'
import type { Ref } from 'vue'

import {
  searchIndex as searchIndexRaw,
  UPD_NAME,
  // @ts-expect-error -- generated from prepare-search-index
} from '@internal/vuepress-plugin-next-search-index'

const searchIndex: SearchIndexRef = ref(searchIndexRaw)
const pathToPage = computed(() => {
  const map = new Map<string, PageIndex>()
  for (const page of searchIndex.value) {
    map.set(page.path, page)
  }
  return map
})

// eslint-disable-next-line @typescript-eslint/naming-convention -- ignore
declare const __VUE_HMR_RUNTIME__: Record<string, any>
if (
  // @ts-expect-error -- ignore
  import.meta.webpackHot ||
  // @ts-expect-error -- ignore
  import.meta.hot
) {
  __VUE_HMR_RUNTIME__[UPD_NAME] = (data: SearchIndex) => {
    searchIndex.value = data
  }
}

export function useSuggestions(query: Ref<string>,options: Options): Ref<Suggestion[]> {
  const suggestions = ref([] as Suggestion[])
  let id: NodeJS.Timeout | null = null
  watch(query, () => {
    if (id) {
      clearTimeout(id)
    }
    id = setTimeout(search, 100)
  })
  return suggestions

  function search() {
    const queryStr = query.value.toLowerCase().trim()
    if (!queryStr) {
      suggestions.value = []
      return
    }
    const suggestionResults = new Map<string, Suggestion[]>()
    const suggestionSubTitles = new Set<string>()
    for (const page of searchIndex.value) {
      for (const suggest of extractSuggestions(page, queryStr ,options)) {
        suggestionSubTitles.add(suggest.parentPageTitle)
        let list = suggestionResults.get(suggest.parentPageTitle)
        if (!list) {
          list = []
          suggestionResults.set(suggest.parentPageTitle, list)
        }
        list.push(suggest)
      }
    }
    const sortedSuggestionSubTitles = [...suggestionSubTitles].sort((a, b) => {
      const listA = suggestionResults.get(a)!
      const listB = suggestionResults.get(b)!
      return listB.length - listA.length
    })
    suggestions.value = [...suggestionResults]
      .flatMap(([, s]) => s)
      .sort(
        (a, b) =>
          sortedSuggestionSubTitles.indexOf(a.parentPageTitle) - sortedSuggestionSubTitles.indexOf(b.parentPageTitle) ||
          a.point - b.point
      )
  }
}

function* extractSuggestions(page: PageIndex, queryStr: string ,options: Options): Iterable<Suggestion> {
  let frontmatter = ''
  if (page.frontmatter?.tag?.length){
    frontmatter += options.frontmatter?.tag + " : " + page.frontmatter?.tag.join("|")
  }
  if (page.frontmatter?.category?.length){
    // @ts-ignore
    frontmatter += ' & ' + options.frontmatter?.category + " : " + page.frontmatter?.category.join("|")
    //console.log(frontmatter);
  }

  const matchTitle = buildMatch(page.title, queryStr)
  if (matchTitle) {
    yield {
      path: page.path,
      parentPageTitle: getParentPageTitle(page),
      title: page.title,
      display: matchTitle,
      frontmatter: page.frontmatter,
      page,
      content: null,
      point: 1,
    }
    return
  }
  const matchFrontmatter = buildMatch(frontmatter, queryStr)
  if (matchFrontmatter) {
    yield {
      path: page.path,
      parentPageTitle: getParentPageTitle(page),
      title: page.title,
      display: matchFrontmatter,
      frontmatter: page.frontmatter,
      page,
      content: null,
      point: 2,
    }
    return
  }
  for (const content of page.contents) {
    const matchHeader = buildMatch(content.header, queryStr)
    if (matchHeader) {
      yield {
        path: page.path + (content.slug ? `#${content.slug}` : ''),
        parentPageTitle: getParentPageTitle(page),
        title: page.title,
        display: matchHeader,
        frontmatter: null,
        page,
        content: null,
        point: 3,
      }
      continue
    }
    const matchContent = buildMatch(content.content, queryStr)
    if (matchContent) {
      yield {
        path: page.path + (content.slug ? `#${content.slug}` : ''),
        parentPageTitle: getParentPageTitle(page),
        title: page.title,
        display: [
          {
            type: 'header',
            str: content.header.trim() ? `${content.header}\n` : ''
          },
          ...matchContent,
        ],
        frontmatter: null,
        page,
        content: null,
        point: 10,
      }
    }
  }
}

function getParentPageTitle(page: PageIndex): string {
  const pathParts = page.path.split('/')
  let parentPagePath = '/'
  if (pathParts[1]) parentPagePath = `/${pathParts[1]}/`

  const parentPage = pathToPage.value.get(parentPagePath) || page
  return parentPage.title
}

function buildMatch(text: string, queryStr: string): Word[] | null {
  const result: Word[] = []
  let totalLength = 0

  const lower = text.toLowerCase().replace(/\s/gu, ' ')
  let start = 0
  let matchIndex = lower.indexOf(queryStr, start)
  if (matchIndex < 0) {
    return null
  }
  while (matchIndex >= 0) {
    const end = matchIndex + queryStr.length
    append(text.slice(start, matchIndex), 'normal')
    append(text.slice(matchIndex, end), 'highlight')

    start = end
    matchIndex = lower.indexOf(queryStr, start)
    if (totalLength > 100) break
  }
  append(text.slice(start), 'normal')

  return result.filter((w) => w.str)

  function append(s: string, type: 'normal' | 'highlight') {
    let str = s

    if (type === 'normal') {
      if (str.length > 50) {
        if (totalLength === 0) {
          str = `… ${str.slice(-10)}`
        }
      }
    }

    let needEllipsis = false
    if (totalLength + str.length > 100) {
      if (result.some((w) => w.type === 'ellipsis')) return
      str = str.slice(0, Math.max(100 - totalLength, 1))
      needEllipsis = true
    }
    result.push({
      type,
      str,
    })
    totalLength += str.length
    if (needEllipsis) {
      result.push({
        type: 'ellipsis',
        str: ' …',
      })
      totalLength += 2
    }
  }
}
