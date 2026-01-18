// Curated locations dataset for country-only queries and instant suggestions

export const countrySynonyms = {
  ae: ['ae', 'uae', 'u.a.e', 'united arab emirates'],
  eg: ['eg', 'egypt', 'u.a.r', 'uar'],
  sa: ['sa', 'ksa', 'k.s.a', 'kingdom of saudi arabia', 'saudi arabia'],
  gb: ['gb', 'uk', 'u.k', 'united kingdom', 'great britain'],
  us: ['us', 'usa', 'u.s', 'u.s.a', 'united states', 'united states of america'],
}

export const curatedCitySeeds = {
  AE: ['dubai', 'abu dhabi', 'sharjah'],
  EG: ['cairo', 'alexandria', 'hurghada', 'sharm'],
  SA: ['riyadh', 'jeddah', 'dammam', 'medina', 'mecca'],
}

export const curatedAirports = {
  AE: [
    { code: 'DXB', name: 'Dubai International', city: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', type: 'AIRPORT' },
    { code: 'DWC', name: 'Al Maktoum International (Dubai World Central)', city: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', type: 'AIRPORT' },
    { code: 'AUH', name: 'Abu Dhabi International', city: 'Abu Dhabi', country: 'United Arab Emirates', countryCode: 'AE', type: 'AIRPORT' },
    { code: 'SHJ', name: 'Sharjah International', city: 'Sharjah', country: 'United Arab Emirates', countryCode: 'AE', type: 'AIRPORT' },
    { code: 'RKT', name: 'Ras Al Khaimah International', city: 'Ras Al Khaimah', country: 'United Arab Emirates', countryCode: 'AE', type: 'AIRPORT' },
    { code: 'AAN', name: 'Al Ain International', city: 'Al Ain', country: 'United Arab Emirates', countryCode: 'AE', type: 'AIRPORT' },
    { code: 'FJR', name: 'Fujairah International', city: 'Fujairah', country: 'United Arab Emirates', countryCode: 'AE', type: 'AIRPORT' },
  ],
  EG: [
    { code: 'CAI', name: 'Cairo International', city: 'Cairo', country: 'Egypt', countryCode: 'EG', type: 'AIRPORT' },
    { code: 'HRG', name: 'Hurghada International', city: 'Hurghada', country: 'Egypt', countryCode: 'EG', type: 'AIRPORT' },
    { code: 'SSH', name: 'Sharm el-Sheikh International', city: 'Sharm el-Sheikh', country: 'Egypt', countryCode: 'EG', type: 'AIRPORT' },
    { code: 'ALY', name: 'Alexandria (El Nouzha/Intl)', city: 'Alexandria', country: 'Egypt', countryCode: 'EG', type: 'AIRPORT' },
    { code: 'HBE', name: 'Borg El Arab', city: 'Alexandria', country: 'Egypt', countryCode: 'EG', type: 'AIRPORT' },
    { code: 'LXR', name: 'Luxor International', city: 'Luxor', country: 'Egypt', countryCode: 'EG', type: 'AIRPORT' },
    { code: 'ASW', name: 'Aswan International', city: 'Aswan', country: 'Egypt', countryCode: 'EG', type: 'AIRPORT' },
  ],
  SA: [
    { code: 'RUH', name: 'King Khalid International', city: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA', type: 'AIRPORT' },
    { code: 'JED', name: 'King Abdulaziz International', city: 'Jeddah', country: 'Saudi Arabia', countryCode: 'SA', type: 'AIRPORT' },
    { code: 'DMM', name: 'King Fahd International', city: 'Dammam', country: 'Saudi Arabia', countryCode: 'SA', type: 'AIRPORT' },
    { code: 'MED', name: 'Prince Mohammad bin Abdulaziz', city: 'Medina', country: 'Saudi Arabia', countryCode: 'SA', type: 'AIRPORT' },
    { code: 'AHB', name: 'Abha International', city: 'Abha', country: 'Saudi Arabia', countryCode: 'SA', type: 'AIRPORT' },
    { code: 'GIZ', name: 'Jazan (King Abdullah Bin Abdulaziz)', city: 'Jazan', country: 'Saudi Arabia', countryCode: 'SA', type: 'AIRPORT' },
    { code: 'TIF', name: 'Taif Regional', city: 'Taif', country: 'Saudi Arabia', countryCode: 'SA', type: 'AIRPORT' },
  ],
}
