import { useEffect } from "react"
import { useRouter } from "next/router"

const Golf = () => {
  const router = useRouter()
  const { id } = router.query

  useEffect(() => {
    fetch(`/api/golf/${id}`)
      .then(r => r.json())
      .then(d => {
        const start = d?.in?.data || ""
        const end = d?.out?.data || ""
        const filetype = d?.out?.type || ""
        router.replace(
          `/challenge?start=${start}&end=${end}&filetype=${filetype}`
        )
      })
  }, [id, router])

  return <h1>loading...</h1>
}

export default Golf
