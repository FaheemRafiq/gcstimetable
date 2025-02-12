import { FormEventHandler, useEffect } from 'react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'
import { PageProps, Shift, TimeStamp, TimeTable } from '@/types'
import { router, useForm, Link } from '@inertiajs/react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import TextInput from '@/Components/TextInput'
import InputLabel from '@/Components/InputLabel'
import InputError from '@/Components/InputError'
import toast from 'react-hot-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'

interface FormProps {
  title: string
  description: string
  shift_id: number | null
}

export default function EditTimeTable({
  auth,
  timetable,
  shifts,
}: PageProps<{ timetable: TimeTable; shifts: Shift[] }>) {
  const { setBreadcrumb } = useBreadcrumb()

  useEffect(() => {
    setBreadcrumb({
      title: 'Edit Time Table',
      backItems: [
        {
          title: 'Time Tables',
          url: route('timetables.index'),
        },
      ],
    })
  }, [setBreadcrumb])

  const { data, setData, put, errors, processing, reset } = useForm<FormProps>({
    title: timetable?.title,
    description: timetable?.description,
    shift_id: timetable?.shift?.id ?? null,
  })

  const submit: FormEventHandler = e => {
    e.preventDefault()

    put(route('timetables.update', timetable.id), {
      onSuccess: response => {
        reset('title', 'description')
      },
    })
  }

  function handleClose() {
    router.get(route('timetables.index'))
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Edit | Time Table" />

      <div className="bg-card text-card-foreground border border-border sm:rounded-lg">
        <div className="p-6 flex justify-end">
          <Card className="w-full bg-white shadow-md rounded-lg dark:bg-background">
            <CardHeader className="flex items-center space-x-4">
              <CardTitle>Edit Time Table</CardTitle>
            </CardHeader>

            <CardContent className="mt-4">
              <div className="mb-4">
                <InputLabel htmlFor="title" value="Title" aria-required />
                <TextInput
                  autoFocus
                  className={'w-full'}
                  id="title"
                  value={data.title}
                  onChange={e => setData('title', e.target.value)}
                  required
                />
                <InputError message={errors.title} />
              </div>
              <div className="mb-4">
                <InputLabel htmlFor="description" value="Description" aria-required />
                <TextInput
                  className={'w-full'}
                  id="description"
                  value={data.description}
                  onChange={e => setData('description', e.target.value)}
                  required
                />
                <InputError message={errors.description} />
              </div>

              <div className="mb-4">
                <InputLabel htmlFor="shift" value="Shift" aria-required />
                <Select
                  name="shift"
                  defaultValue={data.shift_id?.toString()}
                  onValueChange={value => setData('shift_id', Number(value))}
                >
                  <SelectTrigger className="dark:bg-gray-900 dark:border dark:border-gray-700">
                    <SelectValue placeholder="Select a shift" />
                  </SelectTrigger>
                  <SelectContent>
                    {shifts?.length > 0 &&
                      shifts.map(shift => (
                        <SelectItem key={shift.id} value={shift.id.toString()}>
                          {shift.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <InputError message={errors.shift_id} />
              </div>
            </CardContent>

            <CardFooter className="mt-4 flex justify-end gap-3">
              <Button variant={'outline'} onClick={handleClose}>
                Cancel
              </Button>
              <Button onClick={submit} disabled={processing}>
                Update
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  )
}
