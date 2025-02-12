import GuestLayout from '@/Layouts/GuestLayout'
import { Head, Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { MailCheck, RefreshCw } from 'lucide-react'

export default function VerifyEmail({ status }: { status?: string }) {
  return (
    <GuestLayout>
      <Head title="Verify Email" />
      <div className="w-full md:px-8 py-12 sm:max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <MailCheck className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Verify Your Email</h1>
          <p className="text-muted-foreground mt-2">
            We've sent a verification link to your email. Please check your inbox and click the link
            to verify your account.
          </p>
        </div>

        {status === 'verification-link-sent' && (
          <div className="mb-4 text-sm text-green-600 text-center">
            A new verification link has been sent to your email address.
          </div>
        )}

        <div className="flex flex-col gap-4">
          <form method="POST" action={route('verification.send')} className="w-full">
            <Button className="w-full" size="lg">
              <RefreshCw className="h-4 w-4 mr-2" /> Resend Verification Email
            </Button>
          </form>

          <Link
            href={route('logout')}
            method="post"
            as="button"
            className="text-center text-sm text-primary hover:underline"
          >
            Log Out
          </Link>
        </div>
      </div>
    </GuestLayout>
  )
}
