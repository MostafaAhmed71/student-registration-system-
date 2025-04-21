export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      students: {
        Row: {
          id: string
          name: string
          section: string
          position: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          section: string
          position: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          section?: string
          position?: number
          created_at?: string
        }
      }
    }
  }
}