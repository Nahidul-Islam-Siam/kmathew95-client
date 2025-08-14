import Link from "next/link"
import Image from "next/image"
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react"

const footerLinks = {
  about: [
    { name: "Trade", href: "/all-traders" },
    { name: "Services", href: "/all-services" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-conditions" },
  ],
  categories: [
    { name: "Graphics & Design", href: "#" },
    { name: "Digital Marketing", href: "#" },
    { name: "Writing & Translation", href: "#" },
    { name: "Video & Animation", href: "#" },
    { name: "Music & Audio", href: "#" },
  ],
  support: [
    { name: "Help & Support", href: "/contact-us" },
    { name: "Trust & Safety", href: "/trust-safety" },
    { name: "FAQ", href: "/faq" },
    { name: "Contact Us", href: "/contact-us" },
  ],
  legal: [
    { name: "Terms", href: "/terms-conditions" },
    { name: "Privacy", href: "/privacy-policy" },
  ],
}

export default function Footer() {
  return (
    <footer className="w-full bg-[#1C2A47] text-white py-12 md:py-16 font-dm font-dm md:rounded-tr-[60px] rounded-tr-[40px]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Top: Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-12">
          {/* About */}
          <FooterColumn  title="About" >
            {footerLinks.about.map((item, i) => (
              <FooterLink key={i} href={item.href} className="!font-medium !md:text-base text-[#FFFFFFB2]">{item.name}</FooterLink>
            ))}
          </FooterColumn>

          {/* Categories */}
          <FooterColumn title="Categories">
            {footerLinks.categories.map((item, i) => (
              <FooterLink key={i} href={item.href} className="!font-medium !md:text-base text-[#FFFFFFB2]">{item.name}</FooterLink>
            ))}
            <FooterLink href="#" className="font-medium border-b border-gray-400 text-[#FFFFFFB2]">View More</FooterLink>
          </FooterColumn>

          {/* Support & Payment */}
          <div>
            <FooterColumn  title="Support">
              {footerLinks.support.map((item, i) => (
                <FooterLink key={i} href={item.href} className="!font-medium !md:text-base text-[#FFFFFFB2]">{item.name}</FooterLink>
              ))}
            </FooterColumn>
            
            <h5 className="text-lg font-semibold text-gray-400 mb-4 mt-6">Payment</h5>
            <div className="flex items-center gap-4">
              <Image src="/images/stripe-logo.png" alt="Stripe" width={60} height={24} className=" hover:grayscale transition-all duration-300" />
              <Image src="/images/paypal-logo.png" alt="PayPal" width={60} height={24} className=" hover:grayscale transition-all duration-300" />
            </div>
          </div>

          {/* Follow Us */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
            <p className="text-sm text-gray-400 mb-4 max-w-xs">
              Stay connected through our social media channels for updates and insights.
            </p>
            <SocialLinks />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
          <div className="flex flex-wrap items-center gap-4 text-center md:text-left">
            <span>© {new Date().getFullYear()} SkillSwitch. All rights reserved.</span>
            {footerLinks.legal.map((item, i) => (
              <FooterLink key={i} href={item.href}>{item.name}</FooterLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <span className="font-medium text-white">Social</span>
            <SocialLinks />
          </div>
        </div>
      </div>
    </footer>
  )
}

// Reusable Components
function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="md:text-[17px] font-semibold text-white  mb-4">{title}</h4>
      <ul className="space-y-3">{children}</ul>
    </div>
  )
}

function FooterLink({ 
  href, 
  children, 
  className = "" 
}: { 
  href: string; 
  children: React.ReactNode; 
  className?: string; 
}) {
  return (
    <li>
      <Link 
        href={href} 
        className={`hover:text-white transition-all duration-300 hover:underline ${className}`}
      >
        {children}
      </Link>
    </li>
  )
}

function SocialLinks() {
  const socialItems = [
    { icon: Facebook, label: "Facebook", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Instagram, label: "Instagram", href: "#" },
    { icon: Linkedin, label: "LinkedIn", href: "#" },
  ]

  return (
    <div className="flex gap-4">
      {socialItems.map((item, i) => (
        <Link
          key={i}
          href={item.href}
          aria-label={item.label}
          className="text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
        >
          <item.icon className="w-5 h-5" />
        </Link>
      ))}
    </div>
  )
}