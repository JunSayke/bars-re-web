insert into storage.buckets (id, name, public)
values ('beats', 'beats', false)
on conflict (id) do nothing;
