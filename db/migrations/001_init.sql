-- Truth or Dare cards schema

create type card_type as enum ('truth', 'dare');
create type card_difficulty as enum ('easy', 'medium', 'hard');

create table cards (
  id          text primary key,
  type        card_type not null,
  content     text not null check (length(btrim(content)) > 0),
  category    text not null default 'fun'
              check (category in ('fun', 'friends', 'couples', 'party', 'embarrassing', 'deep', 'wild', '18+')),
  difficulty  card_difficulty not null default 'easy',
  language    text not null default 'vi' check (language in ('vi', 'en')),
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index cards_lookup_idx
  on cards (type, language, category, difficulty)
  where is_active;

create function set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end
$$;

create trigger cards_set_updated_at
  before update on cards
  for each row execute function set_updated_at();

-- Picks one random active card. ORDER BY random() scans the filtered set,
-- which is fine up to tens of thousands of rows; switch to an indexed
-- random_key column if the table grows far beyond that.
create function get_random_card(
  p_type       card_type,
  p_language   text,
  p_category   text            default null,
  p_difficulty card_difficulty default null,
  p_exclude    text[]          default '{}'
) returns setof cards
language sql stable as $$
  select *
  from cards
  where type = p_type
    and is_active
    and language = p_language
    and (p_category is null or category = p_category)
    and (p_difficulty is null or difficulty = p_difficulty)
    and not (id = any(p_exclude))
  order by random()
  limit 1;
$$;

-- On Supabase: keep the table private to the anon/authenticated roles.
-- The app connects server-side with DATABASE_URL only.
alter table cards enable row level security;
