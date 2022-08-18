import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { setExpirationTime } from '../../store/actions'
import useOnOutsideClick from '../../hooks/useOnOutsideClick'
import * as FaIcons from 'react-icons/fa'
import * as AiIcons from 'react-icons/ai'
import './styles.css'

const Toolbar = (props) => {
	const [menuToggle, setMenuToggle] = useState(false)
	const [sidebarToggle, setSidebarToggle] = useState(false)
	const menuRef = useRef(null)
	const sidebarRef = useRef(null)
	const navigate = useNavigate()
	const dispatch = useDispatch()

	useOnOutsideClick(menuRef, () => setMenuToggle(false))
	useOnOutsideClick(sidebarRef, () => setSidebarToggle(false))

	const onLogoutClickedHandler = () => {
		sidebarToggle && setSidebarToggle(false)
		dispatch(setExpirationTime(0))
		navigate('/login')
	}

	const sidebarItems = [
		{ name: 'Create Paper', url: '/newPaper' },
		{ name: 'Your Papers', url: '/yourPapers' },
		{ name: 'Submitted Responses', url: '/submittedResponses' },
		{ name: 'Profile', url: '/profile' },
	]

	let menu = (
		<div className={['menuContent', menuToggle ? 'showMenu' : null].join(' ')}>
			<NavLink to='/profile' onClick={() => setMenuToggle(false)}>
				Profile
			</NavLink>
			<NavLink to='/login' onClick={onLogoutClickedHandler}>
				Logout
			</NavLink>
		</div>
	)

	return (
		<header className='toolbar'>
			<nav>
				<div className='menuBars'>
					<FaIcons.FaBars onClick={() => setSidebarToggle(true)} />
				</div>

				<div className={sidebarToggle ? 'sidebar active' : 'sidebar'} ref={sidebarRef}>
					<div className='closeSidebar' onClick={() => setSidebarToggle(false)}>
						<AiIcons.AiOutlineClose />
					</div>

					{sidebarItems.map((item) => {
						return (
							<NavLink to={`${item.url}`} onClick={() => setSidebarToggle(false)} key={item.name}>
								{item.name}
							</NavLink>
						)
					})}

					<NavLink to='/' onClick={onLogoutClickedHandler}>
						Logout
					</NavLink>
				</div>

				<NavLink className='logo' to='/newPaper'>
					<img src='/assets/q.svg' alt='Question Paper Maker' className='icon' />
					<span>Question Paper Maker</span>
				</NavLink>

				<div className='navItems'>
					<NavLink to='/newPaper'>Create Paper</NavLink>
					<NavLink to='/yourPapers'>Your Papers</NavLink>
					<NavLink to='/submittedResponses'>Submitted Responses</NavLink>
				</div>

				<div className='cornerItems' ref={menuRef}>
					<img
						src='/assets/three-dots.svg'
						alt='Menu Icon'
						className='icon'
						onClick={() => setMenuToggle(!menuToggle)}
					/>
					{menu}
				</div>
			</nav>
		</header>
	)
}

export default Toolbar
