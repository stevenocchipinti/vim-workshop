import { useEffect, useState } from "react"

interface Challenge {
  id: string
  title: string
  contentSnippet: string
}

const Golf = () => {
  const [challenges, setChallenges] = useState<Challenge[]>()

  useEffect(() => {
    fetch("/api/golf")
      .then(r => r.json())
      .then(r => {
        setChallenges(r.items)
      })
  }, [])

  return (
    <>
      <h1>Golf</h1>
      <ul>
        {challenges ? (
          challenges.map(({ title, id }) => (
            <li key={id}>
              <a href={`/golf/${id}`}>{title}</a>
            </li>
          ))
        ) : (
          <h1>Loading...</h1>
        )}
      </ul>
    </>
  )
}

export default Golf
