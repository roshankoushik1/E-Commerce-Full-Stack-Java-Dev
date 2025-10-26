-- Add role column to userss table for admin authentication
-- Run this script to update your existing database

ALTER TABLE userss ADD COLUMN role VARCHAR(20) DEFAULT 'USER';

-- Update existing users to have USER role
UPDATE userss SET role = 'USER' WHERE role IS NULL OR role = '';

-- Make role column NOT NULL (MySQL syntax)
ALTER TABLE userss MODIFY role VARCHAR(20) NOT NULL DEFAULT 'USER';