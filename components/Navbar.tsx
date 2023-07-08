/* eslint-disable @next/next/no-img-element */
"use client"
import { FormEvent, useState } from "react";
import Link from "next/link";
import { useSession } from "@/hooks/auth";
import { useNavbar } from "@/hooks/navbar";
import styles from "../styles/Navbar.module.css";
import Username from "./User/Username";

export default function Navbar() {
    const { session } = useSession();
    const { navbar, setNavbar } = useNavbar();
    const [isSearching, setIsSearching] = useState(false);
    const [filterClicked, setFilterClicked] = useState(false);
    const [userMenu, setUserMenu] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        alert("This isn't doing anything yet.")
    }


    const AutoLink = ({ href, children, className } : { href: string, children: any, className: string }) => {
        return session?.user?.my_user?.local_user_view?.person?.name ?
        <Link className={className} href={href}>{children}</Link> 
        : 
        <div className={className}>{children}</div>
    }

    const handleFilterOverlayClose = () => {
        setTimeout(() => {
            setFilterClicked(false);
            navbar && setNavbar({...navbar, overlayActive: false})
        }, 50)
    }

    const handleUserMenuOverlayClose = () => {
        setTimeout(() => {
            handleUserMenuClose();
            navbar && setNavbar({...navbar, overlayActive: false})
        }, 50)
    }

    const handleUserMenuClose = () => {
        // close the menu
        setUserMenu(false);

        setTimeout(() => {
            // set display: none
            document.getElementById("usermenu")?.style.setProperty("display", "none");
        }, 300)
    }

    const handleUserMenuOpen = () => {
        // set display: block
        document.getElementById("usermenu")?.style.setProperty("display", "flex");

        setTimeout(() => {
            // open the menu
            setUserMenu(true);
        }, 10)

    }

    return (
        <>
        <nav className={`${styles.wrapper} ${navbar?.hidden && "hidden"}`}>    
            <a href="/" className={styles.logo}>Nemmy</a>

            <div className="flex flex-row gap-4 items-center">

                { navbar?.showMenu &&
                <button className={`${styles.menu}`}>
                    <span className="material-icons">menu</span>
                </button>
                }

                { navbar?.showFilter &&
                <button className={`${styles.navButton}`} onClick={() =>{ setFilterClicked(!filterClicked); handleUserMenuClose(); setNavbar({...navbar, overlayActive: !filterClicked})  }}>
                    <div>
                        <span className="material-icons">filter_list</span>
                        <span className={`${styles.navButtonText}`}>All</span>
                    </div>
                    <span className="material-icons">arrow_drop_down</span> 
                </button> 
                }

                { navbar?.showSort &&
                <button className={`${styles.navButton}`}>
                    <div className="flex items-center gap-1">
                        <span className="material-icons-outlined">sort</span>
                        <span className={`${styles.navButtonText}`}>Hot</span>
                    </div>
                    <span className="material-icons">arrow_drop_down</span> 
                </button>
                }
            </div>

            

            { navbar?.showback &&
            <div className={`${styles.backButton}`}>
                <button className="flex items-center gap-2" onClick={() => window.history.back()}><span className="material-icons">arrow_back</span>Back</button>
            </div>
            }

            <div className="flex flex-row items-center gap-4">

                { navbar?.showSearch &&
                <form onSubmit={(e) => handleSubmit(e)} className={`${styles.navButton} ${styles.searchWrapper} ${isSearching && styles.searchWrapperActive}`}>
                    <span className="material-icons">search</span>
                    
                    {isSearching && <input onBlur={(e) => e.currentTarget.value.length == 0 && setIsSearching(false)} className={`${styles.search}`} type="text" placeholder="Search" />}
                </form>
                }

                
                { navbar?.showUser &&
                <>
                 {session.jwt.length > 0 ? 
                    <button onClick={() => { handleUserMenuOpen(); handleFilterOverlayClose(); setNavbar({ ...navbar, overlayActive: true }) }}  className={`${styles.userWrapper} cursor-pointer select-none`}>
                        <div className={styles.userImage}><img src={session.user.my_user?.local_user_view.person?.avatar || "https://i.imgur.com/IN6ZY30.png" } alt={"Account"} /></div>
                    </button>
                :
                    <Link href="/auth">
                        <button className={`${styles.userWrapper} cursor-pointer select-none`}>
                            Login
                        </button>
                    </Link>
                    
                }
                </>
                }

            </div>

          

            
        </nav>

        {/* Mobile Menu Left Side */}

        {/* User Menu Right Side */}
        <div id="usermenu" className={`${styles.userMenu} ${userMenu && styles.userMenuActive}`}>
            <div className={`${styles.userMenuTop}`}>

                <div className={`${styles.userProfiles}`}>

                    <div className={`${styles.userProfile}`}>
                        <img className={`${styles.userProfileBanner}`} src={session!.user.my_user?.local_user_view.person.banner} alt="" />
                        <div className={`${styles.userProfileBannerOverlay}`}></div>
                        <img className={`${styles.userProfileAvatar}`} src={session!.user.my_user?.local_user_view.person.avatar} alt="" />
                        <div className={`${styles.userProfileText}`}>
                            <span className={`${styles.userProfileUsername}`}>u/{session!.user.my_user?.local_user_view.person.name}</span>
                            <span className={`${styles.userProfileDisplayName}`}>{session!.user.my_user?.local_user_view.person.display_name}</span>
                        </div>
                    </div>

                    <div className="flex justify-center items-center w-12 h-52 px-6">
                        <button onClick={() => alert("Multiple Accounts are work in progress :)")}><span className="material-icons">add_circle</span></button>
                    </div>
                </div>

                <div className={`${styles.userMenuInteractionsTop}`}>
                    <button><span className="material-icons-outlined">notifications</span>Notifications</button>
                    <Link onClick={() => handleUserMenuOverlayClose()} href={`/u/${session?.user.my_user?.local_user_view?.person?.name}`}><button><span className="material-icons-outlined">account_circle</span>My Profile</button></Link>
                    <button><span className="material-icons-outlined">add_circle_outline</span>Create a Post</button>
                    <button><span className="material-icons-outlined">group_add</span>Create a Community</button>
                    <button><span className="material-icons-outlined">bookmarks</span>Bookmarked</button>
                </div>


            </div>

            <div className={`${styles.userMenuInteractionsBottom}`}>
                <button onClick={() => handleUserMenuOverlayClose()}><span className="material-icons-outlined">close</span>Close</button>
                <button><span className="material-icons-outlined">settings</span>Settings</button>
                <button><span className="material-icons-outlined">logout</span>Log out</button>
            </div>
        </div>

        {/* Filter Options */}
        <div className={`${styles.filterOptions} ${filterClicked && styles.filterActive}`}>
            <button className={`${styles.activeFilterOption}`} ><span className="material-icons">home</span>Home</button>
            <button><span className="material-icons-outlined">public</span>All</button>
            <button><span className="material-icons-outlined">location_on</span>Local</button>
        </div>

        { /* Mobile Menu Overlay */}
        <div onMouseUp={() => handleUserMenuOverlayClose()} onTouchEnd={() => handleUserMenuOverlayClose()} className={`${styles.overlay} z-50 ${userMenu && styles.overlayActive}`}></div>
        
        {/* Filter Overlay */}
        <div onTouchEnd={() => handleFilterOverlayClose()} onMouseUp={() => handleFilterOverlayClose()} className={`${styles.overlay} z-10 ${filterClicked && styles.overlayActive}`}></div>
        </>
    )
}