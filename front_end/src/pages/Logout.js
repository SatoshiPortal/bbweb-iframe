import { useEffect, useState } from "react"
import Spinner from "../components/spinner.js"

export default function Logout() {
  const [loading, setLoading] = useState(true)

  const fetchLogout = async () => {
    const response = await fetch(`${process.env.REACT_APP_AUTH_URL}/api/.ory/self-service/logout/browser`, {
      credentials: "include",
    })

    const data = await response.json()

    if(data && data.logout_url) {
      window.location = data.logout_url
    }
  }

  useEffect(() => {
    fetchLogout()
  }, [])

  return (
    <div>
      {loading && <Spinner container />}
    </div>
  )
}