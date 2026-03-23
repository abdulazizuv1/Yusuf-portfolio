import { useState, useEffect } from 'react'
import { getChampionships } from '../firebase/championships'

export function useChampionships() {
  const [championships, setChampionships] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    getChampionships()
      .then(data => setChampionships(data))
      .catch(err  => setError(err))
      .finally(() => setLoading(false))
  }, [])

  return { championships, loading, error }
}
