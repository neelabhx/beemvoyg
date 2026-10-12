import { TripFlight, TripHotel, TripActivity, CanonicalTrip, ItineraryDay } from '../types/trip';

export const MOCK_FLIGHTS_DATA: Record<string, TripFlight[]> = {
  Munnar: [
    {
      id: 'flt-blr-cok-01',
      airline: 'IndiGo',
      flight_number: '6E-512',
      departure: '06:15 AM',
      arrival: '07:30 AM',
      duration: '1h 15m',
      price_inr: 3850,
      formatted_price: '₹3,850',
      badge: 'Best',
      origin: 'BLR',
      destination: 'COK',
      origin_city: 'Bengaluru (BLR)',
      destination_city: 'Kochi (COK) - Munnar Gateway',
      stops: 'Non-stop',
      cabin: 'Economy'
    },
    {
      id: 'flt-blr-cok-02',
      airline: 'Akasa Air',
      flight_number: 'QP-1382',
      departure: '08:45 AM',
      arrival: '10:05 AM',
      duration: '1h 20m',
      price_inr: 3200,
      formatted_price: '₹3,200',
      badge: 'Cheapest',
      origin: 'BLR',
      destination: 'COK',
      origin_city: 'Bengaluru (BLR)',
      destination_city: 'Kochi (COK)',
      stops: 'Non-stop',
      cabin: 'Economy'
    },
    {
      id: 'flt-blr-cok-03',
      airline: 'Air India Express',
      flight_number: 'IX-143',
      departure: '05:40 AM',
      arrival: '06:50 AM',
      duration: '1h 10m',
      price_inr: 4450,
      formatted_price: '₹4,450',
      badge: 'Fastest',
      origin: 'BLR',
      destination: 'COK',
      origin_city: 'Bengaluru (BLR)',
      destination_city: 'Kochi (COK)',
      stops: 'Non-stop',
      cabin: 'Economy Prime'
    }
  ],
  Goa: [
    {
      id: 'flt-blr-goi-01',
      airline: 'IndiGo',
      flight_number: '6E-645',
      departure: '07:00 AM',
      arrival: '08:15 AM',
      duration: '1h 15m',
      price_inr: 3499,
      formatted_price: '₹3,499',
      badge: 'Best',
      origin: 'BLR',
      destination: 'GOI',
      origin_city: 'Bengaluru (BLR)',
      destination_city: 'Goa Dabolim (GOI)',
      stops: 'Non-stop',
      cabin: 'Economy'
    },
    {
      id: 'flt-blr-goi-02',
      airline: 'SpiceJet',
      flight_number: 'SG-103',
      departure: '10:30 AM',
      arrival: '11:55 AM',
      duration: '1h 25m',
      price_inr: 2950,
      formatted_price: '₹2,950',
      badge: 'Cheapest',
      origin: 'BLR',
      destination: 'GOI',
      origin_city: 'Bengaluru (BLR)',
      destination_city: 'Goa (GOX)',
      stops: 'Non-stop',
      cabin: 'Economy'
    },
    {
      id: 'flt-blr-goi-03',
      airline: 'Vistara / Air India',
      flight_number: 'AI-581',
      departure: '06:00 AM',
      arrival: '07:10 AM',
      duration: '1h 10m',
      price_inr: 4200,
      formatted_price: '₹4,200',
      badge: 'Fastest',
      origin: 'BLR',
      destination: 'GOI',
      origin_city: 'Bengaluru (BLR)',
      destination_city: 'Goa (GOI)',
      stops: 'Non-stop',
      cabin: 'Premium Economy'
    }
  ],
  Jaipur: [
    {
      id: 'flt-blr-jai-01',
      airline: 'IndiGo',
      flight_number: '6E-481',
      departure: '06:10 AM',
      arrival: '08:45 AM',
      duration: '2h 35m',
      price_inr: 5120,
      formatted_price: '₹5,120',
      badge: 'Best',
      origin: 'BLR',
      destination: 'JAI',
      origin_city: 'Bengaluru (BLR)',
      destination_city: 'Jaipur (JAI)',
      stops: 'Non-stop',
      cabin: 'Economy'
    },
    {
      id: 'flt-blr-jai-02',
      airline: 'Air India Express',
      flight_number: 'IX-772',
      departure: '09:20 AM',
      arrival: '12:00 PM',
      duration: '2h 40m',
      price_inr: 4650,
      formatted_price: '₹4,650',
      badge: 'Cheapest',
      origin: 'BLR',
      destination: 'JAI',
      origin_city: 'Bengaluru (BLR)',
      destination_city: 'Jaipur (JAI)',
      stops: 'Non-stop',
      cabin: 'Economy'
    },
    {
      id: 'flt-blr-jai-03',
      airline: 'Air India',
      flight_number: 'AI-840',
      departure: '05:30 AM',
      arrival: '07:55 AM',
      duration: '2h 25m',
      price_inr: 5900,
      formatted_price: '₹5,900',
      badge: 'Fastest',
      origin: 'BLR',
      destination: 'JAI',
      origin_city: 'Bengaluru (BLR)',
      destination_city: 'Jaipur (JAI)',
      stops: 'Non-stop',
      cabin: 'Economy Flex'
    }
  ]
};

export const MOCK_HOTELS_DATA: Record<string, TripHotel[]> = {
  Munnar: [
    {
      id: 'hot-munnar-01',
      name: 'Fragrant Nature Munnar Luxury Retreat',
      location: 'Pothamedu Viewpoint Ridge, Munnar',
      rating: 4.8,
      reviews_count: 940,
      price_per_night_inr: 5800,
      total_price_inr: 11600,
      nights: 2,
      amenities: ['Free WiFi', 'Breakfast Included', 'Tea Valley Spa', 'Heated Fireplace'],
      badge: 'Best',
      image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
      distance_to_center: '4.2 km from Munnar Town'
    },
    {
      id: 'hot-munnar-02',
      name: 'The Tall Trees Eco Resort & Canopy Walk',
      location: 'Bison Valley Road, Pothamedu',
      rating: 4.7,
      reviews_count: 620,
      price_per_night_inr: 4200,
      total_price_inr: 8400,
      nights: 2,
      amenities: ['Free WiFi', 'Breakfast Included', 'Forest Trail', 'Organic Café'],
      badge: 'Cheapest',
      image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      distance_to_center: '5.8 km from Munnar Town'
    },
    {
      id: 'hot-munnar-03',
      name: 'Elixir Hills Suites & Ayurvedic Spa',
      location: 'Near Letchmi Tea Estate, Munnar',
      rating: 4.9,
      reviews_count: 1150,
      price_per_night_inr: 7200,
      total_price_inr: 14400,
      nights: 2,
      amenities: ['Free WiFi', 'Infinity Pool', 'Spa & Wellness', 'Valet Parking'],
      badge: 'Top Pick',
      image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
      distance_to_center: '7.1 km from Munnar Town'
    }
  ],
  Goa: [
    {
      id: 'hot-goa-01',
      name: 'Ahilya by the Sea Heritage Villa',
      location: 'Dolphin Bay, Nerul, North Goa',
      rating: 4.9,
      reviews_count: 530,
      price_per_night_inr: 6500,
      total_price_inr: 13000,
      nights: 2,
      amenities: ['Free WiFi', 'Breakfast Included', 'Sea View', 'Plunge Pool'],
      badge: 'Best',
      image_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
      distance_to_center: '200m from Nerul Beach'
    },
    {
      id: 'hot-goa-02',
      name: 'Santana Beach Resort Boutique',
      location: 'Candolim Coastline, North Goa',
      rating: 4.6,
      reviews_count: 820,
      price_per_night_inr: 3600,
      total_price_inr: 7200,
      nights: 2,
      amenities: ['Free WiFi', 'Breakfast Included', 'Direct Beach Access', 'Bar & Bistro'],
      badge: 'Cheapest',
      image_url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=600&q=80',
      distance_to_center: '100m from Candolim Beach'
    },
    {
      id: 'hot-goa-03',
      name: 'W Goa Tropical Beachfront Haven',
      location: 'Vagator Beach, North Goa',
      rating: 4.8,
      reviews_count: 1400,
      price_per_night_inr: 8900,
      total_price_inr: 17800,
      nights: 2,
      amenities: ['Free WiFi', 'Rock Pool', 'Spa by Clarins', 'Private Beach Access'],
      badge: 'Top Pick',
      image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
      distance_to_center: 'Facing Vagator Cliffs'
    }
  ],
  Jaipur: [
    {
      id: 'hot-jaipur-01',
      name: 'Shahpura House Heritage Haveli',
      location: 'Devi Marg, Bani Park, Jaipur',
      rating: 4.8,
      reviews_count: 1120,
      price_per_night_inr: 4900,
      total_price_inr: 9800,
      nights: 2,
      amenities: ['Free WiFi', 'Rooftop Dining', 'Royal Courtyard Pool', 'Rajasthani Breakfast'],
      badge: 'Best',
      image_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
      distance_to_center: '2.5 km from City Palace'
    },
    {
      id: 'hot-jaipur-02',
      name: 'Umaid Bhawan Heritage Home',
      location: 'Behari Marg, Bani Park',
      rating: 4.6,
      reviews_count: 780,
      price_per_night_inr: 3200,
      total_price_inr: 6400,
      nights: 2,
      amenities: ['Free WiFi', 'Breakfast Included', 'Frescoed Lounge', 'Airport Transfer'],
      badge: 'Cheapest',
      image_url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80',
      distance_to_center: '3.0 km from Old City'
    },
    {
      id: 'hot-jaipur-03',
      name: 'Samode Haveli Royal Residence',
      location: 'Gangapole, Old City, Jaipur',
      rating: 4.9,
      reviews_count: 890,
      price_per_night_inr: 8500,
      total_price_inr: 17000,
      nights: 2,
      amenities: ['Free WiFi', 'Historic Spa', 'Jacuzzi Courtyard', 'Royal High Tea'],
      badge: 'Top Pick',
      image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80',
      distance_to_center: '800m from Hawa Mahal'
    }
  ]
};

export const MOCK_ACTIVITIES_DATA: Record<string, TripActivity[]> = {
  Munnar: [
    {
      id: 'act-munnar-01',
      title: 'Meesapulimala High Altitude Dawn Trek',
      category: 'Trek',
      duration: '5 hours',
      rating: 4.9,
      price_per_person_inr: 1450,
      description: 'Ascend through misty rhododendron valleys to South India’s second highest peak with panoramic views of tea estates cascading into Tamil Nadu plains.',
      logistics_note: 'Departure 05:00 AM from base. Carry windcheater & sturdy trekking shoes.',
      image_url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
      destination: 'Munnar',
      is_selected: true
    },
    {
      id: 'act-munnar-02',
      title: 'Kolukkumalai Tea Factory & Tasting Safari',
      category: 'Estate',
      duration: '3.5 hours',
      rating: 4.8,
      price_per_person_inr: 950,
      description: 'Visit the world’s highest orthodox tea plantation by 4x4 Jeep. Experience vintage 1935 tea machinery and artisanal silver needle tastings.',
      logistics_note: 'Rugged jeep transit included. High altitude chill expected.',
      image_url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
      destination: 'Munnar',
      is_selected: true
    },
    {
      id: 'act-munnar-03',
      title: 'Lock Heart Gap Spices & Cardamom Trail',
      category: 'Nature',
      duration: '2.5 hours',
      rating: 4.7,
      price_per_person_inr: 650,
      description: 'A sensory walking journey across organic cardamom, clove, and cinnamon slopes guided by native botanists with fresh spice harvest samples.',
      logistics_note: 'Easy walking pace. Insect repellent recommended.',
      image_url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=600&q=80',
      destination: 'Munnar',
      is_selected: false
    },
    {
      id: 'act-munnar-04',
      title: 'Traditional Malabar Feast & Spiced Chai Tasting',
      category: 'Culinary',
      duration: '2 hours',
      rating: 4.9,
      price_per_person_inr: 750,
      description: 'Savor an authentic 14-dish Kerala banana leaf Sadhya featuring Appam, vegetable stew, and Munnar hill-grown spiced cardamom black tea.',
      logistics_note: 'Vegetarian and non-vegetarian options prepared fresh.',
      image_url: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&w=600&q=80',
      destination: 'Munnar',
      is_selected: true
    }
  ],
  Goa: [
    {
      id: 'act-goa-01',
      title: 'Fontainhas Latin Quarter Architectural Walk',
      category: 'Heritage',
      duration: '2.5 hours',
      rating: 4.8,
      price_per_person_inr: 750,
      description: 'Explore pastel Portuguese villas, tiled azulejos, and secret bakeries in Panjim’s centuries-old heritage quarter.',
      logistics_note: 'Walking shoes recommended. Hat & camera essential.',
      image_url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80',
      destination: 'Goa',
      is_selected: true
    },
    {
      id: 'act-goa-02',
      title: 'Chapora River Catamaran Sunset Sail',
      category: 'Nature',
      duration: '3 hours',
      rating: 4.9,
      price_per_person_inr: 1600,
      description: 'Sail through backwater mangroves where the river kisses the Arabian Sea, accompanied by curated Goan feni cocktails and acoustic music.',
      logistics_note: 'Departs 4:30 PM from Siolim Jetty. Life jackets provided.',
      image_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      destination: 'Goa',
      is_selected: true
    },
    {
      id: 'act-goa-03',
      title: 'Divar Island Electric Cycle Trail',
      category: 'Culture',
      duration: '3 hours',
      rating: 4.7,
      price_per_person_inr: 1200,
      description: 'Pedal across serene riverine paddy fields, ancient sluice gates, and quaint village chapels on high-torque electric bicycles.',
      logistics_note: 'Ferry ride from Old Goa included. E-bike and helmet supplied.',
      image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=600&q=80',
      destination: 'Goa',
      is_selected: false
    }
  ],
  Jaipur: [
    {
      id: 'act-jaipur-01',
      title: 'Amer Fort Early Morning Bastion Trek',
      category: 'Heritage',
      duration: '3.5 hours',
      rating: 4.9,
      price_per_person_inr: 950,
      description: 'Beat the desert heat with an exclusive dawn ascent up the Cheel ka Teela ridge overlooking Maota Lake and Sheesh Mahal.',
      logistics_note: 'Meet at 06:30 AM at Suraj Pol gate. Guide included.',
      image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=600&q=80',
      destination: 'Jaipur',
      is_selected: true
    },
    {
      id: 'act-jaipur-02',
      title: 'Old Walled City Spice & Street Food Odyssey',
      category: 'Culinary',
      duration: '2.5 hours',
      rating: 4.8,
      price_per_person_inr: 800,
      description: 'Taste iconic Pyaaz Kachori, creamy lassi in clay kulhads, and fragrant Ghewar in century-old Johari Bazaar sweet shops.',
      logistics_note: 'All food samplings included. Pure vegetarian trail.',
      image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=600&q=80',
      destination: 'Jaipur',
      is_selected: true
    },
    {
      id: 'act-jaipur-03',
      title: 'Bagru Natural Dabu & Block Print Masterclass',
      category: 'Culture',
      duration: '4 hours',
      rating: 4.8,
      price_per_person_inr: 1350,
      description: 'Hand-stamp your own organic cotton scarf using carved teakwood blocks, river mud resist, and deep natural indigo vats with Chipper craftsmen.',
      logistics_note: 'All craft materials and finished scarf to take home included.',
      image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
      destination: 'Jaipur',
      is_selected: false
    }
  ]
};

export function buildDefaultItinerary(
  destination: string,
  days: number,
  flight: TripFlight | null,
  hotel: TripHotel | null,
  activities: TripActivity[]
): ItineraryDay[] {
  const result: ItineraryDay[] = [];
  const destActivities = activities.length > 0 ? activities : (MOCK_ACTIVITIES_DATA[destination] || MOCK_ACTIVITIES_DATA['Munnar']);

  for (let d = 1; d <= days; d++) {
    const waypoints = [];
    if (d === 1) {
      if (flight) {
        waypoints.push({
          id: `wp-${d}-1`,
          day: d,
          time: flight.departure,
          title: `Flight: ${flight.airline} (${flight.flight_number})`,
          subtitle: `Depart ${flight.origin} → Arrive ${flight.destination} (${flight.duration})`,
          type: 'flight' as const,
          cost_inr: flight.price_inr,
          is_visited: true,
          logistics_note: 'Web check-in completed. Terminal gate opens 45m prior.'
        });
      }
      waypoints.push({
        id: `wp-${d}-2`,
        day: d,
        time: '12:30 PM',
        title: hotel ? `Check-in: ${hotel.name}` : `Arrive at Hotel in ${destination}`,
        subtitle: hotel ? hotel.location : 'Unpack and refresh before afternoon exploration',
        type: 'hotel' as const,
        cost_inr: hotel ? Math.round(hotel.total_price_inr / days) : 0,
        is_visited: true,
        logistics_note: 'Early check-in requested. Welcome beverage served.'
      });
      if (destActivities[0]) {
        waypoints.push({
          id: `wp-${d}-3`,
          day: d,
          time: '03:30 PM',
          title: destActivities[0].title,
          subtitle: `${destActivities[0].category} · ${destActivities[0].duration}`,
          type: 'activity' as const,
          cost_inr: destActivities[0].price_per_person_inr,
          is_visited: false,
          logistics_note: destActivities[0].logistics_note
        });
      }
      waypoints.push({
        id: `wp-${d}-4`,
        day: d,
        time: '08:00 PM',
        title: 'Authentic Regional Welcome Dinner',
        subtitle: `Local cuisine tasting and evening unwind in ${destination}`,
        type: 'meal' as const,
        cost_inr: 650,
        is_visited: false,
        logistics_note: 'Reserved courtyard table.'
      });
    } else if (d === 2) {
      if (destActivities[1]) {
        waypoints.push({
          id: `wp-${d}-1`,
          day: d,
          time: '06:00 AM',
          title: destActivities[1].title,
          subtitle: `${destActivities[1].category} · ${destActivities[1].duration}`,
          type: 'activity' as const,
          cost_inr: destActivities[1].price_per_person_inr,
          is_visited: false,
          logistics_note: destActivities[1].logistics_note
        });
      }
      waypoints.push({
        id: `wp-${d}-2`,
        day: d,
        time: '10:30 AM',
        title: 'Fresh Organic Breakfast & Valley Coffee',
        subtitle: 'Artisanal farm-to-table breakfast spread',
        type: 'meal' as const,
        cost_inr: 350,
        is_visited: false,
        logistics_note: 'Complimentary with resort stay'
      });
      if (destActivities[2]) {
        waypoints.push({
          id: `wp-${d}-3`,
          day: d,
          time: '03:00 PM',
          title: destActivities[2].title,
          subtitle: `${destActivities[2].category} · ${destActivities[2].duration}`,
          type: 'activity' as const,
          cost_inr: destActivities[2].price_per_person_inr,
          is_visited: false,
          logistics_note: destActivities[2].logistics_note
        });
      } else {
        waypoints.push({
          id: `wp-${d}-3`,
          day: d,
          time: '04:00 PM',
          title: 'Sunset Viewpoint & Landscape Photography',
          subtitle: 'Panoramic mountain ridge photography spot',
          type: 'activity' as const,
          cost_inr: 200,
          is_visited: false,
          logistics_note: 'Prime golden hour light between 5:15 PM and 6:00 PM.'
        });
      }
    } else {
      waypoints.push({
        id: `wp-${d}-1`,
        day: d,
        time: '08:30 AM',
        title: 'Local Artisan Market & Souvenir Shopping',
        subtitle: 'Tea leaves, whole spices, handmade essential oils',
        type: 'activity' as const,
        cost_inr: 500,
        is_visited: false,
        logistics_note: 'Recommended vendors provide vacuum sealed travel packs.'
      });
      waypoints.push({
        id: `wp-${d}-2`,
        day: d,
        time: '11:30 AM',
        title: hotel ? `Check-out: ${hotel.name}` : `Check-out & Luggage Storage`,
        subtitle: 'Settle ancillary bills and board airport shuttle',
        type: 'hotel' as const,
        cost_inr: 0,
        is_visited: false,
        logistics_note: 'Express luggage check. Transport arrives 12:00 PM.'
      });
      waypoints.push({
        id: `wp-${d}-3`,
        day: d,
        time: '05:30 PM',
        title: `Return Transit & Flight: ${destination} → Home`,
        subtitle: 'Scenic drive to airport terminal and flight boarding',
        type: 'transit' as const,
        cost_inr: 850,
        is_visited: false,
        logistics_note: 'Arrival at airport 2h prior to domestic departure.'
      });
    }

    result.push({
      day: d,
      date_str: `Day ${d}`,
      theme: d === 1 ? 'Arrival & Cloud Sanctuary' : d === 2 ? 'Peaks, Plantations & Wild Flavors' : 'Slow Morning & Golden Hour Return',
      waypoints
    });
  }

  return result;
}

export function createCanonicalTrip(
  destination: string = 'Munnar',
  days: number = 3,
  budgetTotalInr: number = 30000,
  userId: string = 'usr-default'
): CanonicalTrip {
  const normDest = destination.toLowerCase().includes('goa')
    ? 'Goa'
    : destination.toLowerCase().includes('jaipur')
    ? 'Jaipur'
    : 'Munnar';

  const flight = MOCK_FLIGHTS_DATA[normDest]?.[0] || MOCK_FLIGHTS_DATA['Munnar'][0];
  const hotel = MOCK_HOTELS_DATA[normDest]?.[0] || MOCK_HOTELS_DATA['Munnar'][0];
  const activities = (MOCK_ACTIVITIES_DATA[normDest] || MOCK_ACTIVITIES_DATA['Munnar']).filter(a => a.is_selected);
  const itinerary = buildDefaultItinerary(normDest, days, flight, hotel, activities);

  return {
    id: `trip-${Date.now().toString(36)}`,
    user_id: userId,
    title: `${days} Days in ${normDest} Escape`,
    destination: normDest,
    origin: 'BLR',
    days,
    dates: 'Nov 14 - Nov 17, 2026',
    status: 'configuring',
    budget_total_inr: budgetTotalInr,
    travellers: 2,
    selected_flight: flight,
    selected_hotel: hotel,
    selected_activities: activities,
    itinerary_days: itinerary,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}
