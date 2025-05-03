import { Link, NavLink } from 'react-router-dom';
export default function NavBar() {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Artists', path: '/artists' },
    { name: 'Equipment', path: '/equipment' },
    { name: 'Checkout/Return', path: '/checkout-return' },
    { name: 'Reserve', path: '/reserve' },
  ];
  return (
    <nav className="bg-black text-gray-100">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="font-black-ops-one text-[40px] text-red-500">
          JAM SOCIETY
        </Link>
        <ul className="flex space-x-6">
          {navItems.map(item => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `hover:text-red-500 ${isActive ? 'text-red-500' : ''}`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}