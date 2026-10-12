import { supabase, isSupabaseConfigured } from './supabase';
import { UserProfile, CanonicalTrip } from '../types/trip';

/**
 * Multi-User Data Isolation Helper:
 * Generates keys strictly scoped to userId to prevent cross-account data leakage.
 */
export function getStorageKey(prefix: string, userId: string): string {
  if (!userId) {
    throw new Error('User ID is required for storage isolation');
  }
  return `beemvoy_${prefix}_${userId}`;
}

/**
 * Save user profile to user-scoped local storage and sync to Supabase (if configured)
 */
export async function saveIsolatedProfile(userId: string, profile: UserProfile): Promise<void> {
  if (!userId) return;

  const key = getStorageKey('profile', userId);
  try {
    localStorage.setItem(key, JSON.stringify(profile));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('profiles').upsert({
        id: userId,
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        membership_tier: profile.membership_tier,
        pacing: profile.pacing,
        budget_tier: profile.budget_tier,
        interests: profile.interests,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase profile upsert warning (RLS/network):', err);
    }
  }
}

/**
 * Load user profile with user isolation
 */
export async function loadIsolatedProfile(userId: string): Promise<UserProfile | null> {
  if (!userId) return null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && data) {
        const loaded: UserProfile = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone || '+91 ',
          membership_tier: data.membership_tier || 'Beemvoy Verified Explorer',
          pacing: data.pacing || 'balanced',
          budget_tier: data.budget_tier || 'comfort',
          interests: data.interests || ['Mountain Treks', 'Tea Plantations'],
          updated_at: data.updated_at || new Date().toISOString()
        };
        // Sync local cache
        localStorage.setItem(getStorageKey('profile', userId), JSON.stringify(loaded));
        return loaded;
      }
    } catch (err) {
      console.warn('Supabase profile load warning:', err);
    }
  }

  // Fallback to local user-scoped storage
  const key = getStorageKey('profile', userId);
  const cached = localStorage.getItem(key);
  if (cached) {
    try {
      return JSON.parse(cached) as UserProfile;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Save canonical trip with user isolation
 */
export async function saveIsolatedTrip(userId: string, trip: CanonicalTrip): Promise<void> {
  if (!userId || !trip) return;

  const activeKey = getStorageKey('active_trip', userId);
  try {
    localStorage.setItem(activeKey, JSON.stringify(trip));

    // Also update user's trip list in isolated storage
    const listKey = getStorageKey('trips', userId);
    const existingListRaw = localStorage.getItem(listKey);
    let tripsList: CanonicalTrip[] = existingListRaw ? JSON.parse(existingListRaw) : [];
    const index = tripsList.findIndex(t => t.id === trip.id);
    if (index >= 0) {
      tripsList[index] = trip;
    } else {
      tripsList.unshift(trip);
    }
    localStorage.setItem(listKey, JSON.stringify(tripsList));
  } catch (err) {
    console.warn('LocalStorage trip save warning:', err);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('trips').upsert({
        id: trip.id,
        user_id: userId,
        title: trip.title,
        destination: trip.destination,
        origin: trip.origin,
        days: trip.days,
        dates: trip.dates,
        status: trip.status,
        budget_total_inr: trip.budget_total_inr,
        selected_flight: trip.selected_flight,
        selected_hotel: trip.selected_hotel,
        selected_activities: trip.selected_activities,
        itinerary_days: trip.itinerary_days,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase trip upsert warning (RLS/network):', err);
    }
  }
}

/**
 * Load active trip for user
 */
export async function loadIsolatedActiveTrip(userId: string): Promise<CanonicalTrip | null> {
  if (!userId) return null;

  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })
        .limit(1);

      if (!error && data && data.length > 0) {
        const item = data[0];
        const trip: CanonicalTrip = {
          id: item.id,
          user_id: item.user_id,
          title: item.title,
          destination: item.destination,
          origin: item.origin || 'BLR',
          days: item.days,
          dates: item.dates,
          status: item.status,
          budget_total_inr: item.budget_total_inr,
          travellers: item.travellers || 2,
          selected_flight: item.selected_flight,
          selected_hotel: item.selected_hotel,
          selected_activities: item.selected_activities || [],
          itinerary_days: item.itinerary_days || [],
          created_at: item.created_at,
          updated_at: item.updated_at
        };
        localStorage.setItem(getStorageKey('active_trip', userId), JSON.stringify(trip));
        return trip;
      }
    } catch (err) {
      console.warn('Supabase trip load warning:', err);
    }
  }

  const key = getStorageKey('active_trip', userId);
  const cached = localStorage.getItem(key);
  if (cached) {
    try {
      return JSON.parse(cached) as CanonicalTrip;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Session Termination & Storage Purge
 * Purges all user-scoped storage items and invalidates session token.
 */
export async function purgeUserSessionState(userId?: string): Promise<void> {
  if (userId) {
    try {
      localStorage.removeItem(getStorageKey('profile', userId));
      localStorage.removeItem(getStorageKey('active_trip', userId));
      localStorage.removeItem(getStorageKey('trips', userId));
    } catch (err) {
      console.warn('Storage purge warning:', err);
    }
  }

  // Clear global session marker
  try {
    localStorage.removeItem('beemvoy_session');
    localStorage.removeItem('beemvoy_remembered_email');
  } catch (err) {
    console.warn('Session clear warning:', err);
  }

  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('Supabase sign out error:', err);
    }
  }
}
