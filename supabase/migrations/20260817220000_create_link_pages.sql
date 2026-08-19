create table link_pages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  title text not null default 'My Links',
  subtitle text,
  avatar_url text,
  theme_color text not null default '#6366f1',
  theme_bg text not null default '#ffffff',
  theme_font text not null default 'system',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_link_pages_user on link_pages(user_id);
create unique index idx_link_pages_slug on link_pages(slug);

create table link_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references link_pages(id) on delete cascade,
  title text not null default '',
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_link_sections_page on link_sections(page_id, sort_order);

create table link_items (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references link_sections(id) on delete cascade,
  title text not null default '',
  url text not null default '',
  icon_emoji text,
  icon_url text,
  sort_order integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

create index idx_link_items_section on link_items(section_id, sort_order);

alter table link_pages enable row level security;
alter table link_sections enable row level security;
alter table link_items enable row level security;

create policy "Public can read link pages by slug"
  on link_pages for select
  using (true);

create policy "Public can read visible sections"
  on link_sections for select
  using (visible = true);

create policy "Public can read visible items"
  on link_items for select
  using (visible = true);

create policy "Users can manage their own link pages"
  on link_pages for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can manage their own link sections"
  on link_sections for all
  using (
    exists (
      select 1 from link_pages
      where link_pages.id = link_sections.page_id
        and link_pages.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from link_pages
      where link_pages.id = link_sections.page_id
        and link_pages.user_id = auth.uid()
    )
  );

create policy "Users can manage their own link items"
  on link_items for all
  using (
    exists (
      select 1 from link_sections
      join link_pages on link_pages.id = link_sections.page_id
      where link_sections.id = link_items.section_id
        and link_pages.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from link_sections
      join link_pages on link_pages.id = link_sections.page_id
      where link_sections.id = link_items.section_id
        and link_pages.user_id = auth.uid()
    )
  );
