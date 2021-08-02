import type { NextApiRequest, NextApiResponse } from "next"

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const {
    query: { id },
  } = req

  fetch(`http://www.vimgolf.com/challenges/${id}`)
    .then(r => r.json())
    .then(feed => res.status(200).json(feed))
}

export default handler
