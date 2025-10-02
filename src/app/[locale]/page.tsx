import About from "@/components/layout/About";
import Contact from "@/components/layout/Contact";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import Hero from "@/components/layout/Hero";
import ProfessionalExperience from "@/components/layout/ProfessionalExperience";
import Projects from "@/components/layout/Projects";
import Skills from "@/components/layout/Skills";

export default function Home() {
	return (
		<>
			<Header />
			<div className="min-h-screen bg-gray-800">
				<div id="#">
					<Hero />
				</div>
				<div id="about" className="py-8 xl:py-12">
					<About />
				</div>
				<div id="skills" className="py-8 xl:py-12">
					<Skills />
				</div>
				<div id="experience" className="py-8 xl:py-12">
					<ProfessionalExperience />
				</div>
				<div id="projects" className="py-8 xl:py-12">
					<Projects />
				</div>
				<div id="contact" className="py-8 xl:py-12">
					<Contact />
				</div>
			</div>
			<Footer />
		</>
	);
}
