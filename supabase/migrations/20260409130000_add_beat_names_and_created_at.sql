alter table public.beat_files
  add column if not exists beat_name text,
  add column if not exists created_at timestamptz not null default now();

alter table public.beat_links
  add column if not exists beat_name text,
  add column if not exists created_at timestamptz not null default now();

create or replace function public.beat_name_from_storage_path(path text)
returns text
language plpgsql
as $$
declare
  file_name text;
begin
  if path is null or length(path) = 0 then
    return null;
  end if;

  file_name := regexp_replace(split_part(path, '/', array_length(string_to_array(path, '/'), 1)), '^\d+-', '');
  if position('.' in file_name) > 0 then
    return left(file_name, length(file_name) - length(split_part(file_name, '.', array_length(string_to_array(file_name, '.'), 1))) - 1);
  end if;
  return file_name;
end;
$$;

update public.beat_files
set beat_name = coalesce(beat_name, public.beat_name_from_storage_path(storage_path))
where beat_name is null;

update public.beat_links
set beat_name = coalesce(beat_name, initcap(provider) || ' Link')
where beat_name is null;
