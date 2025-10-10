-- Migration: Create currencies table
-- Description: Table to store available currencies for spaces
-- Author: System
-- Date: 2025-10-10

-- Create currencies table
CREATE TABLE IF NOT EXISTS currencies (
    code VARCHAR(3) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
    flag_emoji VARCHAR(10) NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create index on display_order for efficient sorting
CREATE INDEX idx_currencies_display_order ON currencies(display_order, code);

-- Create index on is_active for filtering
CREATE INDEX idx_currencies_is_active ON currencies(is_active);

-- Insert default currencies
INSERT INTO currencies (code, name, symbol, flag_emoji, is_active, display_order) VALUES
    ('USD', 'US Dollar', '$', '🇺🇸', true, 1),
    ('CAD', 'Canadian Dollar', '$', '🇨🇦', true, 2),
    ('MXN', 'Mexican Peso', '$', '🇲🇽', true, 3)
ON CONFLICT (code) DO NOTHING;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_currencies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER currencies_updated_at
    BEFORE UPDATE ON currencies
    FOR EACH ROW
    EXECUTE FUNCTION update_currencies_updated_at();

-- Add comment to table
COMMENT ON TABLE currencies IS 'Available currencies for spaces';
COMMENT ON COLUMN currencies.code IS 'ISO 4217 currency code (3 letters)';
COMMENT ON COLUMN currencies.name IS 'Full currency name';
COMMENT ON COLUMN currencies.symbol IS 'Currency symbol ($, €, etc)';
COMMENT ON COLUMN currencies.flag_emoji IS 'Country flag emoji';
COMMENT ON COLUMN currencies.is_active IS 'Whether currency is available for selection';
COMMENT ON COLUMN currencies.display_order IS 'Order for displaying currencies';
