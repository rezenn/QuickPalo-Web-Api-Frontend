import building1 from "@/app/assets/images/hospitalFeatures.jpg";
import { StaticImageData } from "next/image";

export interface OrganizationCard {
  id: number;
  title: string;
  slug: string;
  image: string | StaticImageData;
  location: string;
  time: string;
  description: string;
  departments: string[];
  timeSlots: string[];
}

export const OrganizationsData: OrganizationCard[] = [
  {
    id: 1,
    title: "City Health Center",
    slug: "City-Health-Center",
    image: building1,
    location: "Thamel, Kathmandu",
    time: "7:00 - 19:00",
    description:
      "Primary care center offering outpatient services and emergency care.",
    departments: [
      "Dermatology",
      "ENT ",
      "Cardiology",
      "Gastroenterology",
      "Pediatrics",
      "Rehab",
      "Pathology",
    ],
    timeSlots: ["9:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00"],
  },
  {
    id: 2,
    title: "Everest College",
    slug: "Everest-College",
    image: building1,
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
    id: 3,
    title: "Government Office",
    slug: "Government-Office",
    image: building1,
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
    id: 4,
    title: "RKM Hospital",
    slug: "RKM-Hospital",
    image: building1,
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
    id: 5,
    title: "GSK Hospital",
    slug: "gsk-hospital",
    image: building1,
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
    id: 6,
    title: "Global Medical Center",
    slug: "Global-Medical-Center",
    image: building1,
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
    image: building1,
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
    image: building1,
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
    image: building1,
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
