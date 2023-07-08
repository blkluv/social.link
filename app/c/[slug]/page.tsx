"use client";

import { usePathname } from "next/navigation"; 
import { useEffect, useState } from "react";
import { GetCommentsResponse, GetPostResponse, GetCommunityResponse } from "lemmy-js-client";
import { useNavbar } from "@/hooks/navbar";
import { AutoMediaType } from "@/utils/AutoMediaType";
import Username from "@/components/User/Username";
import Comment from "@/components/Comment";
import PostList from "@/components/PostList";
import RenderMarkdown from "@/components/ui/RenderMarkdown";

import styles from "@/styles/Pages/CommunityPage.module.css";

export default function Community() {
    const { navbar, setNavbar } = useNavbar();
    const [communityData, setCommunityData] = useState<GetCommunityResponse>({} as GetCommunityResponse);
    const [communityDataError, setCommunityDataError] = useState(true);
    const [descriptionExpanded, setDescriptionExpanded] = useState(false);

    useEffect(() => {
        setNavbar({ ...navbar!, showSort: false, showFilter: false, showSearch: true, showUser: true, showback: false })
    }, [])

    // community id
    const pathname = usePathname().split("/")[2];

    useEffect(() => {
        if(!communityDataError) return;
        (async () => {

            const data = await fetch(`/api/getCommunity?community_name=${pathname}`);
            const json = (await data.json());
            if(json.error) { 
                console.error(json.error)
                setCommunityDataError(true);
            } else {
                setCommunityDataError(false);
                setCommunityData(json as GetCommunityResponse);
                return;
            }
        })();

    }, [pathname, communityDataError]);

    
    return (
        <>
        <div className={`${styles.bannerOverlay}`}></div>
        <img src={communityData?.community_view?.community?.banner} alt="" className={`${styles.banner}`} />
        <div className={`${styles.headerWrapper}`}>
            <div className="flex flex-row gap-4 p-6 max-w-xl max-md:w-full items-center flex-wrap">
                <img className={`${styles.icon}`} src={communityData?.community_view?.community?.icon} alt=""  />
                <div className="flex flex-col h-full max-w-xl">
                    <h1 className=" text-3xl font-bold">c/{pathname}</h1>
                    <span>{communityData?.community_view?.counts?.subscribers} Subscribers</span>
                    <span>{communityData.community_view?.counts?.users_active_day} Users/Day</span>
                </div>
                <button className={`${styles.subscribeButton}`}>Subscribe</button>
            </div>
            
            <div className={`${styles.description}`}>
                <button onClick={() => setDescriptionExpanded(true)} className={`${styles.expandButton} ${descriptionExpanded && "hidden"}`}>Tap to expand</button>
                <div className={`${styles.descriptionOverlay}  ${descriptionExpanded && "hidden"}`}></div>
                <div className={`${styles.descriptionContent} ${descriptionExpanded && styles.descriptionContentExpanded} `}>
                    <span className="font-bold">Community Description</span>
                    <RenderMarkdown>{communityData?.community_view?.community?.description}</RenderMarkdown>
                    <div className="flex flex-col mt-4"> 
                        <span className="font-bold">Moderators</span>
                        <div className={`${styles.mods}`}>
                            {communityData?.moderators?.map((moderator) => (
                                <Username user={moderator?.moderator} baseUrl="" key={moderator?.moderator?.id} />
                            ))}
                        </div>
                    </div>
                    
                </div>
                <button onClick={() => setDescriptionExpanded(false)} className={`p-4 mt-2 ${!descriptionExpanded && "hidden"}`}>Collapse</button>
            </div>

        </div>   

        <div className={`${styles.sortsWrapper}`}>
            <div className={`${styles.sort}`}>
                <div className="flex flex-row items-center gap-0">
                    <span className="material-icons-outlined">whatshot</span>
                    <span>Hot</span>
                </div>
                
                <span className="material-icons">expand_more</span>
            </div>

            <div className="flex items-center">
                <span className="material-icons-outlined">view_day</span>
            </div>
        </div>

        <div className={`${styles.postsWrapper}`}>

            <PostList fetchParams={{ community_name: pathname }} />
        </div>

           
        
        
        </>
    )
}