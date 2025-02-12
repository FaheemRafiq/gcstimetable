import { Button } from '@/components/ui/button'
import { router } from '@inertiajs/react'

export default function ErrorPage({
  isLoggedIn,
  statusCode,
}: {
  isLoggedIn: boolean
  statusCode: 503 | 500 | 404 | 403
}) {
  const title = {
    503: '503: Service Unavailable',
    500: '500: Server Error',
    404: '404: Page Not Found',
    403: '403: Forbidden',
  }[statusCode]

  const description = {
    503: 'Sorry, we are doing some maintenance. Please check back soon.',
    500: 'Whoops, something went wrong on our servers.',
    404: 'Sorry, the page you are looking for could not be found.',
    403: 'Sorry, you are forbidden from accessing this page.',
  }[statusCode]

  function handleBackHome() {
    if (isLoggedIn) {
      router.get(route('dashboard'))
    } else {
      router.get('/')
    }
  }

  return (
    <div className="absolute left-1/2 top-1/2 mb-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-center">
      <span className="bg-gradient-to-b from-foreground to-transparent bg-clip-text text-[10rem] font-extrabold leading-none text-transparent">
        {statusCode}
      </span>
      <h2 className="font-heading my-2 text-2xl font-bold">{title}</h2>
      <p>{description}</p>
      <div className="mt-8 flex justify-center gap-2">
        <Button onClick={() => history.back()} variant="default" size="lg">
          Go back
        </Button>
        <Button onClick={handleBackHome} variant="ghost" size="lg">
          Back to Home
        </Button>
      </div>
    </div>
  )
}
