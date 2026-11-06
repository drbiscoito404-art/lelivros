alter table public.books
  add column if not exists book_path text,
  add column if not exists book_format text,
  add column if not exists cover_path text;

alter table public.books
  alter column content drop not null;

alter table public.books
  drop constraint if exists books_content_check,
  add constraint books_content_check check (
    (book_path is null and book_format is null and content is not null
      and char_length(btrim(content)) between 1 and 50000)
    or
    (book_path is not null and book_format is not null
      and book_format in ('pdf', 'epub') and content is null)
  );

alter table public.books
  drop constraint if exists books_book_file_path_check,
  add constraint books_book_file_path_check check (
    book_path is null or book_path ~ '^[0-9a-f-]+/[0-9a-f-]+/book\.(pdf|epub)$'
  );

alter table public.books
  drop constraint if exists books_cover_file_path_check,
  add constraint books_cover_file_path_check check (
    cover_path is null or cover_path ~ '^[0-9a-f-]+/[0-9a-f-]+/cover\.(webp|jpg|png)$'
  );

grant insert (book_path, book_format, cover_path)
  on public.books to authenticated;
grant select (book_path, book_format, cover_path)
  on public.books to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'lelivros-books',
  'lelivros-books',
  true,
  20971520,
  array['application/pdf', 'application/epub+zip', 'image/webp', 'image/jpeg', 'image/png']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Anyone can read LeLivros assets" on storage.objects;
create policy "Anyone can read LeLivros assets"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'lelivros-books');

drop policy if exists "Authors can upload their own LeLivros assets" on storage.objects;
create policy "Authors can upload their own LeLivros assets"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'lelivros-books'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

drop policy if exists "Authors can delete their own LeLivros assets" on storage.objects;
create policy "Authors can delete their own LeLivros assets"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'lelivros-books'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );
