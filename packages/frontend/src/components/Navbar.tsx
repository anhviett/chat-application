import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <>
            <Link to="/about">
                About
            </Link>
            <Link to="/contact">
                Contact Us
            </Link>
            <Link to="/blogs">
                Blogs
            </Link>
            <Link to="/sign-up">
                Sign Up
            </Link>
        </>
    );
};
export default Navbar