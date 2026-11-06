create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references auth.users (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 70),
  author text not null check (char_length(btrim(author)) between 1 and 50),
  genre text not null check (
    genre in (
      'Romance',
      'Fantasia',
      'Ficção científica',
      'Mistério',
      'Terror',
      'Aventura',
      'Desenvolvimento pessoal'
    )
  ),
  description text not null check (char_length(btrim(description)) between 1 and 500),
  content text not null check (char_length(btrim(content)) between 1 and 50000),
  reads integer not null default 0 check (reads >= 0),
  cover integer not null default 1 check (cover between 1 and 8),
  created_at timestamptz not null default now()
);

alter table public.books enable row level security;

revoke all on table public.books from anon, authenticated;
grant select on table public.books to anon, authenticated;
grant insert (author_id, title, author, genre, description, content, cover)
  on table public.books to authenticated;
grant delete on table public.books to authenticated;

drop policy if exists "Anyone can read published books" on public.books;
create policy "Anyone can read published books"
  on public.books for select
  to anon, authenticated
  using (true);

drop policy if exists "Authors can publish their own books" on public.books;
create policy "Authors can publish their own books"
  on public.books for insert
  to authenticated
  with check ((select auth.uid()) = author_id);

drop policy if exists "Authors can delete their own books" on public.books;
create policy "Authors can delete their own books"
  on public.books for delete
  to authenticated
  using ((select auth.uid()) = author_id);
