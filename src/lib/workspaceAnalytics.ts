import { supabase } from "@/integrations/supabase/client";

export type PageViewRow = {
  page_id: string;
  device: string | null;
  referrer: string | null;
  viewed_at: string;
  city: string | null;
  country: string | null;
  country_code: string | null;
};

export type ItemClickRow = {
  item_id: string;
  device: string | null;
  referrer: string | null;
  clicked_at: string;
  city: string | null;
  country: string | null;
  country_code: string | null;
};

export async function listPageViews(pageIds: string[]): Promise<PageViewRow[]> {
  if (pageIds.length === 0) return [];
  const { data, error } = await supabase
    .from("link_page_views")
    .select("page_id, device, referrer, viewed_at, city, country, country_code")
    .in("page_id", pageIds)
    .order("viewed_at", { ascending: false })
    .limit(5000);
  if (error) throw error;
  return (data ?? []) as PageViewRow[];
}

export async function listItemClicks(itemIds: string[]): Promise<ItemClickRow[]> {
  if (itemIds.length === 0) return [];
  const { data, error } = await supabase
    .from("link_item_clicks")
    .select("item_id, device, referrer, clicked_at, city, country, country_code")
    .in("item_id", itemIds)
    .order("clicked_at", { ascending: false })
    .limit(5000);
  if (error) throw error;
  return (data ?? []) as ItemClickRow[];
}
