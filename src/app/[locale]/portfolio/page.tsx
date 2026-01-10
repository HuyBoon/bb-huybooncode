import { auth } from "@/auth";
import About from "@/components/layout/About";
import Contact from "@/components/layout/Contact";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/layout/Hero";
import PortfolioHeader from "@/components/layout/PortfolioHeader";
import ProfessionalExperience from "@/components/layout/ProfessionalExperience";
import Projects from "@/components/layout/Projects";
import Skills from "@/components/layout/Skills";

export default async function Home() {
    const session = await auth();

    return (
        <>
            <PortfolioHeader session={session} />

            <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
                <div id="#">
                    <Hero />
                </div>
                <div id="about" className="py-8 xl:py-12 bg-muted/30">
                    <About />
                </div>
                <div id="skills" className="py-8 xl:py-12">
                    <Skills />
                </div>
                <div id="experience" className="py-8 xl:py-12 bg-muted/30">
                    <ProfessionalExperience />
                </div>
                <div id="projects" className="py-8 xl:py-12">
                    <Projects />
                </div>
                <div id="contact" className="py-8 xl:py-12 bg-muted/30">
                    <Contact />
                </div>
            </div>
            <Footer />
        </>
    );
}
