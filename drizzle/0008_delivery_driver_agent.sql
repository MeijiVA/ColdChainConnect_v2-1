-- Add driver_id and agent_id columns to deliveries
-- driver_id: the physical driver assigned to this specific delivery run
-- agent_id: the agent (user) who owns/manages this delivery; auto-locked to the
--           logged-in agent when created by an agent role user
ALTER TABLE deliveries
  ADD COLUMN IF NOT EXISTS driver_id text REFERENCES drivers(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS agent_id  text REFERENCES agents(id)  ON DELETE SET NULL;
