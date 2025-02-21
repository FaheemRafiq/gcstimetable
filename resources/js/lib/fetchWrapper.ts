import axios from 'axios'

type FetchMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

interface FetchOptions<T> {
  url: string
  method?: FetchMethod
  body?: T
  headers?: Record<string, string>
}

async function fetchWrapper<TBody = unknown>({
  url,
  method = 'GET',
  body,
  headers = {},
}: FetchOptions<TBody>): Promise<any> {
  const CSRF_TOKEN = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-CSRF-TOKEN': CSRF_TOKEN || '',
  }

  try {
    const response = await fetch(url, {
      method,
      headers: { ...defaultHeaders, ...headers },
      body: body ? JSON.stringify(body) : undefined,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Request failed')
    }

    return response.json()
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

async function AxiosWrapper<TBody = unknown>({
  url,
  method = 'GET',
  body,
  headers = {},
}: FetchOptions<TBody>) {
  return axios({
    url,
    method,
    headers: {
      ...headers,
      'X-CSRF-TOKEN':
        document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
    },
    data: body,
  })
}

export { fetchWrapper, AxiosWrapper }
