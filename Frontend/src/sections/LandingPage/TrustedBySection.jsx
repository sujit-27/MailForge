import { motion } from "framer-motion";
import logo1 from "../../../attached_assets/stock_images/minimal_tech_company_07cad68e.jpg";
import logo2 from "../../../attached_assets/stock_images/minimal_tech_company_119ba563.jpg";
import logo3 from "../../../attached_assets/stock_images/minimal_tech_company_e66b3bdf.jpg";
import logo4 from "../../../attached_assets/stock_images/minimal_tech_company_5b99f7c8.jpg";
import logo5 from "../../../attached_assets/stock_images/minimal_tech_company_3865193c.jpg";
import logo6 from "../../../attached_assets/stock_images/minimal_tech_company_7379f4c4.jpg";

import appwrite from "../../assets/TechLogos/appwrite.png";
import github from "../../assets/TechLogos/github.png";
import nextjs from "../../assets/TechLogos/nextJs.png";
import nodejs from "../../assets/TechLogos/nodejs.png";
import python from "../../assets/TechLogos/python.png";
import expressJs from "../../assets/TechLogos/ExpressJs.png";
import springboot from "../../assets/TechLogos/spring.png";
import typescript from "../../assets/TechLogos/typescript.png";
import react from "../../assets/TechLogos/reactJs.png";
import javascript from "../../assets/TechLogos/javascript.png";
import graphql from "../../assets/TechLogos/GraphQL.png";
import django from "../../assets/TechLogos/django.png";
import aws from "../../assets/TechLogos/aws.png";


const companies = [
  { name: "Company 1", logo: logo1 },
  { name: "Company 2", logo: logo2 },
  { name: "Company 3", logo: logo3 },
  { name: "Company 4", logo: logo4 },
  { name: "Company 5", logo: logo5 },
  { name: "Company 6", logo: logo6 },
];

const techStacks = [
  {
    name: "React",
    logo: react,
  },
  {
    name: "Next.js",
    logo: nextjs,
  },
  {
    name: "Node.js",
    logo: nodejs,
  },
  {
    name: "Spring Boot",
    logo: springboot,
  },
  {
    name: "JavaScript",
    logo: javascript,
  },
  {
    name: "TypeScript",
    logo: typescript,
  },
  {
    name: "Express.js",
    logo: expressJs,
  },
  {
    name: "Appwrite",
    logo: appwrite,
  },
  {
    name: "AWS",
    logo: aws,
  },
  {
    name: "GitHub Actions",
    logo: github,
  },
  {
    name: "GraphQL",
    logo: graphql,
  },
  {
    name: "Python",
    logo: python,
  },
  {
    name: "Django",
    logo: django,
  },
];


// Duplicate for seamless infinite animation
const scrollingCompanies = [...companies, ...companies];
const scrollingTechs = [...techStacks, ...techStacks];

export default function TrustedBySection() {
  return (
    <section className="py-20 border-t border-border overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 text-center mb-12">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-sm font-semibold text-muted-foreground uppercase tracking-wide"
        >
          Trusted by industry leaders
        </motion.h2>
      </div>

      {/* Company Logos Row */}
      <div className="relative w-[85%] mx-auto overflow-hidden mb-20">
        <motion.div
          className="flex gap-12 items-center"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {scrollingCompanies.map((company, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 1.1 }}
              className="flex-shrink-0"
            >
              <img
                src={company.logo}
                alt={company.name}
                className="w-32 h-16 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 cursor-pointer"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Tech Stack Logos Row (No Heading) */}
      <div className="relative w-[65%] mx-auto overflow-hidden">
        <motion.div
          className="flex gap-12 items-center"
          animate={{ x: ["-50%", "0%"] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {scrollingTechs.map((tech, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 1.1 }}
              className="flex-shrink-0"
            >
              <img
                src={tech.logo}
                alt={tech.name}
                className="w-20 h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100 cursor-pointer"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
