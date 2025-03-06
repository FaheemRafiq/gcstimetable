import { saveAs } from 'file-saver'
import { Workbook as ExcelJsWorkbook, type Alignment as ExcelJsAlignment } from 'exceljs'
import {
  getRomanNumber,
  formatDateString,
  groupAllocationsByDay,
  formatNumberRange,
} from '@/utils/helper'
import { TimeTable } from '@/types'
import { Allocation, Day, Section } from '@/types/database'
import { WorkloadData } from '@/Pages/Admin/Departments/TeachersWorkload'

interface ExportTimeTableProps {
  timetable: TimeTable
  sections: Section[]
  allocations: Allocation[]
}

export const exportTimeTableToExcel = async ({
  timetable,
  sections,
  allocations,
}: ExportTimeTableProps) => {
  const workbook = new ExcelJsWorkbook()
  const worksheet = workbook.addWorksheet('Timetable')

  // Set default styles for the worksheet
  worksheet.properties.defaultRowHeight = 20

  // Define reusable styles
  const centerAlign: Partial<ExcelJsAlignment> = {
    horizontal: 'center',
    vertical: 'middle',
    wrapText: true,
  }
  const headerStyle = {
    font: { bold: true, size: 12, color: { argb: '000000' } },
    alignment: centerAlign,
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'E9ECEF' },
    },
    border: {
      top: { style: 'thin', color: { argb: 'D1D5DB' } },
      left: { style: 'thin', color: { argb: 'D1D5DB' } },
      bottom: { style: 'thin', color: { argb: 'D1D5DB' } },
      right: { style: 'thin', color: { argb: 'D1D5DB' } },
    },
  }

  // Title Section
  const titleSection = [
    [''],
    [`${timetable.title} - ${timetable.shift?.name}`],
    [timetable.description],
    [`Period: ${formatDateString(timetable.start_date)} - ${formatDateString(timetable.end_date)}`],
    [`Generated on: ${new Date().toLocaleDateString()}`],
    [''],
  ]

  titleSection.forEach((row, index) => {
    const excelRow = worksheet.addRow(row)
    if (row[0]) {
      worksheet.mergeCells(
        `A${index + 1}:${String.fromCharCode(65 + (timetable.shift?.slots?.length || 0))}${index + 1}`
      )
      excelRow.getCell(1).alignment = centerAlign
      if (index === 1) {
        excelRow.font = { bold: true, size: 14 }
      } else {
        excelRow.font = { size: 11 }
      }
    }
  })

  // Add table headers
  const headers = [
    'Section',
    ...(timetable.shift?.slots?.map(
      (slot, index) => `${getRomanNumber(index + 1)}\n${slot.name}`
    ) || []),
  ]

  const headerRow = worksheet.addRow(headers)
  headerRow.height = 40 // Taller header row for wrapped text
  headers.forEach((header, i) => {
    const cell = headerRow.getCell(i + 1)
    Object.assign(cell, headerStyle)
  })

  // Set column widths
  worksheet.getColumn('A').width = 30 // Section column

  // Set slot columns width
  timetable.shift?.slots?.forEach((_, index) => {
    worksheet.getColumn(String.fromCharCode(66 + index)).width = 35
  })

  // Calculate dynamic row height based on content
  const calculateRowHeight = (allocations: any[]) => {
    if (allocations.length === 0) return 60 // Default height for empty cells

    // Base height per allocation (accounts for the content and spacing)
    const baseHeightPerAllocation = 20

    // Additional height for padding and separation between allocations
    const padding = 20

    // Calculate total height needed
    const totalHeight = allocations.length * baseHeightPerAllocation + padding

    // Set minimum and maximum heights
    return Math.max(60, Math.min(300, totalHeight))
  }

  const getAllocations = (slotId: number, sectionId: number) => {
    const filteredAllocations = allocations.filter(
      allocation => allocation.slot_id === slotId && allocation.section_id === sectionId
    )

    return groupAllocationsByDay(filteredAllocations)
  }

  // Add data rows
  sections.forEach(section => {
    let maxAllocations = 1 // Track maximum allocations for this row

    const rowData = [
      `${section.semester?.name} (${section.name})`,
      ...(timetable.shift?.slots?.map(slot => {
        const allocs = getAllocations(slot.id, section.id)
        maxAllocations = Math.max(maxAllocations, allocs.length || 1)

        if (allocs.length === 0) return '-'

        return allocs
          .map(allocation => {
            const dayNumbers = allocation.days?.map((day: Day) => day.number) || []
            const formattedDays = formatNumberRange(dayNumbers)

            return [
              allocation.course?.display_code +
                ', ' +
                allocation.teacher?.name +
                ', ' +
                allocation.room?.name +
                ' ' +
                `(${formattedDays})`,
            ]
              .filter(Boolean)
              .join('\n')
          })
          .join('\n\n')
      }) || []),
    ]

    const row = worksheet.addRow(rowData)

    // Set dynamic row height based on maximum allocations in this row
    row.height = calculateRowHeight(new Array(maxAllocations))

    // Apply cell styles
    row.eachCell((cell, colNumber) => {
      cell.alignment = centerAlign
      cell.border = {
        top: { style: 'thin', color: { argb: 'D1D5DB' } },
        left: { style: 'thin', color: { argb: 'D1D5DB' } },
        bottom: { style: 'thin', color: { argb: 'D1D5DB' } },
        right: { style: 'thin', color: { argb: 'D1D5DB' } },
      }
    })
  })

  // Final formatting
  worksheet.views = [
    { state: 'frozen', xSplit: 1, ySplit: 7 }, // Freeze header row and first column
  ]

  // Generate and download the Excel file
  const buffer = await workbook.xlsx.writeBuffer()
  saveAs(new Blob([buffer]), `${timetable.title}_${formatDateString(timetable.start_date)}.xlsx`)
}

interface ExportTeachersWorkloadProps {
  workloadData: WorkloadData
  groupedData: any
}

export const exportTeachersWorkloadToExcel = async ({
  workloadData,
  groupedData,
}: ExportTeachersWorkloadProps) => {
  const workbook = new ExcelJsWorkbook()
  const worksheet = workbook.addWorksheet('TeacherWorkload')

  // Set default styles for the worksheet
  worksheet.properties.defaultRowHeight = 20

  // Define reusable styles
  const centerAlign: Partial<ExcelJsAlignment> = {
    horizontal: 'center',
    vertical: 'middle',
    wrapText: true,
  }
  const headerStyle = {
    font: { bold: true, size: 12, color: { argb: '000000' } },
    alignment: centerAlign,
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'E9ECEF' },
    },
    border: {
      top: { style: 'thin', color: { argb: 'D1D5DB' } },
      left: { style: 'thin', color: { argb: 'D1D5DB' } },
      bottom: { style: 'thin', color: { argb: 'D1D5DB' } },
      right: { style: 'thin', color: { argb: 'D1D5DB' } },
    },
  }

  // Title Section with better formatting
  const titleSection = [
    [''],
    [`Teachers Workload Report - ${workloadData.department.name}`],
    [`Session: ${workloadData.session}`],
    [`Generated on: ${new Date().toLocaleDateString()}`],
    [''],
  ]

  titleSection.forEach((row, index) => {
    const excelRow = worksheet.addRow(row)
    if (row[0]) {
      worksheet.mergeCells(`A${index + 1}:K${index + 1}`)
      excelRow.getCell(1).alignment = centerAlign
      if (index === 1) {
        excelRow.font = { bold: true, size: 14 }
      } else {
        excelRow.font = { size: 11 }
      }
    }
  })

  // Add table headers
  const headers = [
    'Teacher Name (Rank)',
    'Semester & Section',
    ...workloadData.slots.map(
      slot => `${slot.code}\n${slot.start_time.slice(0, 5)} - ${slot.end_time.slice(0, 5)}`
    ),
    'Credit Hours',
    'Per Week Lectures',
    'Total Lectures',
  ]

  const headerRow = worksheet.addRow(headers)
  headerRow.height = 40 // Taller header row for wrapped text
  headers.forEach((header, i) => {
    const cell = headerRow.getCell(i + 1)
    Object.assign(cell, headerStyle)
  })

  // Set column widths
  const columnWidths = {
    A: 30, // Teacher Name
    B: 25, // Semester & Section
    K: 15, // Credit Hours
    L: 15, // Per Week Lectures
    M: 15, // Total Lectures
  }

  // Set slot columns width (columns C to J)
  for (let i = 0; i < workloadData.slots.length; i++) {
    ;(columnWidths as Record<string, number>)[String.fromCharCode(67 + i)] = 35 // Start from 'C'
  }

  Object.entries(columnWidths).forEach(([col, width]) => {
    worksheet.getColumn(col).width = width
  })

  // Add data rows with improved formatting
  let rowNumber = 7 // Start after headers
  groupedData.forEach((teacherGroup: any) => {
    const startRow = rowNumber

    teacherGroup.sections.forEach((section: any, sectionIndex: any) => {
      const rowData = [
        sectionIndex === 0 ? `${teacherGroup.teacher.name}\n(${teacherGroup.teacher.rank})` : '',
        `${section.semester}\n(${section.section})`,
        ...workloadData.slots.map(slot => {
          const allocations = section.allocations[slot.id] || []
          const groupedAllocations = groupAllocationsByDay(allocations)

          return (
            groupedAllocations
              .map(allocation => {
                const dayNumbers = allocation.days?.map((day: Day) => day.number) || []
                const formattedDays = formatNumberRange(dayNumbers)
                return [
                  allocation.course.display_code,
                  allocation.teacher?.name ? `${allocation.teacher.name}` : '',
                  `Room: ${allocation.room.name || ''}`,
                  `(${formattedDays})`,
                ]
                  .filter(Boolean)
                  .join('\n')
              })
              .join('\n\n') || '-'
          )
        }),
        section.credit_hours,
        section.per_week_lectures,
        sectionIndex === 0 ? teacherGroup.total_per_week_lectures : '',
      ]

      const row = worksheet.addRow(rowData)
      row.height = 60 // Higher rows for wrapped content

      // Apply cell styles
      row.eachCell((cell, colNumber) => {
        cell.alignment = centerAlign
        cell.border = {
          top: { style: 'thin', color: { argb: 'D1D5DB' } },
          left: { style: 'thin', color: { argb: 'D1D5DB' } },
          bottom: { style: 'thin', color: { argb: 'D1D5DB' } },
          right: { style: 'thin', color: { argb: 'D1D5DB' } },
        }
      })

      rowNumber++
    })

    // Merge cells for teacher name and total lectures if multiple sections
    if (teacherGroup.sections.length > 1) {
      worksheet.mergeCells(`A${startRow}:A${rowNumber - 1}`)
      worksheet.mergeCells(
        `${String.fromCharCode(64 + headers.length)}${startRow}:${String.fromCharCode(64 + headers.length)}${rowNumber - 1}`
      )
    }

    // Add a subtle separator after each teacher group
    const separatorRow = worksheet.addRow([])
    separatorRow.height = 3
    separatorRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'F3F4F6' },
    }
    rowNumber++
  })

  // Final formatting pass
  worksheet.views = [
    { state: 'frozen', xSplit: 2, ySplit: 6 }, // Freeze header row and first two columns
  ]

  // Generate and download the Excel file
  const buffer = await workbook.xlsx.writeBuffer()
  saveAs(
    new Blob([buffer]),
    `Teacher_Workload_${workloadData.department.name}_${workloadData.session}.xlsx`
  )
}
