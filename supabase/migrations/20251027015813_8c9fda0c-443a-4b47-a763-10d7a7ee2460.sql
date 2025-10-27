-- Distribuir datas dos reviews de Janeiro 2024 a Fevereiro 2025
UPDATE reviews 
SET created_at = CASE id
  -- Janeiro 2024 (3 reviews)
  WHEN '01d1193e-2b4d-471e-ba42-a4eb1e9d228b' THEN '2024-01-15 10:23:00+00'::timestamptz
  WHEN '0ba248c1-d4da-42db-b903-d8b29f525882' THEN '2024-01-22 14:45:00+00'::timestamptz
  WHEN '0d6b48bc-def5-427c-b08b-0450db8ba99e' THEN '2024-01-28 16:12:00+00'::timestamptz
  
  -- Fevereiro 2024 (3 reviews)
  WHEN '17e7358f-a255-49bd-8294-8c548b7fc816' THEN '2024-02-05 11:30:00+00'::timestamptz
  WHEN '184b941d-15c9-4e1e-b6a3-39d7717a3d3a' THEN '2024-02-14 15:20:00+00'::timestamptz
  WHEN '29c3dafd-db63-4a8d-a1a2-68f82d40e955' THEN '2024-02-23 09:45:00+00'::timestamptz
  
  -- Março 2024 (3 reviews)
  WHEN '32f35442-7fb3-4f67-8b52-b29712a2deb5' THEN '2024-03-08 13:15:00+00'::timestamptz
  WHEN '3815ed7b-7073-4868-b21c-edd5d68d936e' THEN '2024-03-18 17:30:00+00'::timestamptz
  WHEN '3b61d946-1fe7-4bd1-bb88-6108713ea1b8' THEN '2024-03-27 10:50:00+00'::timestamptz
  
  -- Abril 2024 (3 reviews)
  WHEN '3f36a12d-0641-47ad-9959-74845fd5a614' THEN '2024-04-10 14:20:00+00'::timestamptz
  WHEN '4a2d45fd-ecb8-467b-a854-31aae5c0fd93' THEN '2024-04-19 11:40:00+00'::timestamptz
  WHEN '509fe882-285e-459b-9516-9102271c5336' THEN '2024-04-25 16:05:00+00'::timestamptz
  
  -- Maio 2024 (3 reviews)
  WHEN '5c8326de-9ecc-401f-968e-ff19d1577a23' THEN '2024-05-07 12:30:00+00'::timestamptz
  WHEN '71a2c1e7-c961-4df2-b15d-2368dcf2c35b' THEN '2024-05-16 15:45:00+00'::timestamptz
  WHEN '75dc85c9-3355-418f-8f14-6529c2619cce' THEN '2024-05-24 09:20:00+00'::timestamptz
  
  -- Junho 2024 (3 reviews)
  WHEN '90c90543-e5e8-46a7-ac9d-83c5b23e9594' THEN '2024-06-05 14:10:00+00'::timestamptz
  WHEN '937175f3-55f2-4500-8a66-dc64819acb1a' THEN '2024-06-14 11:25:00+00'::timestamptz
  WHEN 'a78f2234-3008-4157-a52e-7338d4c6d7d8' THEN '2024-06-22 16:40:00+00'::timestamptz
  
  -- Julho 2024 (2 reviews)
  WHEN 'aec32730-bbe0-4a7b-a68d-a00c212f59c5' THEN '2024-07-09 13:15:00+00'::timestamptz
  WHEN 'b7d0a3a7-ad81-42e1-88a7-d0ed09a1a744' THEN '2024-07-18 10:30:00+00'::timestamptz
  
  -- Agosto 2024 (2 reviews)
  WHEN 'bae04e21-b27d-47fa-b746-589aec80574d' THEN '2024-08-06 15:20:00+00'::timestamptz
  WHEN 'bcf4c0e3-6196-48c7-a204-aeea29bfdb99' THEN '2024-08-15 12:45:00+00'::timestamptz
  
  -- Setembro 2024 (2 reviews)
  WHEN 'bda61d15-2324-4bd7-83cc-8df68d5e44a2' THEN '2024-09-03 14:35:00+00'::timestamptz
  WHEN 'bf89a18b-5f62-49c1-a354-fd324bf0b10b' THEN '2024-09-12 11:10:00+00'::timestamptz
  
  -- Outubro 2024 (1 review)
  WHEN 'c3b23ef2-f576-4811-b36f-e48a2c6e8d25' THEN '2024-10-20 16:25:00+00'::timestamptz
  
  -- Novembro 2024 (1 review)
  WHEN 'c640b25f-24dd-4b0c-8e50-ba60613eac6f' THEN '2024-11-15 09:40:00+00'::timestamptz
  
  -- Janeiro 2025 (1 review)
  WHEN 'd526c63d-6097-4bc6-be1b-aa780085e85c' THEN '2025-01-10 14:15:00+00'::timestamptz
  
  -- Fevereiro 2025 (1 review)
  WHEN 'fd32b4f8-9074-42c8-bdc8-e4c391114624' THEN '2025-02-18 11:30:00+00'::timestamptz
  
  ELSE created_at
END
WHERE id IN (
  '01d1193e-2b4d-471e-ba42-a4eb1e9d228b','0ba248c1-d4da-42db-b903-d8b29f525882',
  '0d6b48bc-def5-427c-b08b-0450db8ba99e','17e7358f-a255-49bd-8294-8c548b7fc816',
  '184b941d-15c9-4e1e-b6a3-39d7717a3d3a','29c3dafd-db63-4a8d-a1a2-68f82d40e955',
  '32f35442-7fb3-4f67-8b52-b29712a2deb5','3815ed7b-7073-4868-b21c-edd5d68d936e',
  '3b61d946-1fe7-4bd1-bb88-6108713ea1b8','3f36a12d-0641-47ad-9959-74845fd5a614',
  '4a2d45fd-ecb8-467b-a854-31aae5c0fd93','509fe882-285e-459b-9516-9102271c5336',
  '5c8326de-9ecc-401f-968e-ff19d1577a23','71a2c1e7-c961-4df2-b15d-2368dcf2c35b',
  '75dc85c9-3355-418f-8f14-6529c2619cce','90c90543-e5e8-46a7-ac9d-83c5b23e9594',
  '937175f3-55f2-4500-8a66-dc64819acb1a','a78f2234-3008-4157-a52e-7338d4c6d7d8',
  'aec32730-bbe0-4a7b-a68d-a00c212f59c5','b7d0a3a7-ad81-42e1-88a7-d0ed09a1a744',
  'bae04e21-b27d-47fa-b746-589aec80574d','bcf4c0e3-6196-48c7-a204-aeea29bfdb99',
  'bda61d15-2324-4bd7-83cc-8df68d5e44a2','bf89a18b-5f62-49c1-a354-fd324bf0b10b',
  'c3b23ef2-f576-4811-b36f-e48a2c6e8d25','c640b25f-24dd-4b0c-8e50-ba60613eac6f',
  'd526c63d-6097-4bc6-be1b-aa780085e85c','fd32b4f8-9074-42c8-bdc8-e4c391114624'
);