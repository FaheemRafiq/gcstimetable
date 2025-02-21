import React, { useEffect } from 'react'
import { useForm, usePage } from '@inertiajs/react'
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
import { Course, Semester } from '@/types/database'
import { fetchWrapper } from '@/lib/fetchWrapper'
import { toast } from 'react-toastify'
import MultipleSelector from '@/components/ui/multi-select'

interface SemesterAttachFormProps {
  open?: boolean | undefined
  onClose?: () => void
  semester: Semester
}

interface PageState {
  courses?: Course[]
  semester?: Semester
  isFeteched: boolean
}

interface FormProps {
  courses: { value: number; label: string }[]
  [key: string]: any
}

export const SemesterAttachForm: React.FC<SemesterAttachFormProps> = ({
  open: openProp = undefined,
  onClose,
  semester,
}) => {
  // State
  const [open, setOpen] = React.useState(openProp ?? false)
  const [pageState, setPageState] = React.useState<PageState>({
    courses: [],
    isFeteched: false,
  })

  const { data, setData, post, processing, errors, transform } = useForm<FormProps>({
    courses: [],
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
      url: route('semester.attach.courses', { semester: semester?.id }),
      method: 'GET',
    })
      .then(response => {
        setPageState({
          ...response,
          isFetched: true,
        })

        if (response.semester && response.semester.courses) {
          setData(
            'courses',
            response.semester.courses.map((course: Course) => {
              return { value: course.id, label: getLabel(course) }
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
        courses: data.courses.map(course => course.value),
      }
    })

    post(route('semester.attach', { semester: semester?.id }), {
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

  function getLabel(course: Course | undefined) {
    return course ? course.code + ' - ' + course.name : ''
  }

  return (
    <Dialog defaultOpen={open} onOpenChange={() => handleOpen(false)}>
      <DialogContent className="md:min-w-[70%] lg:min-w-[60%] bg-background">
        <DialogHeader>
          <DialogTitle>Attach Course</DialogTitle>
          <DialogDescription>Select the courses and attach to the semester.</DialogDescription>
        </DialogHeader>
        <form id="SemesterAttachForm" onSubmit={handleSubmit}>
          {/* Course Selector */}
          <div className="space-y-2">
            <Label htmlFor="semester_id">Courses</Label>
            <MultipleSelector
              value={data.courses.map(course => {
                return { value: String(course.value), label: course.label }
              })}
              className="w-full z-50"
              onChange={value =>
                setData(
                  'courses',
                  value.map(v => ({ ...v, value: Number(v.value) }))
                )
              }
              options={pageState.courses?.map(course => {
                return { value: String(course?.id), label: getLabel(course) }
              })}
            />
            <InputError message={errors.courses} />
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
