-- =============================================================================
-- Migration: Add execute_sql Helper Function
-- Bypasses RLS to allow the server admin client to run LLM-generated SELECT queries.
-- =============================================================================

CREATE OR REPLACE FUNCTION public.execute_sql(sql_query TEXT)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result JSON;
BEGIN
  -- Security check: only allow SELECT queries
  IF NOT (LOWER(TRIM(sql_query)) LIKE 'select%') THEN
    RAISE EXCEPTION 'Only SELECT queries are allowed for execution';
  END IF;

  EXECUTE 'SELECT json_agg(t) FROM (' || sql_query || ') t' INTO result;
  RETURN COALESCE(result, '[]'::json);
END;
$$;

GRANT EXECUTE ON FUNCTION public.execute_sql(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.execute_sql(TEXT) TO service_role;
