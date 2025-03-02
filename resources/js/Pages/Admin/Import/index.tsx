import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Download,
  Upload,
  FileSpreadsheet,
  Database,
  CheckCircle,
  AlertTriangle,
  Table as TableIcon,
  RefreshCw,
  FileText,
  Info,
  HelpCircle,
  ChevronRight,
  Clock,
  Undo2,
  RotateCcw,
  ChevronDownIcon,
} from 'lucide-react'
import { Head, router, useForm } from '@inertiajs/react'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { PageProps } from '@/types'
import InputError from '@/Components/InputError'
import { useEffect, useRef, useState } from 'react'
import { Progress } from '@/components/ui/progress'
import TooltipComponent from '@/components/ui/tooltip'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { useBreadcrumb } from '@/components/providers/breadcrum-provider'
import DownloadTemplateDialog from './_components/DownloadTemplateDialog'
import { toast } from 'react-toastify'

interface FormProps {
  file: File | null
  table: string
  [key: string]: any
}

type ImportPageProps = PageProps & {
  export_tables: string[]
  import_tables: string[]
}

function ImportPage({ auth, export_tables, import_tables }: ImportPageProps) {
  const { data, setData, post, processing, errors } = useForm<FormProps>({
    file: null,
    table: '',
  })
  const { setBreadcrumb } = useBreadcrumb()

  const [importStatus, setImportStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>(
    'idle'
  )
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isScrollable, setIsScrollable] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  // Add a ref for the file input
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    setBreadcrumb({
      title: 'Import',
    })
  }, [setBreadcrumb])

  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()

    if (data.file) {
      const fileExtension = data.file.name.split('.').pop()?.toLowerCase()
      if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
        toast.error('Only .xlsx and .xls files are allowed.')
        return
      }
    }
    setImportStatus('uploading')

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval)
          return prev
        }
        return prev + 5
      })
    }, 200)

    post(route('import.store'), {
      headers: { 'Content-Type': 'multipart/form-data' },
      onSuccess: () => {
        clearInterval(progressInterval)
        setUploadProgress(100)
        setImportStatus('success')
        setTimeout(() => {
          // Reset form state
          setData({ file: null, table: '' })
          // Clear the file input value using the ref
          if (fileInputRef.current) {
            fileInputRef.current.value = ''
          }
          setUploadProgress(0)
          setImportStatus('idle')
        }, 2000)
      },
      onError: () => {
        clearInterval(progressInterval)
        setImportStatus('error')
        setTimeout(() => {
          setUploadProgress(0)
        }, 2000)
      },
    })
  }

  const handleDownloadTemplate = (table: string, number: number) => {
    window.location.href = route('export.template', { table, numberRows: number })
  }

  // Get file name or placeholder
  const fileName = data.file ? data.file.name : 'No file selected'

  // Format table name for display
  const formatTableName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  // Get appropriate icon for template type
  const getTemplateIcon = (table: string) => {
    const iconMap: { [key: string]: any } = {
      users: <FileText className="mr-2 h-5 w-5 text-blue-500" />,
      products: <FileSpreadsheet className="mr-2 h-5 w-5 text-green-500" />,
      orders: <Clock className="mr-2 h-5 w-5 text-purple-500" />,
      customers: <FileText className="mr-2 h-5 w-5 text-orange-500" />,
    }

    return iconMap[table] || <FileSpreadsheet className="mr-2 h-5 w-5 text-gray-500" />
  }

  // Enhanced check function with scroll position awareness
  const checkScrollable = () => {
    if (scrollAreaRef.current) {
      const element = scrollAreaRef.current
      // Find the actual scrollable element (might be a child)
      const scrollableElement =
        element.querySelector('[data-radix-scroll-area-viewport]') || element

      requestAnimationFrame(() => {
        const isScrollNeeded = scrollableElement.scrollHeight > scrollableElement.clientHeight

        // Calculate how far down the user has scrolled
        const scrollPosition = scrollableElement.scrollTop
        const scrollHeight = scrollableElement.scrollHeight
        const clientHeight = scrollableElement.clientHeight

        // Show the button only if:
        // 1. Content is scrollable AND
        // 2. User is near the top (within top 20% of scroll area)
        const isNearTop = scrollPosition < (scrollHeight - clientHeight) * 0.2
        const shouldShowButton = isScrollNeeded && isNearTop

        console.log('Scroll check:', {
          scrollPosition,
          scrollHeight,
          clientHeight,
          isScrollNeeded,
          isNearTop,
          shouldShowButton,
        })

        setIsScrollable(shouldShowButton)
      })
    }
  }

  // Enhanced useEffect with scroll event listener
  useEffect(() => {
    const observer = new MutationObserver(() => checkScrollable())
    const resizeObserver = new ResizeObserver(() => checkScrollable())
    let scrollableElement = null

    if (scrollAreaRef.current) {
      observer.observe(scrollAreaRef.current, { childList: true, subtree: true })
      resizeObserver.observe(scrollAreaRef.current)

      // Get the scrollable element for event listeners
      scrollableElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]')
      if (scrollableElement) {
        scrollableElement.addEventListener('scroll', checkScrollable)
      }
    }

    // Initial check with longer delay
    const timer = setTimeout(checkScrollable, 300)

    return () => {
      observer.disconnect()
      resizeObserver.disconnect()
      clearTimeout(timer)
      if (scrollableElement) {
        scrollableElement.removeEventListener('scroll', checkScrollable)
      }
    }
  }, [export_tables])

  function scrollToBottom() {
    const scrollableElement = scrollAreaRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    )
    if (scrollableElement) {
      scrollableElement.scroll({ top: scrollableElement.scrollHeight, behavior: 'smooth' })
    }
  }

  return (
    <AuthenticatedLayout user={auth.user}>
      <Head title="Import Data" />

      <div className="">
        <Card className="shadow-md">
          <CardHeader className="bg-gradient-to-r from-secondary/70 to-secondary/60 border-b">
            <div className="flex items-center">
              <Database className="h-8 w-8 text-blue-600 dark:text-blue-400 mr-3" />
              <div>
                <CardTitle className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  Import Data
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400 flex items-center">
                  <Info className="h-4 w-4 mr-1 text-blue-500" />
                  Download a template, fill it with data, and upload to import
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 bg-background text-background-foreground">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left column - Import Form */}
              <div className="space-y-6">
                <div className="rounded-lg bg-secondary/10 p-4 border border-border">
                  <h3 className="text-lg font-medium text-blue-700 dark:text-blue-300 flex items-center mb-4">
                    <Upload className="mr-2 h-5 w-5" />
                    Import Process
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Table Selection */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="table"
                        className="flex items-center text-gray-700 dark:text-gray-300"
                      >
                        <TableIcon className="h-4 w-4 mr-1 text-blue-500" />
                        Select Table
                      </Label>
                      <Select
                        value={data.table}
                        onValueChange={value => setData('table', value)}
                        required
                      >
                        <SelectTrigger id="table" className="border-blue-200 dark:border-gray-800">
                          <SelectValue placeholder="Select a table" />
                        </SelectTrigger>
                        <SelectContent>
                          {import_tables.map(table => (
                            <SelectItem key={table} value={table} className="flex items-center">
                              {formatTableName(table)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <InputError message={errors.table} />
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                      <Label
                        htmlFor="file"
                        className="flex items-center text-gray-700 dark:text-gray-300"
                      >
                        <FileSpreadsheet className="h-4 w-4 mr-1 text-blue-500" />
                        Upload Excel File
                      </Label>

                      <div className="flex items-center">
                        <div className="relative flex-grow">
                          <Input
                            id="file"
                            type="file"
                            accept=".xlsx, .xls"
                            ref={fileInputRef} // Attach the ref here
                            onChange={e => setData('file', e.target?.files?.[0] ?? null)}
                            required
                            className="sr-only"
                          />
                          <div className="flex items-center">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => document.getElementById('file')?.click()}
                              className="rounded-r-none border-r-0"
                            >
                              <Upload className="mr-2 h-4 w-4 text-blue-500" />
                              Browse
                            </Button>
                            <div className="truncate border border-blue-200 dark:border-gray-800 bg-gray-50 dark:bg-black rounded-r-md py-2 px-3 w-full text-sm">
                              {fileName}
                            </div>
                          </div>
                        </div>
                      </div>
                      <InputError message={errors.file} />
                    </div>

                    {/* Progress bar (shows when uploading) */}
                    {importStatus === 'uploading' && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-blue-600 dark:text-blue-400 flex items-center">
                            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                            Uploading...
                          </span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress
                          value={uploadProgress}
                          className="h-2 bg-blue-100 dark:bg-gray-700"
                          indicatorClassName="bg-blue-500"
                        />
                      </div>
                    )}

                    {/* Status Message */}
                    {importStatus === 'success' && (
                      <div className="p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md flex items-center text-green-700 dark:text-green-400">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Import completed successfully!
                      </div>
                    )}

                    {importStatus === 'error' && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-md flex items-center text-red-700 dark:text-red-400">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        Error importing data. Please try again.
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={
                        processing || !data.table || !data.file || importStatus === 'uploading'
                      }
                      className="w-full font-medium"
                    >
                      {importStatus === 'uploading' ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Import Data
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                {/* Help section */}
                <div className="rounded-lg bg-secondary/10 p-4 border border-border">
                  <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 flex items-center mb-2">
                    <HelpCircle className="mr-2 h-5 w-5" />
                    Import Help
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-indigo-500 mt-0.5 mr-1 flex-shrink-0" />
                      Download the template for your desired table
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-indigo-500 mt-0.5 mr-1 flex-shrink-0" />
                      Fill in your data without modifying the columns
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-indigo-500 mt-0.5 mr-1 flex-shrink-0" />
                      Save the file as .xlsx format
                    </li>
                    <li className="flex items-start">
                      <ChevronRight className="h-4 w-4 text-indigo-500 mt-0.5 mr-1 flex-shrink-0" />
                      Upload and import your data
                    </li>
                  </ul>
                </div>
              </div>

              {/* Right column - Templates */}
              <div>
                <div className="rounded-lg bg-secondary/10 p-4 border border-border">
                  <h3 className="text-lg font-medium text-indigo-700 dark:text-indigo-300 flex items-center mb-4">
                    <Download className="mr-2 h-5 w-5" />
                    Download Templates
                  </h3>

                  <ScrollArea ref={scrollAreaRef} className="h-[500px] relative">
                    <div className="pr-4">
                      <div className="space-y-3">
                        {export_tables.map(table => (
                          <div
                            key={table}
                            className={`relative rounded-lg border transition-all duration-200 hover:border-blue-300 hover:dark:border-blue-500 hover:bg-blue-50 hover:dark:bg-blue-900/20 shadow-md border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/30`}
                          >
                            <div className="flex items-center p-3">
                              {getTemplateIcon(table)}
                              <div className="flex-grow">
                                <h4 className="font-medium text-gray-800 dark:text-gray-200">
                                  {formatTableName(table)}
                                </h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                  Excel Template (.xlsx)
                                </p>
                              </div>
                              <DownloadTemplateDialog
                                handleSubmit={number => handleDownloadTemplate(table, number)}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Bouncy Scroll Down Button */}
                    {isScrollable && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full animate-bounce border-2 border-border"
                        aria-label="Scroll down to see more templates"
                        onClick={scrollToBottom}
                      >
                        <ChevronDownIcon className="h-5 w-5" />
                      </Button>
                    )}
                    <ScrollBar orientation="vertical" />
                  </ScrollArea>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="bg-secondary border-t px-6 py-4 flex justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
              <Info className="h-4 w-4 mr-1 text-blue-500" />
              Need help? Contact support
            </div>
          </CardFooter>
        </Card>
      </div>
    </AuthenticatedLayout>
  )
}

export default ImportPage
