import { Link, useLocation } from "react-router-dom";
import "./Breadcrumbs.css";

// Map of route segments to clean labels
const routeLabels = {
  cart: "Shopping Cart",
  categories: "Categories",
  products: "Products",
  wishlist: "My Wishlist",
  profile: "My Profile",
  orders: "My Orders",
  "address-book": "Address Book",
  terms: "Terms & Conditions",
  faq: "FAQ",
  privacy: "Privacy Policy",
  returns: "Returns & Refunds",
  dashboard: "Dashboard",
  brands: "Brands",
  customers: "Customers",
  reports: "Reports",
  settings: "Settings",
  create: "Add New",
  edit: "Edit",
};

function Breadcrumbs({ productName = "" }) {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Don't show breadcrumbs on Home page or root admin route
  if (pathnames.length === 0 || (pathnames.length === 1 && pathnames[0] === "admin")) return null;

  const isAdmin = pathnames[0] === "admin";
  const displayPathnames = isAdmin ? pathnames.slice(1) : pathnames;

  return (
    <div className="breadcrumbs-wrapper">
      <nav className="breadcrumbs-container" aria-label="breadcrumb">
        <ul className="breadcrumbs-list">
          <li className="breadcrumbs-item">
            <Link 
              to={isAdmin ? "/admin/dashboard" : "/"} 
              className="breadcrumbs-link breadcrumbs-home"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {isAdmin ? (
                  <>
                    <rect x="3" y="3" width="7" height="9" />
                    <rect x="14" y="3" width="7" height="5" />
                    <rect x="14" y="12" width="7" height="9" />
                    <rect x="3" y="16" width="7" height="5" />
                  </>
                ) : (
                  <>
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </>
                )}
              </svg>
              <span>{isAdmin ? "Admin" : "Home"}</span>
            </Link>
          </li>

          {displayPathnames.map((value, index) => {
            const last = index === displayPathnames.length - 1;
            let to = isAdmin
              ? `/admin/${displayPathnames.slice(0, index + 1).join("/")}`
              : `/${pathnames.slice(0, index + 1).join("/")}`;

            // Route correction for singular/plural differences
            if (!isAdmin) {
              if (value === "product") {
                to = "/products";
              } else if (value === "category") {
                to = "/categories";
              }
            }

            // Resolve dynamic label
            let label = routeLabels[value] || value;

            // Handle dynamic IDs in admin (e.g., product, order, customer)
            if (isAdmin && !isNaN(value)) {
              if (productName && last) {
                label = productName;
              } else {
                label = `#${value}`;
              }
            }

            // Handle product detail page dynamic label in customer routes
            if (!isAdmin) {
              if (pathnames[0] === "product" && last && productName) {
                label = productName;
              } else if (pathnames[0] === "product" && !last && value === "product") {
                label = "Products";
              }

              // Handle category products page dynamic label in customer routes
              if (pathnames[0] === "category" && last) {
                label = value.replace(/-/g, " ");
              } else if (pathnames[0] === "category" && !last && value === "category") {
                label = "Categories";
              }
            }

            // Capitalize label if not already mapped
            if (!routeLabels[value] && value !== "product" && value !== "category") {
              label = label.charAt(0).toUpperCase() + label.slice(1);
            }

            return (
              <li key={to} className="breadcrumbs-item">
                <span className="breadcrumbs-separator">/</span>
                {last ? (
                  <span className="breadcrumbs-current" aria-current="page">
                    {label}
                  </span>
                ) : (
                  <Link to={to} className="breadcrumbs-link">
                    {label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}

export default Breadcrumbs;
