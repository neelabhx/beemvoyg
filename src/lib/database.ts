import { supabase, isSupabaseConfigured } from './supabase';
import { UserProfile, CanonicalTrip } from '../types/trip';

/**
 * Multi-User Data Isolation Helper:
 * Sanitizes and generates storage keys strictly scoped to authenticated userId
 * to enforce client-level isolation and prevent cross-account cache leakage.
 */
export function getStorageKey(prefix: string, userId: string): string {
  if (!userId || typeof userId !== 'string') {
    throw new Error('Valid User ID is required for storage isolation');
  }
  // Sanitize userId to prevent key collision or injection
  const safeUserId = userId.replace(/[^a-zA-Z0-9_-]/g, '');
  return `beemvoy_${prefix}_${safeUserId}`;
}

/**
 * Validates and retrieves current authenticated user ID from Supabase auth session
 * to guarantee database-level Row Level Security policy alignment.
 */
async function getVerifiedAuthUserId(): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) return null;
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user) return null;
    return user.id;
  } catch (err) {
    console.warn('Auth session verification error:', err);
    return null;
  }
}

/**
 * Save user profile to user-scoped storage and synchronize to Supabase profiles table
 * Enforced by Supabase Row Level Security policy (auth.uid() = id).
 */
export async function saveIsolatedProfile(userId: string, profile: UserProfile): Promise<void> {
  if (!userId) return;

  // 1. User-scoped local storage cache
  const key = getStorageKey('profile', userId);
  try {
    localStorage.setItem(key, JSON.stringify(profile));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }

  // 2. Synchronize to Supabase with database-level RLS policy validation
  if (isSupabaseConfigured && supabase) {
    try {
      const verifiedUid = await getVerifiedAuthUserId();
      const targetId = verifiedUid || userId;

      const { error } = await supabase.from('profiles').upsert({
        id: targetId,
        name: profile.name.trim(),
        email: profile.email.trim(),
        phone: profile.phone ? profile.phone.trim() : null,
        membership_tier: profile.membership_tier || 'Beemvoyg Verified Explorer',
        pacing: profile.pacing || 'balanced',
        budget_tier: profile.budget_tier || 'comfort',
        interests: Array.isArray(profile.interests) ? profile.interests : ['Mountain Treks', 'Tea Plantations'],
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

      if (error) {
        console.warn('Supabase profile upsert guarded by RLS:', error.message);
      }
    } catch (err) {
      console.warn('Supabase profile upsert network/RLS exception:', err);
    }
  }
}

/**
 * Load user profile with strict user-level isolation
 * Enforced by Supabase Row Level Security policy (auth.uid() = id).
 */
export async function loadIsolatedProfile(userId: string): Promise<UserProfile | null> {
  if (!userId) return null;

  // 1. Attempt database-level authenticated query if Supabase is active
  if (isSupabaseConfigured && supabase) {
    try {
      const verifiedUid = await getVerifiedAuthUserId();
      const queryId = verifiedUid || userId;

      const { data, error } = await supabase
        .from('profiles')
        .select('id, name, email, phone, membership_tier, pacing, budget_tier, interests, updated_at')
        .eq('id', queryId)
        .maybeSingle();

      if (!error && data) {
        const loaded: UserProfile = {
          id: data.id,
          name: data.name,
          email: data.email,
          phone: data.phone || '+91 ',
          membership_tier: data.membership_tier || 'Beemvoyg Verified Explorer',
          pacing: data.pacing || 'balanced',
          budget_tier: data.budget_tier || 'comfort',
          interests: data.interests || ['Mountain Treks', 'Tea Plantations'],
          updated_at: data.updated_at || new Date().toISOString()
        };
        // Update user-scoped local cache
        localStorage.setItem(getStorageKey('profile', userId), JSON.stringify(loaded));
        return loaded;
      }
    } catch (err) {
      console.warn('Supabase profile load warning:', err);
    }
  }

  // 2. Fallback to user-isolated local cache
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
 * Enforced by Supabase Row Level Security policy (auth.uid() = user_id).
 */
export async function saveIsolatedTrip(userId: string, trip: CanonicalTrip): Promise<void> {
  if (!userId || !trip) return;

  // 1. User-scoped local storage cache
  const activeKey = getStorageKey('active_trip', userId);
  try {
    localStorage.setItem(activeKey, JSON.stringify(trip));

    // Update user's private trips collection
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

  // 2. Synchronize to Supabase with database-level RLS policy validation
  if (isSupabaseConfigured && supabase) {
    try {
      const verifiedUid = await getVerifiedAuthUserId();
      const targetUserId = verifiedUid || userId;

      const { error } = await supabase.from('trips').upsert({
        id: trip.id,
        user_id: targetUserId,
        title: trip.title,
        destination: trip.destination,
        origin: trip.origin || 'BLR',
        days: trip.days,
        dates: trip.dates,
        status: trip.status,
        budget_total_inr: trip.budget_total_inr,
        travellers: trip.travellers || 2,
        selected_flight: trip.selected_flight,
        selected_hotel: trip.selected_hotel,
        selected_activities: trip.selected_activities || [],
        itinerary_days: trip.itinerary_days || [],
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

      if (error) {
        console.warn('Supabase trip upsert guarded by RLS:', error.message);
      }
    } catch (err) {
      console.warn('Supabase trip upsert network/RLS exception:', err);
    }
  }
}

/**
 * Load active trip strictly scoped to user
 * Enforced by Supabase Row Level Security policy (auth.uid() = user_id).
 */
export async function loadIsolatedActiveTrip(userId: string): Promise<CanonicalTrip | null> {
  if (!userId) return null;

  // 1. Attempt database-level authenticated query if Supabase is active
  if (isSupabaseConfigured && supabase) {
    try {
      const verifiedUid = await getVerifiedAuthUserId();
      const queryUserId = verifiedUid || userId;

      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', queryUserId)
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

  // 2. Fallback to user-isolated local cache
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
 * Purges all user-scoped storage items and invalidates Supabase authentication session.
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

  // Clear session markers
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
