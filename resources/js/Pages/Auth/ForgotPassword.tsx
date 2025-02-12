import GuestLayout from '@/Layouts/GuestLayout'
import InputError from '@/Components/InputError'
import { Head, useForm, Link } from '@inertiajs/react'
import { FormEventHandler } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Mail, KeySquare, ArrowLeft } from 'lucide-react'

export default function ForgotPassword({ status }: { status?: string }) {
  const { data, setData, post, processing, errors } = useForm({
    email: '',
  })

  const submit: FormEventHandler = e => {
    e.preventDefault()
    post(route('password.email'))
  }

  return (
    <GuestLayout>
      <Head title="Forgot Password" />

      <div className="w-full md:px-8 py-12 sm:max-w-md mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <KeySquare className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Reset Password</h1>
          <p className="text-muted-foreground mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {status && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 rounded-lg text-sm">
            {status}
          </div>
        )}

        <form onSubmit={submit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <div className="relative">
              <Input
                id="email"
                type="email"
                name="email"
                value={data.email}
                className="pl-10"
                placeholder="Enter your email"
                autoComplete="email"
                onChange={e => setData('email', e.target.value)}
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <InputError message={errors.email} className="mt-1" />
          </div>

          <Button className="w-full" size="lg" disabled={processing}>
            Send Reset Link
          </Button>

          <Link
            href={route('login')}
            className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </form>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted-foreground text-center">
            Remember your password?{' '}
            <Link href={route('login')} className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </GuestLayout>
  )
}
