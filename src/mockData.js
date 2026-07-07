// Mock database for CAR BAZAR Driver Portal

export const mockDriver = {
  id: "DRV001",
  name: "Alexander Pierce",
  email: "alex.pierce@carbazar.com",
  mobile: "+1 (555) 019-9234",
  address: "742 Evergreen Terrace, Springfield",
  aadhaar: "4820-3948-1029",
  license: "DL-9876543210-XYZ",
  photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
  password: "password123"
};

export const mockCar = {
  carNumber: "CB-09-TX-4502",
  brand: "Toyota",
  model: "Camry Hybrid",
  type: "Premium Sedan",
  fuelType: "Petrol / Hybrid",
  seatCapacity: "5 Seater",
  status: "Active & Insured"
};

export const initialTrips = [
  {
    id: "BK-9021",
    customerName: "Sarah Connor",
    customerMobile: "+1 (555) 234-5678",
    pickup: "JFK Airport Terminal 4",
    drop: "Manhattan Midtown Hilton",
    date: "2026-07-06",
    time: "18:30",
    car: "Toyota Camry Hybrid (CB-09-TX-4502)",
    status: "Upcoming" // Upcoming, Ongoing, Completed
  },
  {
    id: "BK-9022",
    customerName: "Bruce Wayne",
    customerMobile: "+1 (555) 987-6543",
    pickup: "Gotham Plaza Tower",
    drop: "Airport Pickup Terminal 1",
    date: "2026-07-06",
    time: "20:45",
    car: "Toyota Camry Hybrid (CB-09-TX-4502)",
    status: "Upcoming"
  },
  {
    id: "BK-8901",
    customerName: "Clark Kent",
    customerMobile: "+1 (555) 456-7890",
    pickup: "Daily Planet Offices",
    drop: "Metropolis Airport Drop",
    date: "2026-07-06",
    time: "10:15",
    car: "Toyota Camry Hybrid (CB-09-TX-4502)",
    status: "Completed"
  },
  {
    id: "BK-8902",
    customerName: "Diana Prince",
    customerMobile: "+1 (555) 890-1234",
    pickup: "Louvre Museum Annex",
    drop: "Parisian Embassy",
    date: "2026-07-05",
    time: "14:00",
    car: "Toyota Camry Hybrid (CB-09-TX-4502)",
    status: "Completed"
  },
  {
    id: "BK-8850",
    customerName: "Tony Stark",
    customerMobile: "+1 (555) 321-4321",
    pickup: "Stark Tower Executive Pad",
    drop: "Long Island Private Airfield",
    date: "2026-07-04",
    time: "09:00",
    car: "Toyota Camry Hybrid (CB-09-TX-4502)",
    status: "Completed"
  }
];

export const initialNotifications = [
  {
    id: "NT-101",
    type: "new_trip",
    message: "New Trip Assigned: Booking BK-9022 from Gotham Plaza Tower.",
    time: "10 mins ago",
    read: false
  },
  {
    id: "NT-102",
    type: "system",
    message: "System Maintenance: The driver portal will undergo scheduled maintenance on Sunday from 02:00 AM to 04:00 AM.",
    time: "2 hours ago",
    read: false
  },
  {
    id: "NT-103",
    type: "update",
    message: "Booking BK-9021 customer modified contact number.",
    time: "5 hours ago",
    read: true
  },
  {
    id: "NT-104",
    type: "cancel",
    message: "Trip Cancelled: Booking BK-8742 was cancelled by admin.",
    time: "1 day ago",
    read: true
  }
];
