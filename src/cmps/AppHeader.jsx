import { NavLink } from 'react-router-dom'
import { appHeaderIcons } from './SvgIcons'

export function AppHeader() {
  return (
    <header className="app-header full">
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
