-- Mode system: default (everyone) / couple (levels 1-4) / dark (18+, levels 1-4)

create type card_mode as enum ('default', 'couple', 'dark');

alter table cards add column mode card_mode not null default 'default';
alter table cards add column level smallint check (level between 1 and 4);

-- A leveled card (couple/dark) must carry a level; a default card must not.
alter table cards add constraint cards_level_matches_mode check (
  (mode = 'default' and level is null) or (mode <> 'default' and level is not null)
);

drop index cards_lookup_idx;
create index cards_lookup_idx
  on cards (type, language, mode, level, category, difficulty)
  where is_active;

-- Replaces get_random_card with mode/level-aware filtering.
drop function if exists get_random_card(card_type, text, text, card_difficulty, text[]);

create function get_random_card(
  p_type       card_type,
  p_language   text,
  p_mode       card_mode       default 'default',
  p_level      smallint        default null,
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
    and mode = p_mode
    and (p_level is null or level = p_level)
    and (p_category is null or category = p_category)
    and (p_difficulty is null or difficulty = p_difficulty)
    and not (id = any(p_exclude))
  order by random()
  limit 1;
$$;
