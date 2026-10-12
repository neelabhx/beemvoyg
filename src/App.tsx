/**
 * BEEMVOYG AI Travel Planner - Main Application Controller
 */

import React, { useState, useEffect } from 'react';
import { PhoneFrame } from './components/PhoneFrame';
import { BottomNav, NavTab } from './components/BottomNav';
import { AuthScreen } from './components/AuthScreen';
import { HomeScreen } from './components/HomeScreen';
import { BookingsScreen } from './components/BookingsScreen';
import { ExploreScreen } from './components/ExploreScreen';
import { TripScreen } from './components/TripScreen';
import { ProfileScreen } from './components/ProfileScreen';

import { UserProfile, CanonicalTrip, TripFlight, TripHotel, TripActivity } from './types/trip';
import { createCanonicalTrip, buildDefaultItinerary } from './lib/mockData';
import {
  loadIsolatedProfile,
  saveIsolatedProfile,
  loadIsolatedActiveTrip,
  saveIsolatedTrip,
  purgeUserSessionState
} from './lib/database';

export default function App() {
  const [sessionUser, setSessionUser] = useState<{ id: string; email: string } | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [canonicalTrip, setCanonicalTrip] = useState<CanonicalTrip | null>(null);
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [bookingsSubTab, setBookingsSubTab] = useState<'flights' | 'hotels'>('flights');
  const [tripSubTab, setTripSubTab] = useState<'timeline' | 'split'>('timeline');
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Check persistent session on initial mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        const savedSessionRaw = localStorage.getItem('beemvoy_session');
        if (savedSessionRaw) {
          const parsedUser = JSON.parse(savedSessionRaw);
          if (parsedUser && parsedUser.id) {
            setSessionUser(parsedUser);
            // Load isolated profile and active trip
            const isolatedProf = await loadIsolatedProfile(parsedUser.id);
            if (isolatedProf) {
              setUserProfile(isolatedProf);
            }
            const isolatedTrip = await loadIsolatedActiveTrip(parsedUser.id);
            if (isolatedTrip) {
              setCanonicalTrip(isolatedTrip);
            } else {
              const defaultTrip = createCanonicalTrip('Munnar', 3, 30000, parsedUser.id);
              setCanonicalTrip(defaultTrip);
              await saveIsolatedTrip(parsedUser.id, defaultTrip);
            }
          }
        }
      } catch (err) {
        console.warn('Session initialization warning:', err);
      } finally {
        setIsAppLoading(false);
      }
    };

    initializeSession();
  }, []);

  // Handler for successful authentication and preference onboarding
  const handleAuthSuccess = async (
    user: { id: string; email: string },
    profile: UserProfile
  ) => {
    setSessionUser(user);
    setUserProfile(profile);

    try {
      localStorage.setItem('beemvoy_session', JSON.stringify(user));
      await saveIsolatedProfile(user.id, profile);

      // Check or generate active trip
      let trip = await loadIsolatedActiveTrip(user.id);
      if (!trip) {
        const defaultDest = profile.interests.includes('Beaches')
          ? 'Goa'
          : profile.interests.includes('Heritage')
          ? 'Jaipur'
          : 'Munnar';
        trip = createCanonicalTrip(defaultDest, 3, 30000, user.id);
        await saveIsolatedTrip(user.id, trip);
      }
      setCanonicalTrip(trip);
      setCurrentTab('home');
    } catch (err) {
      console.warn('Post-auth initialization error:', err);
    }
  };

  // Sign out and purge isolated user session
  const handleSignOut = async () => {
    if (sessionUser?.id) {
      await purgeUserSessionState(sessionUser.id);
    }
    setSessionUser(null);
    setUserProfile(null);
    setCanonicalTrip(null);
    setCurrentTab('home');
  };

  // Synthesize Intent via Server Proxy (/api/parse-intent)
  const handleSynthesizeIntent = async (promptText: string) => {
    if (!canonicalTrip || !sessionUser) return;
    setIsSynthesizing(true);

    try {
      const res = await fetch('/api/parse-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptText })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.intent) {
          const { destination, duration_days, budget_total_inr } = data.intent;
          const freshTrip = createCanonicalTrip(
            destination,
            duration_days || 3,
            budget_total_inr || 30000,
            sessionUser.id
          );
          setCanonicalTrip(freshTrip);
          await saveIsolatedTrip(sessionUser.id, freshTrip);
        }
      }
    } catch (err) {
      console.warn('Intent parsing failed, keeping current trip:', err);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // Component selection handlers
  const handleSelectFlight = async (flight: TripFlight) => {
    if (!canonicalTrip || !sessionUser) return;
    const updatedItinerary = buildDefaultItinerary(
      canonicalTrip.destination,
      canonicalTrip.days,
      flight,
      canonicalTrip.selected_hotel,
      canonicalTrip.selected_activities
    );
    const updatedTrip: CanonicalTrip = {
      ...canonicalTrip,
      selected_flight: flight,
      itinerary_days: updatedItinerary,
      updated_at: new Date().toISOString()
    };
    setCanonicalTrip(updatedTrip);
    await saveIsolatedTrip(sessionUser.id, updatedTrip);
  };

  const handleSelectHotel = async (hotel: TripHotel) => {
    if (!canonicalTrip || !sessionUser) return;
    const updatedItinerary = buildDefaultItinerary(
      canonicalTrip.destination,
      canonicalTrip.days,
      canonicalTrip.selected_flight,
      hotel,
      canonicalTrip.selected_activities
    );
    const updatedTrip: CanonicalTrip = {
      ...canonicalTrip,
      selected_hotel: hotel,
      itinerary_days: updatedItinerary,
      updated_at: new Date().toISOString()
    };
    setCanonicalTrip(updatedTrip);
    await saveIsolatedTrip(sessionUser.id, updatedTrip);
  };

  const handleToggleActivity = async (activity: TripActivity) => {
    if (!canonicalTrip || !sessionUser) return;
    const isAlready = canonicalTrip.selected_activities.some(a => a.id === activity.id);
    const updatedActivities = isAlready
      ? canonicalTrip.selected_activities.filter(a => a.id !== activity.id)
      : [...canonicalTrip.selected_activities, { ...activity, is_selected: true }];

    const updatedItinerary = buildDefaultItinerary(
      canonicalTrip.destination,
      canonicalTrip.days,
      canonicalTrip.selected_flight,
      canonicalTrip.selected_hotel,
      updatedActivities
    );

    const updatedTrip: CanonicalTrip = {
      ...canonicalTrip,
      selected_activities: updatedActivities,
      itinerary_days: updatedItinerary,
      updated_at: new Date().toISOString()
    };
    setCanonicalTrip(updatedTrip);
    await saveIsolatedTrip(sessionUser.id, updatedTrip);
  };

  const handleToggleVisited = async (dayIndex: number, waypointId: string) => {
    if (!canonicalTrip || !sessionUser) return;
    const updatedDays = [...canonicalTrip.itinerary_days];
    const targetDay = updatedDays[dayIndex];
    if (!targetDay) return;

    targetDay.waypoints = targetDay.waypoints.map(wp =>
      wp.id === waypointId ? { ...wp, is_visited: !wp.is_visited } : wp
    );

    const updatedTrip: CanonicalTrip = {
      ...canonicalTrip,
      itinerary_days: updatedDays,
      updated_at: new Date().toISOString()
    };
    setCanonicalTrip(updatedTrip);
    await saveIsolatedTrip(sessionUser.id, updatedTrip);
  };

  const handleUpdateProfile = async (updated: UserProfile) => {
    if (!sessionUser) return;
    setUserProfile(updated);
    await saveIsolatedProfile(sessionUser.id, updated);
  };

  const handleConfirmBooking = async () => {
    if (!canonicalTrip || !sessionUser) return;
    const bookedTrip: CanonicalTrip = {
      ...canonicalTrip,
      status: 'booked',
      updated_at: new Date().toISOString()
    };
    setCanonicalTrip(bookedTrip);
    await saveIsolatedTrip(sessionUser.id, bookedTrip);
  };

  if (isAppLoading) {
    return (
      <PhoneFrame>
        <div className="w-full h-full flex items-center justify-center bg-slate-950 text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <span className="text-xs font-semibold tracking-wider text-purple-300">
              BEEMVOYG INITIALIZING...
            </span>
          </div>
        </div>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      {!sessionUser || !userProfile || !canonicalTrip ? (
        /* Mandatory Authentication & Preference Onboarding */
        <AuthScreen onAuthSuccess={handleAuthSuccess} />
      ) : (
        /* Authenticated Main App Shell */
        <>
          <main className="w-full h-full relative overflow-hidden">
            {currentTab === 'home' && (
              <HomeScreen
                userProfile={userProfile}
                canonicalTrip={canonicalTrip}
                isSynthesizing={isSynthesizing}
                onSynthesizeIntent={handleSynthesizeIntent}
                onOpenFlights={() => {
                  setBookingsSubTab('flights');
                  setCurrentTab('bookings');
                }}
                onOpenHotels={() => {
                  setBookingsSubTab('hotels');
                  setCurrentTab('bookings');
                }}
                onOpenItinerary={() => {
                  setTripSubTab('timeline');
                  setCurrentTab('trip');
                }}
              />
            )}

            {currentTab === 'bookings' && (
              <BookingsScreen
                destination={canonicalTrip.destination}
                nightsCount={canonicalTrip.days - 1}
                selectedFlight={canonicalTrip.selected_flight}
                selectedHotel={canonicalTrip.selected_hotel}
                onSelectFlight={handleSelectFlight}
                onSelectHotel={handleSelectHotel}
                onProceedToExplore={() => setCurrentTab('explore')}
                initialSubTab={bookingsSubTab}
              />
            )}

            {currentTab === 'explore' && (
              <ExploreScreen
                destination={canonicalTrip.destination}
                selectedActivities={canonicalTrip.selected_activities}
                onToggleActivity={handleToggleActivity}
                onViewItinerary={() => {
                  setTripSubTab('timeline');
                  setCurrentTab('trip');
                }}
              />
            )}

            {currentTab === 'trip' && (
              <TripScreen
                canonicalTrip={canonicalTrip}
                onToggleVisited={handleToggleVisited}
                onOpenExplore={() => setCurrentTab('explore')}
                onConfirmBooking={handleConfirmBooking}
                initialSubTab={tripSubTab}
              />
            )}

            {currentTab === 'profile' && (
              <ProfileScreen
                userProfile={userProfile}
                onUpdateProfile={handleUpdateProfile}
                onSignOut={handleSignOut}
              />
            )}
          </main>

          {/* Persistent Mobile Bottom Navigation Bar (5 clean tabs) */}
          <BottomNav
            activeTab={currentTab}
            onTabChange={(tab) => setCurrentTab(tab)}
            activitiesCount={canonicalTrip.selected_activities.length}
          />
        </>
      )}
    </PhoneFrame>
  );
}
