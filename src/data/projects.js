// src/data/projects.js
const projects = [
  {
    id: "soa",
    title: "SOA",
    subtitle: "Service-Oriented Architecture Project",
    description: "Enterprise-grade SOA system with microservices.",
    highlights: ["Microservices", "API Gateway", "Load Balancing"],
    stack: ["Spring Boot", "Docker", "Kafka"],
    image: "/images/projects/soa.jpg",
    gradient: "from-blue-500 to-indigo-500",
    github: "",
    live: "",
    stats: { uptime: "99%", users: "1000+" },
  },
  {
    id: "bus-management",
    title: "Django Bus Management Project",
    subtitle: "Transport Management System",
    description:
      "Complete bus ticketing, route management, and scheduling system built with Django.",
    highlights: [
      "Real-time seat availability",
      "Admin dashboard",
      "Route optimization",
    ],
    stack: ["Django", "PostgreSQL", "Bootstrap"],
    image: "/images/projects/bus-management.jpg",
    gradient: "from-green-500 to-teal-500",
    github: "",
    live: "",
    stats: { buses: "25", routes: "12", users: "500+" },
  },
  {
    id: "weatherglobe",
    title: "WeatherGlobe — 3D Earth Hub",
    subtitle: "Interactive 3D · Educational Platform",
    description: "Cinematic 3D globe application combining live weather visualization with gamified geography learning.",
    highlights: ["3D Earth Visualization", "GeoQuiz Pro", "Real-time Weather"],
    stack: ["Angular 20", "Three.js", "Globe.gl"],
    image: "/src/assets/weatherapp.png",
    gradient: "from-blue-900 to-black",
    github: "https://github.com/DIVAKAR-0110/WEATHER-GLOBE",
    live: "https://weather-globe-gamma.vercel.app/",
    stats: { Accuracy: "Live", Engine: "Three.js" },
  },
];

export default projects;