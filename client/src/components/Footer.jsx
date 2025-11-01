import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter signup attempt:", email);
    alert(`Thank you for subscribing, ${email}!`);
    setEmail("");
  };

  const FooterLink = ({ to, children }) => (
    <li>
      <Link
        to={to}
        className="text-sm text-gray-300 hover:text-[#16a34a] transition-all duration-300 hover:translate-x-1"
      >
        {children}
      </Link>
    </li>
  );

  return (
    <footer className="bg-gradient-to-br from-[#0b1f17] via-[#15322d] to-[#128c43] text-white w-full mt-auto shadow-lg shadow-green-900/20 transition-all duration-500">
       <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
    {/* About Section */}
    <div>
      <h3 className="text-lg font-semibold mb-3">About ArcShelf</h3>
      <p className="text-sm text-gray-100 leading-relaxed">
        ArcShelf is your one-stop platform for accessing and sharing previous
        year university and college question papers. Empowering students through
        open academic resources and collaboration.
      </p>
    </div>

    {/* Quick Links */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
      <ul className="space-y-2 text-sm">
        <li>
          <a href="/" className="hover:underline hover:text-gray-200 transition">
            Home
          </a>
        </li>
        <li>
          <a
            href="/upload"
            className="hover:underline hover:text-gray-200 transition"
          >
            Upload Paper
          </a>
        </li>
        <li>
          <a
            href="/colleges"
            className="hover:underline hover:text-gray-200 transition"
          >
            Browse Colleges
          </a>
        </li>
        <li>
          <a
            href="/about"
            className="hover:underline hover:text-gray-200 transition"
          >
            About Us
          </a>
        </li>
      </ul>
    </div>

    {/* Contact Section */}
    <div>
      <h3 className="text-lg font-semibold mb-3">Contact</h3>
      <p className="text-sm text-gray-100 mb-2">
        Have a suggestion or question? We’d love to hear from you.
      </p>
      <p className="text-sm">
        <a
          href="mailto:contact@arcshelf.com"
          className="text-white font-medium hover:underline"
        >
          contact@arcshelf.com
        </a>
      </p>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="border-t border-green-700 text-center py-4 text-sm text-gray-200">
    © {new Date().getFullYear()} <span className="font-semibold">ArcShelf</span>.
    Built with 💚 for learners by learners.
  </div>
    </footer>
  );
}
