import type { NextApiRequest, NextApiResponse } from "next"
import Parser from "rss-parser"

const parser: Parser = new Parser()

const handler = (_req: NextApiRequest, res: NextApiResponse) => {
  parser.parseURL("http://feeds.vimgolf.com/latest-challenges").then(feed => {
    res.status(200).json({
      ...feed,
      items: feed.items.map(item => ({
        ...item,
        id: item.guid?.match(/[^/]*$/)?.[0],
      })),
    })
  })
}

export default handler
