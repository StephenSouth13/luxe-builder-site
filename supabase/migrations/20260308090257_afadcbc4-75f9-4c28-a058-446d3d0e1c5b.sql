CREATE OR REPLACE FUNCTION public.increment_voucher_usage(voucher_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.vouchers
  SET used_count = used_count + 1, updated_at = now()
  WHERE id = voucher_id;
END;
$$;