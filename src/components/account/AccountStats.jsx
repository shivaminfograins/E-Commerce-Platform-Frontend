import { Link } from "react-router-dom";

function AccountStats({ cartCount = 0, wishlistCount = 0, ordersCount = 0, addressesCount = 0 }) {
  const stats = [
    {
      title: "Orders",
      value: ordersCount.toString(),
      path: "/orders"
    },
    {
      title: "Wishlist",
      value: wishlistCount.toString(),
      path: "/wishlist"
    },
    {
      title: "Addresses",
      value: addressesCount.toString(),
      path: "/address-book"
    },
    {
      title: "Cart",
      value: cartCount.toString(),
      path: "/cart"
    },
  ];

  return (
    <div className="account-stats">
      {stats.map((item, index) => (
        <Link
          to={item.path}
          className="stat-card"
          key={index}
          style={{ textDecoration: "none", color: "inherit", transition: "transform 0.2s ease, box-shadow 0.2s ease", cursor: "pointer" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "0 12px 24px rgba(0, 0, 0, 0.08)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0, 0, 0, .05)";
          }}
        >
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "#7c3aed", margin: "0 0 8px 0" }}>{item.value}</h2>
          <p style={{ fontSize: "14px", fontWeight: "600", color: "#64748b", margin: 0 }}>{item.title}</p>
        </Link>
      ))}
    </div>
  );
}

export default AccountStats;
