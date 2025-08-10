-- Enable Row Level Security
create extension if not exists "uuid-ossp";

-- Create the financial_data table
create table financial_data (
    id uuid primary key default uuid_generate_v4(),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    annual_revenue decimal not null check (annual_revenue >= 0),
    annual_recurring_revenue decimal not null check (annual_recurring_revenue >= 0),
    gross_profit decimal not null,
    operating_expenses decimal not null check (operating_expenses >= 0),
    net_income decimal not null,
    cash_on_hand decimal not null check (cash_on_hand >= 0),
    total_assets decimal not null check (total_assets >= 0),
    total_liabilities decimal not null check (total_liabilities >= 0),
    number_of_employees integer not null check (number_of_employees >= 0)
);

-- Enable Row Level Security (RLS)
alter table financial_data enable row level security;

-- Create a policy that allows all operations
-- Note: In a production environment, you should create more restrictive policies
create policy "Enable all operations for authenticated users"
    on financial_data
    for all
    using (true);
