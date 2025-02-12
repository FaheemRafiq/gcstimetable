import { StringObject } from '@/types/database'
import { create } from 'zustand'

interface TeacherStore {
  ranks: StringObject
  positions: StringObject
  departments: StringObject

  // setters
  setRanks: (ranks: StringObject) => void
  setPositions: (positions: StringObject) => void
  setDepartments: (departments: StringObject) => void
}

const useTeacherStore = create<TeacherStore>(set => ({
  ranks: {},
  positions: {},
  departments: {},

  // setters
  setRanks: (ranks: StringObject) => set({ ranks }),
  setPositions: (positions: StringObject) => set({ positions }),
  setDepartments: (departments: StringObject) => set({ departments }),
}))

export default useTeacherStore
