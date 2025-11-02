import { NavLink, useLocation } from 'react-router-dom'
import { appHeaderIcons } from './SvgIcons'

export function AppHeader() {
  const location = useLocation()

  // קובע אם נמצאים בדף הבית או בלוחות
  const isWhiteHeader = location.pathname === '/' || location.pathname.startsWith('/board')

  return (
    <header className={`app-header full ${isWhiteHeader ? 'white-bg' : ''}`}>
      <div className='header-container'>
        <div className='icons'>
          <span className='logo'>
            <NavLink to="/board">{appHeaderIcons.appLogo}</NavLink>
          </span>
        </div>

        <div className='search-bar flex'>
          {appHeaderIcons.searchIcon}
          <input type="text" placeholder='Search' />
          <button className='flex align-center'>Create</button>
        </div>
      </div>
    </header>
  )
}
