import React, { useEffect } from 'react'
import { useForm } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import InputError from '@/Components/InputError'
import { Course } from '@/types/database'
import { fetchWrapper } from '@/lib/fetchWrapper'
import { toast } from 'react-toastify';
import MultipleSelector from '@/components/ui/multi-select'

interface CourseAttachFormProps {
  open?: boolean | undefined
  onClose?: () => void
  course: Course
}

interface PageState {
  course?: Course
  semesters?: { value: number; label: string }[]
  isFeteched: boolean
}

interface FormProps {
  semesters: { value: number; label: string }[]
}

export const CourseAttachForm: React.FC<CourseAttachFormProps> = ({
  open: openProp = undefined,
  onClose,
  course,
}) => {
  // State
  const [open, setOpen] = React.useState(openProp ?? false)
  const [pageState, setPageState] = React.useState<PageState>({
    semesters: [],
    isFeteched: false,
  })

  const { data, setData, post, processing, errors, transform } = useForm<FormProps>({
    semesters: [],
  })

  useEffect(() => {
    if (open && !pageState.isFeteched) {
      handleFetchState()
    }
  }, [open])

  useEffect(() => {
    if (openProp !== undefined) {
      setOpen(openProp)
    }
  }, [openProp])

  function handleFetchState() {
    fetchWrapper({
      url: route('courses.attach.semester', { course: course?.id }),
      method: 'GET',
    })
      .then(response => {
        setPageState({
          ...response,
          isFetched: true,
        })

        if (response.course && response.course.semesters) {
          setData(
            'semesters',
            response.course.semesters.map((semester: any) => {
              return { value: semester.id, label: semester.name }
            })
          )
        }
      })
      .catch(error => {
        console.error('handleCreate -> error', error)
      })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    transform((data: FormProps) => {
      return {
        semesters: data.semesters.map(semester => semester.value),
      }
    })

    post(route('courses.attach', { course: course?.id }), {
      preserveScroll: true,
      onSuccess: () => {
        handleOpen(false)
      },
      onError: error => {
        if (error.message) {
          toast.error(error.message)
        }
      },
    })
  }

  function handleOpen(value: boolean) {
    setOpen(value)

    if (value === false) {
      onClose?.()
    }
  }

  return (
    <Dialog defaultOpen={open} onOpenChange={() => handleOpen(false)}>
      <DialogContent className="md:min-w-[70%] lg:min-w-[60%] bg-background">
        <DialogHeader>
          <DialogTitle>Attach Course</DialogTitle>
          <DialogDescription>Select the semester and attach the course to it.</DialogDescription>
        </DialogHeader>
        <form id="CourseAttachForm" onSubmit={handleSubmit}>
          {/* Semester Selector */}
          <div className="space-y-2">
            <Label htmlFor="semester_id">Semesters</Label>
            <MultipleSelector
              value={data.semesters?.map(semesters => {
                return { value: String(semesters.value), label: semesters.label }
              })}
              className="w-full z-50"
              onChange={value =>
                setData(
                  'semesters',
                  value.map(v => ({ ...v, value: Number(v.value) }))
                )
              }
              options={pageState.semesters?.map(semester => {
                return { value: String(semester.value), label: semester.label }
              })}
            />
            <InputError message={errors.semesters} />
          </div>
          <DialogFooter className="flex justify-end gap-4 mt-4">
            <DialogClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DialogClose>
            <Button type="submit" variant="default" disabled={processing}>
              Attach
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
