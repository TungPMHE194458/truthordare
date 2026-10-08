-- Allow drawing from several modes at once (e.g. "default" + "couple" mixed together).

drop function if exists get_random_card(card_type, text, card_mode, smallint, text, card_difficulty, text[]);

create function get_random_card(
  p_type       card_type,
  p_language   text,
  p_modes      card_mode[]      default array['default']::card_mode[],
  p_level      smallint         default null,
  p_category   text             default null,
  p_difficulty card_difficulty  default null,
  p_exclude    text[]           default '{}'
) returns setof cards
language sql stable as $$
  select *
  from cards
  where type = p_type
    and is_active
    and language = p_language
    and mode = any(p_modes)
    and (p_level is null or level = p_level)
    and (p_category is null or category = p_category)
    and (p_difficulty is null or difficulty = p_difficulty)
    and not (id = any(p_exclude))
  order by random()
  limit 1;
$$;
