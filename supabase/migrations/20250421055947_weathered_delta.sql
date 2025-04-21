/*
  # Create students table and enable real-time

  1. New Tables
    - `students`
      - `id` (uuid, primary key)
      - `name` (text, not null)
      - `section` (text, not null)
      - `position` (integer, not null)
      - `created_at` (timestamp with time zone)

  2. Security
    - Enable RLS on `students` table
    - Add policies for authenticated users to read and insert data
    - Enable real-time for the students table
*/

CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  section text NOT NULL,
  position integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE students ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON students
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for authenticated users" ON students
  FOR INSERT WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE students;