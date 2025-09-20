import React from 'react'
import { Link } from 'react-router'

const Navbar = () => {
  return (
    <nav className="navbar">
        <Link to="/">
        <p className="text-xl font-medium"><span className="text-indigo-600 font-bold">ScanMe </span>AI</p>
        </Link>
        <Link to="/upload" className="primary-button w-fit">Upload Resume</Link>
    </nav>
  )
}

export default Navbar