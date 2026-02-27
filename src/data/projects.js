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
  // Add other projects here...
];

export default projects;