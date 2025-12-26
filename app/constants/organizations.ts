export interface OrganizationCard {
  id: number;
  title: string;
  slug: string;
  image: string;
  location: string;
  time: string;
  description: string;
  departments: string[];
  timeSlots: string[];
}

export const OrganizationsData: OrganizationCard[] = [
  {
    id: 1,
    title: "RKM Hospital",
    slug: "RKM-Hospital",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRpiIGm_Z3u8IHIIqMsPBpwU8qwiYyelbFvHw&s",
    location: "Kantipath, Kathmandu",
    time: "8:00 - 20:00",
    description:
      "A non-profit institution prioritizing community health, maternal care and chronic illness prevention.",
    departments: [
      "Gynecology",
      "Orthopedics",
      "Pediatrics",
      "Cardiology",
      "Pathology",
      "Radiology",
    ],
    timeSlots: [
      "8:00 - 9:00",
      "9:00 - 10:00",
      "10:00 - 11:00",
      "11:00 - 12:00",
    ],
  },
  {
    id: 2,
    title: "GSK Hospital",
    slug: "gsk-hospital",
    image:
      "https://www.shutterstock.com/shutterstock/photos/212251981/display_1500/stock-photo-modern-hospital-style-building-212251981.jpg",
    location: "Kainali, Kainali",
    time: "8:00 - 16:00",
    description: "Top ranked elite medical university with global faculty.",
    departments: [
      "Pharmacy",
      "Oncology",
      "Psychiatry",
      "Administrative",
      "Maternity",
      "Neurology",
    ],
    timeSlots: ["8:00-9:00", "9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00"],
  },
  {
    id: 3,
    title: "City Health Center",
    slug: "City-Health-Center",
    image:
      "https://www.brockport.edu/live/image/gid/154/width/990/height/552/crop/1/src_region/0,147,3200,1931/11625_health_center_exterior19-2.jpg",
    location: "Thamel, Kathmandu",
    time: "7:00 - 19:00",
    description:
      "Primary care center offering outpatient services and emergency care.",
    departments: [
      "Dermatology",
      "ENT ",
      "Gastroenterology",
      "Rehab",
      "Pathology",
    ],
    timeSlots: ["9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00"],
  },
  {
    id: 4,
    title: "Everest College",
    slug: "Everest-College",
    image:
      "https://media.edusanjal.com/__sized__/cover_photo/eebs-building-thumbnail-1400x280-70.jpg",
    location: "Patan, Lalitpur",
    time: "9:00 - 17:00",
    description:
      "Leading educational institution offering undergraduate and postgraduate courses.",
    departments: [
      "faculty Office",
      "Architecture",
      "Engineering",
      "Arts",
      "BCA",
      "BBA",
      "Medicine",
    ],
    timeSlots: ["9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00"],
  },
  {
    id: 5,
    title: "Government Office",
    slug: "Government-Office",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSATjnnZVre_SaYbVXf-8-KSP-L2_NouAhAYA&s",
    location: "Singha Durbar, Kathmandu",
    time: "10:00 - 16:00",
    description:
      "Government office providing public services and administrative support.",
    departments: [
      "Tax Consultation",
      "Public Records",
      "Business Registration",
      "Civil Registration",
      "Social Welfare",
      "Property Registration",
    ],
    timeSlots: ["9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00"],
  },
  {
    id: 6,
    title: "Global Medical Center",
    slug: "Global-Medical-Center",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYxXnrIIYDkxjUkQagL5VGX4uCboVHg2YA98GqM4P3YkCs1AhYsdpn2PeIiXrnlqOFh6k&usqp=CAU",
    location: "Jhamsikhel, Lalitpur",
    time: "8:00 - 22:00",
    description:
      "State-of-the-art facility offering specialized treatments and surgeries.",
    departments: ["Radiology", "Pediatrics", "Dermatology", "Psychiatry"],
    timeSlots: ["9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00"],
  },
  {
    id: 7,
    title: "Kathmandu University",
    slug: "Kathmandu-University",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwzCyPVDKe6S4Lh-J5LTAe0_WC2ZyFxBGneeCt8NL8lzG0flevqE222SewFeFpWc9x9As&usqp=CAU",
    location: "Dhulikhel, Kavrepalanchok",
    time: "8:30 - 16:30",
    description:
      "Prestigious university offering programs in engineering, medicine, and arts.",
    departments: [
      "Admissions",
      "Architecture",
      "Medicine",
      "Arts",
      "Business",
      "Engineering",
    ],

    timeSlots: ["9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00"],
  },
  {
    id: 8,
    title: "Shanti Health Center",
    slug: "Shanti-Health-Center",
    image:
      "https://media.istockphoto.com/id/157677909/photo/nurse-or-doctor-pushing-a-wheelchair-outdoors.jpg?s=612x612&w=0&k=20&c=t2H7lO8cuQ1pCeFJYk-on-G2J6AVujKnhF72yK_t0zM=",
    location: "Kuleshwor, Kathmandu",
    time: "24 hours",
    description:
      "Well-known private nursing home with general and maternity wards.",
    departments: ["Pathology", "ENT", "Pediatrics"],
    timeSlots: ["9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00"],
  },
  {
    id: 9,
    title: "National College of Science",
    slug: "National-College-of-Science",
    image:
      "https://cdn.sanity.io/images/p2ba9zey/production/21bf7be80600541954415f5365f583df79d8b7be-3346x1530.jpg",
    location: "Jawalakhel, Lalitpur",
    time: "9:00 - 18:00",
    description:
      "Specializes in science and technology programs for undergraduate students.",
    departments: [
      "Computer Science",
      "Architecture",
      "Civil",
      "Software Engineering",
      "MBBS",
      "Bsc Biology",
    ],
    timeSlots: ["9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00"],
  },
];
