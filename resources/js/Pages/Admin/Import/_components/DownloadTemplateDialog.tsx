import { Copy, Download, Rows } from 'lucide-react'

import { Button } from '@/components/ui/button'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import React from 'react'

interface DialogProps {
  handleSubmit: (number: number) => void
}

function DownloadTemplateDialog({ handleSubmit }: DialogProps) {
  const [number, setNumber] = React.useState(50)
  const [customRows, setCustomRows] = React.useState('')
  const [mode, setMode] = React.useState<'preset' | 'custom'>('preset')

  const presetOptions = [50, 100, 300, 500, 1000]

  const handleDownload = () => {
    const rows = mode === 'preset' ? number : parseInt(customRows) || 50
    if (rows > 0 && rows <= 10000) {
      // Reasonable upper limit
      handleSubmit(rows)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="ml-2">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Rows className="h-5 w-5" />
            Download Template
          </DialogTitle>
          <DialogDescription>
            Choose the number of rows for your template download.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <RadioGroup
            value={mode}
            onValueChange={(value: 'preset' | 'custom') => setMode(value)}
            className="space-y-4"
          >
            {/* Preset Option */}
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="preset" id="preset" />
              <div className="flex-1 space-y-2">
                <Label htmlFor="preset" className="text-sm font-medium">
                  Select Preset Rows
                </Label>
                <Select
                  value={number.toString()}
                  onValueChange={value => setNumber(parseInt(value))}
                  disabled={mode !== 'preset'}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select number of rows" />
                  </SelectTrigger>
                  <SelectContent>
                    {presetOptions.map(option => (
                      <SelectItem key={option} value={option.toString()}>
                        {option} rows
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Custom Option */}
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="custom" id="customRows" />
              <div className="flex-1 space-y-2">
                <Label htmlFor="customRows" className="text-sm font-medium">
                  Enter Custom Rows
                </Label>
                <Input
                  id="customRows"
                  type="number"
                  min={1}
                  max={10000}
                  placeholder="Enter number (1-10000)"
                  value={customRows}
                  onChange={e => setCustomRows(e.target.value)}
                  disabled={mode !== 'custom'}
                  className="w-full"
                />
              </div>
            </div>
          </RadioGroup>
        </div>

        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              size="sm"
              onClick={handleDownload}
              disabled={
                mode === 'custom' &&
                (!customRows || parseInt(customRows) <= 0 || parseInt(customRows) > 10000)
              }
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DownloadTemplateDialog
