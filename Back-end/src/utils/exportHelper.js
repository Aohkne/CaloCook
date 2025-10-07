import ExcelJS from 'exceljs'
import { Parser } from 'json2csv'

const generateExcelFile = async (dishes) => {
  try {
    // workbook ~ Excel
    // worksheet ~ Sheet
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Dishes')

    // FIELDs
    worksheet.columns = [
      { header: 'ID', key: '_id', width: 25 },
      { header: 'Name', key: 'name', width: 30 },
      { header: 'Description', key: 'description', width: 50 },
      { header: 'Cooking Time (min)', key: 'cookingTime', width: 20 },
      { header: 'Calorie (kcal)', key: 'calorie', width: 18 },
      { header: 'Difficulty', key: 'difficulty', width: 12 },
      { header: 'Is Active', key: 'isActive', width: 10 },
      { header: 'Created At', key: 'createdAt', width: 20 },
      { header: 'Updated At', key: 'updatedAt', width: 20 }
    ]

    // HEADER ROW: style
    const headerRow = worksheet.getRow(1)
    headerRow.font = { bold: true, color: { argb: 'FCFAF3' }, size: 12 }

    headerRow.eachCell({ includeEmpty: false }, (cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '27ce96' }
      }
    })

    headerRow.alignment = { vertical: 'middle', horizontal: 'center' }
    headerRow.height = 30

    // HEADER ROW: border - includeEmpty(limit to cell have data)
    headerRow.eachCell({ includeEmpty: false }, (cell) => {
      cell.border = {
        left: { style: 'medium', color: { argb: 'ffffff' } },
        right: { style: 'thin', color: { argb: '888888' } },
        bottom: { style: 'thin', color: { argb: '888888' } }
      }
    })

    // ROWS: Add data
    dishes.forEach((dish) => {
      const row = worksheet.addRow({
        _id: dish._id.toString(),
        name: dish.name,
        description: dish.description,
        cookingTime: dish.cookingTime,
        calorie: dish.calorie,
        difficulty: dish.difficulty,
        isActive: dish.isActive ? 'Yes' : 'No',
        createdAt: dish.createdAt ? new Date(dish.createdAt).toLocaleString() : '',
        updatedAt: dish.updatedAt ? new Date(dish.updatedAt).toLocaleString() : ''
      })

      // ROWS: STYLE
      row.alignment = { vertical: 'middle', wrapText: true }
      row.height = 35

      // SPECIFIC: rows
      row.getCell('name').font = { bold: true }

      // ROWS: borders
      row.eachCell({ includeEmpty: false }, (cell) => {
        cell.border = {
          left: { style: 'medium', color: { argb: 'ffffff' } },
          right: { style: 'thin', color: { argb: '888888' } },
          bottom: { style: 'thin', color: { argb: '888888' } }
        }
      })

      // Alternate row coloring
      if (row.number % 2 === 0) {
        row.eachCell({ includeEmpty: false }, (cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'e4f9f2' }
          }
        })
      }
    })

    // SPECIFIC: columns
    worksheet.getColumn('cookingTime').alignment = { horizontal: 'center', vertical: 'middle' }
    worksheet.getColumn('calorie').alignment = { horizontal: 'center', vertical: 'middle' }
    worksheet.getColumn('difficulty').alignment = { horizontal: 'center', vertical: 'middle' }
    worksheet.getColumn('isActive').alignment = { horizontal: 'center', vertical: 'middle' }

    // Auto-filter(total field)
    worksheet.autoFilter = {
      from: 'A1',
      to: 'I1'
    }

    // HEADER: Freeze row
    worksheet.views = [{ state: 'frozen', xSplit: 0, ySplit: 1 }]

    // GENERATE: buffer
    const buffer = await workbook.xlsx.writeBuffer()
    return buffer
  } catch (error) {
    throw new Error('Failed to generate Excel file: ' + error.message)
  }
}

const generateCSVFile = async (dishes) => {
  try {
    // FIELDs: CSV
    const fields = [
      { label: 'ID', value: '_id' },
      { label: 'Name', value: 'name' },
      { label: 'Cooking Time (min)', value: 'cookingTime' },
      { label: 'Calorie (kcal)', value: 'calorie' },
      { label: 'Difficulty', value: 'difficulty' },
      { label: 'Description', value: 'description' },
      { label: 'Created At', value: 'createdAt' },
      { label: 'Updated At', value: 'updatedAt' },
      { label: 'Is Active', value: 'isActive' }
    ]

    // TRASFORM: data
    const transformedData = dishes.map((dish) => ({
      _id: dish._id.toString(),
      name: dish.name,
      cookingTime: dish.cookingTime,
      calorie: dish.calorie,
      difficulty: dish.difficulty,
      description: dish.description,
      isActive: dish.isActive ? 'Yes' : 'No',
      createdAt: dish.createdAt ? new Date(dish.createdAt).toLocaleString() : '',
      updatedAt: dish.updatedAt ? new Date(dish.updatedAt).toLocaleString() : ''
    }))

    // PARSE: to CSV
    const json2csvParser = new Parser({ fields })
    const csv = json2csvParser.parse(transformedData)

    return csv
  } catch (error) {
    throw new Error('Failed to generate CSV file: ' + error.message)
  }
}

export const exportHelper = {
  generateExcelFile,
  generateCSVFile
}
